import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/clients
 * Returns every company assigned to the logged-in CA, with the company
 * details joined in. Used by the CA dashboard's client list.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("ca_clients")
    .select("*, company:companies(*)")
    .eq("ca_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ clients: data });
}

/**
 * POST /api/clients
 * Body: { companyName: string, ownerEmail: string, sector: string }
 *
 * Creates a placeholder company (owner_id is null until the invited
 * owner signs up and claims it — that claim flow is a TODO for a later
 * iteration) plus a ca_clients link, and records the invited email.
 *
 * TODO: actually send the invite email (e.g. via Supabase Auth's
 * inviteUserByEmail from a server-only service-role client, or a
 * transactional email provider).
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "ca") {
    return NextResponse.json({ error: "Only chartered accountants can invite clients" }, { status: 403 });
  }

  const body = await request.json();
  const { companyName, ownerEmail, sector } = body;

  if (!companyName || !ownerEmail) {
    return NextResponse.json({ error: "Company name and owner email are required" }, { status: 400 });
  }

  // NOTE: companies.owner_id is NOT NULL in the current schema (see
  // supabase/migrations/0001_init.sql). For a real invite-before-signup
  // flow, either make owner_id nullable and backfill it when the owner
  // claims the invite, or create the auth user server-side immediately
  // via the service role key. Documented as a follow-up rather than
  // solved here since it's a product decision, not just plumbing.
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({ owner_id: user.id, name: companyName, sector })
    .select()
    .single();

  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 500 });
  }

  const { error: linkError } = await supabase.from("ca_clients").insert({
    ca_id: user.id,
    company_id: company.id,
    invited_email: ownerEmail,
    status: "onboarding",
  });

  if (linkError) {
    return NextResponse.json({ error: linkError.message }, { status: 500 });
  }

  return NextResponse.json({ company }, { status: 201 });
}
