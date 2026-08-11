import type { DocumentType } from "@/types";

/** Human-readable label + short code for every supported document type. */
export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  gstr1: "GSTR-1",
  gstr3b: "GSTR-3B",
  itr: "Income Tax Return",
  form_26as: "Form 26AS",
  ais_tis: "AIS / TIS",
  balance_sheet: "Balance Sheet",
  profit_loss: "Profit & Loss",
  trial_balance: "Trial Balance",
  bank_statement: "Bank Statement",
  invoice: "Invoice",
};

export const ALL_DOCUMENT_TYPES = Object.keys(DOCUMENT_TYPE_LABELS) as DocumentType[];

export const REQUIRED_DOCUMENT_TYPES: DocumentType[] = [
  "gstr1",
  "gstr3b",
  "itr",
  "form_26as",
  "ais_tis",
  "balance_sheet",
  "profit_loss",
  "trial_balance",
  "bank_statement",
];

export const SITE_NAME = "Ledgr";
export const SITE_DESCRIPTION =
  "The AI financial intelligence platform for Indian chartered accountants and finance teams.";

/** Human-readable label for each Document Intelligence pipeline stage. */
export const PROCESSING_STATUS_LABELS: Record<
  "uploaded" | "processing" | "classified" | "extracted" | "validated" | "ready" | "failed",
  string
> = {
  uploaded: "Uploaded",
  processing: "Processing",
  classified: "Classified",
  extracted: "Extracted",
  validated: "Validated",
  ready: "Ready",
  failed: "Failed",
};
