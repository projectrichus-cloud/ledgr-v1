import type { DocumentType } from "@/types";

/**
 * These are the types the *provider interface* speaks in — deliberately
 * separate from the database row shapes in src/types/index.ts.
 *
 * This is the key seam for future AI integration: a provider (mock,
 * OpenAI, Gemini, Azure Document Intelligence, Google Document AI...)
 * only ever needs to know about these plain input/output shapes. It
 * never touches Supabase, never knows about `documents` or
 * `document_extractions` tables, and never runs a SQL query. That work
 * belongs to the repository and service layers. A provider is a pure
 * function of "here's a file" -> "here's what I found in it."
 */

export interface ClassificationInput {
  fileName: string;
  filePath?: string | null;
  documentBytes?: Buffer;
}

export interface ClassificationResult {
  documentType: DocumentType;
  /** 0-100 */
  confidence: number;
}

export interface ExtractionInput {
  fileName: string;
  documentType: DocumentType;
  filePath?: string | null;
  documentBytes?: Buffer;
}

export interface ExtractedFieldResult {
  fieldName: string;
  fieldValue: string;
  /** 0-100 */
  confidence: number;
  pageNumber?: number;
}

export interface ExtractionResult {
  fields: ExtractedFieldResult[];
  /** 0-100 — aggregate confidence across all extracted fields. */
  overallConfidence: number;
}

/** Thrown by the service layer, never by a provider directly. */
export class DocumentNotFoundError extends Error {
  constructor(documentId: string) {
    super(`Document not found: ${documentId}`);
    this.name = "DocumentNotFoundError";
  }
}
