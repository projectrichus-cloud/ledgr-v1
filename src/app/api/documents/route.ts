import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DocumentType } from "@/types";

/**
 * GET /api/documents?companyId=...
 * Lists documents for a company (RLS restricts to owner/assigned CA).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");

  if (!companyId) {
    return NextResponse.json({ error: "companyId is required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ documents: data });
}

/**
 * POST /api/documents
 * Body: { companyId: string, type: DocumentType, fileName: string, fileSizeBytes: number }
 *
 * Records a document row as soon as an upload starts (status:
 * "uploading"). The actual file bytes go to Supabase Storage from the
 * client — see components/upload/dropzone.tsx — and a follow-up PATCH
 * to /api/documents/[id] flips status to "processing" then "completed"
 * once storage confirms the upload. No AI extraction is wired up yet,
 * per the brief — "completed" here just means "the file made it to
 * storage safely."
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { companyId, type, fileName, fileSizeBytes } = body as {
    companyId: string;
    type: DocumentType;
    fileName: string;
    fileSizeBytes: number;
  };

  if (!companyId || !type) {
    return NextResponse.json({ error: "companyId and type are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({
      company_id: companyId,
      type,
      file_name: fileName,
      file_size_bytes: fileSizeBytes,
      status: "uploading",
      uploaded_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await supabase.from("activity_log").insert({
    company_id: companyId,
    actor_id: user.id,
    action: "document_uploaded",
    message: `Uploaded ${fileName ?? type}`,
  });

  return NextResponse.json({ document: data }, { status: 201 });
}
