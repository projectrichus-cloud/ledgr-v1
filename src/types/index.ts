// Hand-written domain types mirroring supabase/migrations/0001_init.sql.
// Once you connect a real Supabase project, run `npm run db:types` to
// generate src/types/database.types.ts directly from your live schema —
// these two files should stay in sync.

export type UserRole = "business_owner" | "ca";

export type DocumentType =
  | "gstr1"
  | "gstr3b"
  | "itr"
  | "form_26as"
  | "ais_tis"
  | "balance_sheet"
  | "profit_loss"
  | "trial_balance"
  | "bank_statement"
  | "invoice";

export type DocumentStatus = "missing" | "uploading" | "processing" | "completed" | "failed";

/**
 * Document Intelligence pipeline stage — distinct from DocumentStatus above,
 * which only tracks file upload/storage state. A document reaches
 * status "completed" (file safely in storage) before processing_status
 * even starts at "uploaded". See supabase/migrations/0002_document_intelligence.sql
 * for the full explanation of why these are two separate state machines.
 */
export type ProcessingStatus =
  | "uploaded"
  | "processing"
  | "classified"
  | "extracted"
  | "validated"
  | "ready"
  | "failed";

export type ClientStatus = "onboarding" | "action_needed" | "complete";
export type RiskLevel = "low" | "medium" | "high";
export type RequestStatus = "pending" | "fulfilled" | "cancelled";
export type ReportStatus = "draft" | "pending_approval" | "approved";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Company {
  id: string;
  owner_id: string;
  name: string;
  gstin: string | null;
  pan: string | null;
  sector: string | null;
  financial_year: string;
  created_at: string;
}

export interface CaClient {
  id: string;
  ca_id: string;
  company_id: string;
  status: ClientStatus;
  risk_level: RiskLevel;
  invited_email: string | null;
  created_at: string;
  // joined fields, populated by API routes for convenience
  company?: Company;
}

export interface Document {
  id: string;
  company_id: string;
  type: DocumentType;
  status: DocumentStatus;
  file_path: string | null;
  file_name: string | null;
  file_size_bytes: number | null;
  confidence: number | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
  // --- Document Intelligence Engine fields (see migration 0002) ---
  /** AI-classified type — null until the pipeline reaches "classified". */
  document_type: DocumentType | null;
  processing_status: ProcessingStatus;
  /** Overall document-level confidence (0-100) — null until "extracted". */
  confidence_score: number | null;
  /** Set once the pipeline reaches a terminal state ("ready" or "failed"). */
  processed_at: string | null;
  /** Populated only when processing_status is "failed". */
  processing_error: string | null;
}

/** One extracted field from a document. Each field is its own row — see
 * migration 0002_document_intelligence.sql for why. */
export interface DocumentExtraction {
  id: string;
  document_id: string;
  field_name: string;
  field_value: string | null;
  confidence_score: number | null;
  page_number: number | null;
  created_at: string;
}

export interface DocumentRequest {
  id: string;
  company_id: string;
  ca_id: string;
  document_type: DocumentType;
  note: string | null;
  status: RequestStatus;
  created_at: string;
  fulfilled_document_id: string | null;
}

export interface Report {
  id: string;
  company_id: string;
  ca_id: string;
  title: string;
  status: ReportStatus;
  file_path: string | null;
  approved_at: string | null;
  created_at: string;
}

export interface ActivityLogEntry {
  id: string;
  company_id: string;
  actor_id: string | null;
  action: string;
  message: string;
  created_at: string;
}

export interface Note {
  id: string;
  company_id: string;
  author_id: string;
  body: string;
  created_at: string;
}
