import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/reports?companyId=...
 * IMPORTANT: business owners should only ever see reports with
 * status = "approved" — draft/pending_approval reports are the CA's
 * working copy. RLS alone doesn't enforce that distinction (it only
 * gates by company), so this route filters by role explicitly.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  let query = supabase.from("reports").select("*").eq("company_id", companyId);
  if (profile?.role !== "ca") {
    query = query.eq("status", "approved");
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reports: data });
}

/**
 * POST /api/reports
 * Body: { companyId: string, title: string }
 * A CA starting a new draft reconciliation report for a client.
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
    return NextResponse.json({ error: "Only chartered accountants can create reports" }, { status: 403 });
  }

  const body = await request.json();
  const { companyId, title } = body as { companyId: string; title: string };

  const { data, error } = await supabase
    .from("reports")
    .insert({ company_id: companyId, ca_id: user.id, title, status: "draft" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ report: data }, { status: 201 });
}
