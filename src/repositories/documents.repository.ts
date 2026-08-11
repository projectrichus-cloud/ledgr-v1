import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { Document, ProcessingStatus, DocumentType } from "@/types";

export interface ProcessingStatusPatch {
  processing_status: ProcessingStatus;
  document_type?: DocumentType;
  confidence_score?: number;
  processed_at?: string;
  processing_error?: string | null;
}

export class DocumentsRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findById(documentId: string): Promise<Document | null> {
    const { data, error } = await this.supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .maybeSingle();

    if (error) throw error;
    return data as Document | null;
  }

  async updateProcessingStatus(documentId: string, patch: ProcessingStatusPatch): Promise<void> {
    const { error } = await this.supabase
      .from("documents")
      .update(patch)
      .eq("id", documentId);

    if (error) throw error;
  }

  async listByCompany(companyId: string): Promise<Document[]> {
    const { data, error } = await this.supabase
      .from("documents")
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as Document[];
  }
}