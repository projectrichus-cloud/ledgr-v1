import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DocumentType } from "@/types";

/**
 * GET /api/document-requests?companyId=...
 * Lists open (pending) document requests for a company — powers the
 * "Requests from your CA" panel on the owner dashboard.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("document_requests")
    .select("*")
    .eq("company_id", companyId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ requests: data });
}

/**
 * POST /api/document-requests
 * Body: { companyId: string, documentType: DocumentType, note?: string }
 * A CA asking a business owner to upload something specific.
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
    return NextResponse.json({ error: "Only chartered accountants can request documents" }, { status: 403 });
  }

  const body = await request.json();
  const { companyId, documentType, note } = body as {
    companyId: string;
    documentType: DocumentType;
    note?: string;
  };

  const { data, error } = await supabase
    .from("document_requests")
    .insert({ company_id: companyId, ca_id: user.id, document_type: documentType, note })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_log").insert({
    company_id: companyId,
    actor_id: user.id,
    action: "request_created",
    message: `Requested ${documentType}`,
  });

  return NextResponse.json({ request: data }, { status: 201 });
}
