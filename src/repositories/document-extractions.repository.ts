import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { DocumentExtraction } from "@/types";

export interface NewExtractionField {
  field_name: string;
  field_value: string | null;
  confidence_score: number | null;
  page_number: number | null;
}

/**
 * Repository layer for `document_extractions`. Same rule as
 * DocumentsRepository: no business logic, just reads and writes.
 */
export class DocumentExtractionsRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async insertMany(documentId: string, fields: NewExtractionField[]): Promise<void> {
    if (fields.length === 0) return;

    const { error } = await this.supabase.from("document_extractions").insert(
      fields.map((f) => ({ document_id: documentId, ...f }))
    );

    if (error) throw error;
  }

  async listByDocument(documentId: string): Promise<DocumentExtraction[]> {
    const { data, error } = await this.supabase
      .from("document_extractions")
      .select("*")
      .eq("document_id", documentId)
      .order("field_name", { ascending: true })
      .returns<DocumentExtraction[]>();

    if (error) throw error;
    return data ?? [];
  }

  /**
   * Extracted-field rows for many documents at once, grouped by
   * document_id — used by the Documents page to show "N fields
   * extracted" per row and render each row's expandable detail
   * without an extra round trip per document.
   */
  async listByDocuments(documentIds: string[]): Promise<Record<string, DocumentExtraction[]>> {
    if (documentIds.length === 0) return {};

    const { data, error } = await this.supabase
      .from("document_extractions")
      .select("*")
      .in("document_id", documentIds)
      .order("field_name", { ascending: true })
      .returns<DocumentExtraction[]>();

    if (error) throw error;

    const grouped: Record<string, DocumentExtraction[]> = {};
    for (const row of data ?? []) {
      (grouped[row.document_id] ??= []).push(row);
    }
    return grouped;
  }

  async deleteByDocument(documentId: string): Promise<void> {
    const { error } = await this.supabase.from("document_extractions").delete().eq("document_id", documentId);
    if (error) throw error;
  }
}
