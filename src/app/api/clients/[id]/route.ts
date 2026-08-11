import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/clients/[id]
 * [id] is a company_id. Returns the company plus its documents, open
 * document requests, and notes — everything the Client Profile page
 * needs in one call. RLS (see migration 0001) already restricts this
 * to the company's owner or its assigned CA.
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [{ data: company, error: companyError }, { data: documents }, { data: requests }, { data: notes }] =
    await Promise.all([
      supabase.from("companies").select("*").eq("id", id).single(),
      supabase.from("documents").select("*").eq("company_id", id).order("created_at", { ascending: false }),
      supabase.from("document_requests").select("*").eq("company_id", id).eq("status", "pending"),
      supabase.from("notes").select("*").eq("company_id", id).order("created_at", { ascending: false }),
    ]);

  if (companyError) {
    return NextResponse.json({ error: companyError.message }, { status: 404 });
  }

  return NextResponse.json({ company, documents, requests, notes });
}
