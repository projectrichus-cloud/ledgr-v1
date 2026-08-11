import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { DocumentStatus } from "@/types";
import { getDocumentIntelligenceService } from "@/lib/document-intelligence/get-service";

/**
 * PATCH /api/documents/[id]
 * Body: { status?: DocumentStatus, filePath?: string }
 * Used to flip a document from "uploading" -> "completed" (or "failed")
 * once the browser confirms the Supabase Storage upload finished.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  const body = await request.json();

  const { status, filePath } = body as {
    status?: DocumentStatus;
    filePath?: string;
  };

  const { data, error } = await supabase
    .from("documents")
    .update({
      ...(status && { status }),
      ...(filePath && { file_path: filePath }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  console.log("PATCH STATUS =", status);

  if (status === "completed") {
    console.log("STARTING AI PROCESSING");

    try {
      const intelligence =
        await getDocumentIntelligenceService();

      console.log("SERVICE CREATED");

      await intelligence.processDocument(id);

      console.log("PROCESSING FINISHED");
    } catch (err) {
      console.error("AI ERROR:", err);
    }
  }

  return NextResponse.json({
    document: data,
  });
}

/**
 * DELETE /api/documents/[id]
 * Removes a document row.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
  });
}