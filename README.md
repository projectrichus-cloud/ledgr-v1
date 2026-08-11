# Ledgr — Production Foundation

This is the production-ready foundation for Ledgr, rebuilt from the original static HTML
prototype using **Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, and Supabase
(PostgreSQL)**.

**What this is:** real authentication, real database-backed pages, a proper folder
structure, reusable components, and API routes for clients, documents, document
requests, and reports.

**What this is NOT (yet):** AI document extraction, reconciliation, or findings
generation. Every AI-related screen (`/ca/findings/[clientId]`) renders clearly-labeled
sample data so the UI is complete and reviewable, but there's no AI pipeline behind it.
That's intentionally the next project, not this one.

---

## 1. Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) |
| Database | PostgreSQL via Supabase |
| Auth | Supabase Auth (email/password) |
| File storage | Supabase Storage (bucket: `documents`) |

## 2. Folder structure

```
src/
  app/
    (marketing)/          # public landing page — route group, no /marketing in the URL
    (auth)/                # login, signup, onboarding — centered card layout
    (app)/                  # everything behind login — sidebar + topbar shell
      owner/                # Business Owner screens
      ca/                     # Chartered Accountant screens
      upload/                # shared upload screen (role-aware)
    api/                    # route handlers (clients, documents, requests, reports)
    dashboard/            # role-based redirect: -> /owner/dashboard or /ca/dashboard
  components/
    ui/                     # shadcn primitives (button, card, badge, input, dialog...)
    layout/                # Sidebar, Topbar — shared shell pieces
    marketing/          # landing page sections
    dashboard/          # KpiCard, ActivityTimeline, RiskDistribution, etc.
    owner/                  # Business-Owner-only components
    ca/                       # CA-only components
    upload/                # Dropzone, UploadRow, MissingDocsGrid
    client-profile/     # Client Profile page components
    findings/              # AI Findings page components
    shared/                # StatusBadge, ScoreRing — used by multiple roles
  lib/
    supabase/             # browser client, server client, middleware helper
    utils.ts               # cn(), formatINR(), formatDate(), timeAgo()
    constants.ts        # document type labels, nav constants
  types/                    # hand-written domain types + Supabase codegen placeholder
supabase/
  migrations/0001_init.sql  # full schema: tables, enums, RLS policies, triggers
  seed.sql                        # optional sample data (commented out — see below)
middleware.ts               # protects /owner, /ca, /upload, /dashboard
```

---

## 3. Prerequisites

You'll need three things installed on your computer before starting. If you're not a
developer, install them in this order:

1. **Node.js** (version 20 or later) — [nodejs.org](https://nodejs.org). Download the
   "LTS" version and run the installer with default options.
2. **A code editor** — [VS Code](https://code.visualstudio.com) is the easiest.
3. **A Supabase account** — [supabase.com](https://supabase.com), free tier is enough
   to start. Click "New Project" and give it any name/password (save the database
   password somewhere — you'll need it once).

## 4. Install and configure

```bash
# 1. Open a terminal in this project's folder, then install dependencies:
npm install

# 2. Copy the environment template:
cp .env.local.example .env.local
```

Now open `.env.local` in your editor and fill in three values from your Supabase
project dashboard (**Project Settings → API**):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 5. Set up the database

In your Supabase project dashboard, go to **SQL Editor → New query**, then:

1. Open `supabase/migrations/0001_init.sql` from this project, copy its entire contents,
   paste into the SQL editor, and click **Run**. This creates every table, enum, and
   security policy.
2. Go to **Storage** in the Supabase sidebar → **New bucket** → name it exactly
   `documents` → keep it private (not public).

### Loading sample data (optional)

`supabase/seed.sql` has sample rows commented out, because they reference two demo
users that don't exist until you create them:

1. In Supabase, go to **Authentication → Users → Add user**, create one user for a
   demo Business Owner and one for a demo CA (any email/password).
2. Copy each user's UUID (shown in the Users table).
3. Open `supabase/seed.sql`, paste the UUIDs where indicated, uncomment the `insert`
   statements, and run it in the SQL Editor.

You can skip this entirely — the app works fine with zero data, showing proper empty
states everywhere instead.

## 6. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see the landing page.

- Click **Start Free** to sign up. Pick **Business Owner** or **Chartered Accountant** —
  this determines which onboarding flow and dashboard you land on.
- If you signed up as a Business Owner, you'll be asked for company details, then land
  on `/owner/dashboard`.
- If you signed up as a CA, you'll land on `/ca/dashboard`, where "+ New Client" lets you
  create a client company (the actual invite email isn't wired up yet — see the TODO in
  `src/app/api/clients/route.ts`).

## 7. Building for production

```bash
npm run build
npm start
```

The easiest place to deploy a Next.js app like this is **[Vercel](https://vercel.com)** —
connect your GitHub repo, add the same three environment variables in the Vercel
project settings, and it deploys automatically on every push.

---

## 8. Common errors

**"Module not found: Can't resolve '@supabase/ssr'"**
Run `npm install` again — a dependency didn't finish installing.

**"Invalid API key" or blank data everywhere**
Double check `.env.local` — the anon key and URL must come from the *same* Supabase
project, and the file must be named exactly `.env.local` (not `.env.local.txt`).

**"relation \"companies\" does not exist"**
The migration SQL hasn't been run yet — go back to Step 5.

**Signing up does nothing / infinite redirect loop**
By default, Supabase requires email confirmation before a session is created. For local
development, go to **Authentication → Providers → Email** in Supabase and turn off
"Confirm email" — then sign-up logs you in immediately, matching this app's flow.

**"new row violates row-level security policy"**
This means you're trying to insert/read a row that RLS doesn't think you're allowed to
touch — usually because a `ca_clients` link wasn't created, or because you're using the
anon key for something that needs the service role key. Check `0001_init.sql`'s policies
against what you're trying to do.

**Styles look broken / unstyled**
Stop the dev server (`Ctrl+C`) and restart with `npm run dev` — Tailwind sometimes needs
a fresh build after editing `tailwind.config.ts`.

---

## 9. What's next (not built yet, on purpose)

- **AI document extraction** — reading actual figures out of the uploaded PDFs
- **Reconciliation engine** — the logic that generates real findings (right now,
  `/ca/findings/[clientId]` shows clearly-labeled sample findings)
- **Real invite emails** — `POST /api/clients` creates the database rows but doesn't
  send an email yet
- **Financial summaries** — the GST/Tax/Bank summary cards on the Client Profile page
  use placeholder figures until there's a real extraction pipeline to compute them from
- **Notifications** — the bell icon in the topbar is currently decorative

Each of these is flagged with a `TODO` comment in the relevant file.
