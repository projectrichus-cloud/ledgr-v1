-- =============================================================
-- Ledgr — initial schema
-- Run this against your Supabase project (see README.md for how).
-- No AI-related tables yet, by design — this is the data foundation
-- for users, companies, documents, requests, and reports only.
-- =============================================================

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";

-- ---------- Enums ----------
create type user_role as enum ('business_owner', 'ca');

create type document_type as enum (
  'gstr1',
  'gstr3b',
  'itr',
  'form_26as',
  'ais_tis',
  'balance_sheet',
  'profit_loss',
  'trial_balance',
  'bank_statement',
  'invoice'
);

create type document_status as enum ('missing', 'uploading', 'processing', 'completed', 'failed');

create type client_status as enum ('onboarding', 'action_needed', 'complete');

create type risk_level as enum ('low', 'medium', 'high');

create type request_status as enum ('pending', 'fulfilled', 'cancelled');

create type report_status as enum ('draft', 'pending_approval', 'approved');

-- ---------- profiles ----------
-- One row per authenticated user (both business owners and CAs).
-- Mirrors auth.users 1:1, created automatically via trigger below.
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role user_role not null,
  full_name text not null,
  email text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ---------- companies ----------
-- A business owner's company. One business owner can (eventually) own
-- more than one company, so this is a separate table rather than a
-- column on profiles.
create table companies (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  gstin text,
  pan text,
  sector text,
  financial_year text not null default '2025-26',
  created_at timestamptz not null default now()
);

-- ---------- ca_clients ----------
-- Links a CA to a company they manage. This is what powers the CA's
-- "client list" and lets one company be assigned to a specific CA.
create table ca_clients (
  id uuid primary key default uuid_generate_v4(),
  ca_id uuid not null references profiles (id) on delete cascade,
  company_id uuid not null references companies (id) on delete cascade,
  status client_status not null default 'onboarding',
  risk_level risk_level not null default 'low',
  invited_email text,
  created_at timestamptz not null default now(),
  unique (ca_id, company_id)
);

-- ---------- documents ----------
create table documents (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies (id) on delete cascade,
  type document_type not null,
  status document_status not null default 'uploading',
  file_path text, -- path inside the Supabase Storage bucket
  file_name text,
  file_size_bytes bigint,
  confidence numeric(5,2), -- reserved for future AI extraction confidence score
  uploaded_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- document_requests ----------
-- A CA asking a business owner for a missing or corrected document.
create table document_requests (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies (id) on delete cascade,
  ca_id uuid not null references profiles (id) on delete cascade,
  document_type document_type not null,
  note text,
  status request_status not null default 'pending',
  created_at timestamptz not null default now(),
  fulfilled_document_id uuid references documents (id)
);

-- ---------- reports ----------
create table reports (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies (id) on delete cascade,
  ca_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  status report_status not null default 'draft',
  file_path text,
  approved_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------- activity_log ----------
-- Powers the "Recent Activity" timelines on both dashboards.
create table activity_log (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies (id) on delete cascade,
  actor_id uuid references profiles (id),
  action text not null, -- e.g. 'document_uploaded', 'request_created', 'report_approved'
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------- notes ----------
create table notes (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references companies (id) on delete cascade,
  author_id uuid not null references profiles (id),
  body text not null,
  created_at timestamptz not null default now()
);

-- =============================================================
-- Auto-create a profile row whenever someone signs up.
-- Reads role + full_name out of the signup form's metadata.
-- =============================================================
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'business_owner'),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================
-- Row Level Security
-- Starting point only — tighten further before going to production.
-- =============================================================
alter table profiles enable row level security;
alter table companies enable row level security;
alter table ca_clients enable row level security;
alter table documents enable row level security;
alter table document_requests enable row level security;
alter table reports enable row level security;
alter table activity_log enable row level security;
alter table notes enable row level security;

-- profiles: everyone can read their own profile
create policy "read own profile" on profiles for select using (auth.uid() = id);
create policy "update own profile" on profiles for update using (auth.uid() = id);

-- companies: owner can do everything with their own company;
-- assigned CA can read it
create policy "owner manages own company" on companies for all
  using (auth.uid() = owner_id);
create policy "assigned ca reads company" on companies for select
  using (exists (
    select 1 from ca_clients
    where ca_clients.company_id = companies.id
    and ca_clients.ca_id = auth.uid()
  ));

-- ca_clients: CA manages their own client links
create policy "ca manages own client links" on ca_clients for all
  using (auth.uid() = ca_id);

-- documents: owner of the company, or the assigned CA, can read/write
create policy "company access to documents" on documents for all
  using (
    exists (select 1 from companies where companies.id = documents.company_id and companies.owner_id = auth.uid())
    or exists (select 1 from ca_clients where ca_clients.company_id = documents.company_id and ca_clients.ca_id = auth.uid())
  );

-- document_requests: same access pattern
create policy "company access to requests" on document_requests for all
  using (
    exists (select 1 from companies where companies.id = document_requests.company_id and companies.owner_id = auth.uid())
    or exists (select 1 from ca_clients where ca_clients.company_id = document_requests.company_id and ca_clients.ca_id = auth.uid())
  );

-- reports: same access pattern (business owners can only ever SELECT
-- approved reports — enforced in the API route, not just RLS)
create policy "company access to reports" on reports for all
  using (
    exists (select 1 from companies where companies.id = reports.company_id and companies.owner_id = auth.uid())
    or exists (select 1 from ca_clients where ca_clients.company_id = reports.company_id and ca_clients.ca_id = auth.uid())
  );

-- activity_log / notes: same access pattern
create policy "company access to activity" on activity_log for all
  using (
    exists (select 1 from companies where companies.id = activity_log.company_id and companies.owner_id = auth.uid())
    or exists (select 1 from ca_clients where ca_clients.company_id = activity_log.company_id and ca_clients.ca_id = auth.uid())
  );

create policy "company access to notes" on notes for all
  using (
    exists (select 1 from companies where companies.id = notes.company_id and companies.owner_id = auth.uid())
    or exists (select 1 from ca_clients where ca_clients.company_id = notes.company_id and ca_clients.ca_id = auth.uid())
  );
