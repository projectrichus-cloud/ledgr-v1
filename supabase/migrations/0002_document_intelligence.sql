-- =============================================================
-- Ledgr — Document Intelligence Engine foundation
-- Purely additive migration: extends `documents`, adds
-- `document_extractions`. Nothing from 0001_init.sql is altered,
-- dropped, or renamed — existing upload/auth/onboarding flows are
-- unaffected.
-- =============================================================

-- -------------------------------------------------------------
-- Why a NEW `document_type` column instead of reusing `type`?
--
-- `documents.type` already exists and is set at upload time — it's
-- either chosen by the user or filename-guessed by the dropzone
-- (see components/upload/dropzone.tsx). It represents what the
-- uploader *declared* the document to be.
--
-- `documents.document_type` (added below) is what the Document
-- Intelligence engine *classifies* the document as, independently,
-- after inspecting it. Keeping these separate lets the product
-- eventually flag "the uploader said GSTR-3B, but classification
-- says Bank Statement" as a data-quality signal — that comparison
-- is only possible if the two values are stored separately.
--
-- Similarly, `documents.confidence` (existing, currently unused)
-- was a generic placeholder column. `confidence_score` (added below)
-- is specifically the Document Intelligence engine's own confidence
-- output and is what the new pipeline writes to. Both columns are
-- left in place; the engine only ever touches the new ones.
-- -------------------------------------------------------------

create type document_processing_status as enum (
  'uploaded',
  'processing',
  'classified',
  'extracted',
  'validated',
  'ready',
  'failed'
);

alter table documents
  add column document_type document_type,
  add column processing_status document_processing_status not null default 'uploaded',
  add column confidence_score numeric(5,2),
  add column processed_at timestamptz,
  add column processing_error text;

comment on column documents.document_type is
  'AI-classified document type, set by the Document Intelligence engine. Distinct from documents.type, which is declared at upload time.';
comment on column documents.processing_status is
  'Document Intelligence pipeline stage: uploaded -> processing -> classified -> extracted -> validated -> ready, or failed at any stage.';
comment on column documents.confidence_score is
  'Overall document-level confidence (0-100) from the Document Intelligence engine.';

create index idx_documents_processing_status on documents (processing_status);

-- -------------------------------------------------------------
-- document_extractions
-- One row per extracted field, rather than one JSON blob per
-- document. This is a deliberate schema choice: it lets the UI
-- (and future features — search, audit trail, per-field correction)
-- query, filter, and index individual fields directly in SQL,
-- and makes each field's own confidence score and page number
-- first-class instead of nested inside JSON.
-- -------------------------------------------------------------
create table document_extractions (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid not null references documents (id) on delete cascade,
  field_name text not null,
  field_value text,
  confidence_score numeric(5,2),
  page_number integer,
  created_at timestamptz not null default now()
);

create index idx_document_extractions_document_id on document_extractions (document_id);

alter table document_extractions enable row level security;

-- Same access pattern as `documents` itself (see 0001_init.sql):
-- the company's owner or its assigned CA can read/write extractions,
-- reached via the parent document's company_id.
create policy "company access to extractions" on document_extractions for all
  using (
    exists (
      select 1
      from documents
      join companies on companies.id = documents.company_id
      where documents.id = document_extractions.document_id
      and (
        companies.owner_id = auth.uid()
        or exists (
          select 1 from ca_clients
          where ca_clients.company_id = companies.id
          and ca_clients.ca_id = auth.uid()
        )
      )
    )
  );
