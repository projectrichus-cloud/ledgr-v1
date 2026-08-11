import type { DocumentType } from "@/types";
import type { DocumentIntelligenceProvider } from "@/lib/document-intelligence/providers/provider.interface";
import type {
  ClassificationInput,
  ClassificationResult,
  ExtractionInput,
  ExtractionResult,
  ExtractedFieldResult,
} from "@/lib/document-intelligence/types";

/**
 * Filename keyword -> document type. Intentionally standalone rather
 * than imported from components/upload/dropzone.tsx — the Document
 * Intelligence engine must not depend on the upload feature at all
 * (a real provider will classify from file *content*, not filenames,
 * so this heuristic is disposable and specific to the mock).
 */
const FILENAME_KEYWORDS: Array<[RegExp, DocumentType]> = [
  [/gstr.?1\b/i, "gstr1"],
  [/gstr.?3b/i, "gstr3b"],
  [/\bitr\b/i, "itr"],
  [/26.?as/i, "form_26as"],
  [/ais|tis/i, "ais_tis"],
  [/balance.?sheet/i, "balance_sheet"],
  [/(profit.?(&|and).?loss|\bp.?l\b)/i, "profit_loss"],
  [/trial.?balance/i, "trial_balance"],
  [/bank.?statement/i, "bank_statement"],
  [/invoice/i, "invoice"],
];

/** Realistic sample field sets per document type, in the shape a real
 * extraction provider would eventually return. Values are illustrative,
 * not computed from anything — this is a mock. */
const SAMPLE_FIELDS: Record<DocumentType, Array<{ name: string; value: string }>> = {
  gstr1: [
    { name: "gstin", value: "29ABCDE1234F1Z5" },
    { name: "outward_taxable_supplies", value: "4,620,000" },
    { name: "invoice_count", value: "142" },
  ],
  gstr3b: [
    { name: "gstin", value: "29ABCDE1234F1Z5" },
    { name: "taxable_turnover", value: "4,200,000" },
    { name: "tax_paid", value: "221,000" },
    { name: "itc_claimed", value: "94,000" },
  ],
  itr: [
    { name: "assessment_year", value: "2025-26" },
    { name: "total_income", value: "12,000,000" },
    { name: "tax_liability", value: "1,860,000" },
    { name: "tds_credit_claimed", value: "602,000" },
  ],
  form_26as: [
    { name: "tan", value: "BLRA01234B" },
    { name: "deductor_name", value: "Acme Vendors Pvt Ltd" },
    { name: "tds_deducted", value: "18,400" },
  ],
  ais_tis: [
    { name: "interest_income", value: "42,300" },
    { name: "dividend_income", value: "8,150" },
    { name: "reported_transaction_count", value: "23" },
  ],
  balance_sheet: [
    { name: "total_assets", value: "31,400,000" },
    { name: "total_liabilities", value: "18,900,000" },
    { name: "net_worth", value: "12,500,000" },
  ],
  profit_loss: [
    { name: "revenue", value: "18,400,000" },
    { name: "total_expenses", value: "15,760,000" },
    { name: "net_profit", value: "2,640,000" },
  ],
  trial_balance: [
    { name: "total_debit", value: "42,180,000" },
    { name: "total_credit", value: "42,180,000" },
  ],
  bank_statement: [
    { name: "account_number", value: "XXXXXX4821" },
    { name: "closing_balance", value: "3,140,000" },
    { name: "total_credits", value: "19,000,000" },
    { name: "total_debits", value: "17,000,000" },
  ],
  invoice: [
    { name: "invoice_number", value: "INV-2026-0142" },
    { name: "invoice_date", value: "2026-03-14" },
    { name: "vendor_name", value: "Acme Vendors Pvt Ltd" },
    { name: "amount", value: "84,500" },
  ],
};

function randomInRange(min: number, max: number) {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

/** Small artificial delay so the UI's "Processing" state is visible
 * for more than a single frame — stands in for real network/inference
 * latency a real provider would have anyway. */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock implementation of DocumentIntelligenceProvider. Classifies by
 * filename, returns realistic-looking sample fields per document type,
 * and simulates confidence scores and processing latency — enough to
 * exercise the full pipeline and UI end-to-end with no external
 * dependency, API key, or cost.
 *
 * Nothing outside this file (and providers/index.ts, which registers
 * it) should ever import from here directly — always go through the
 * DocumentIntelligenceProvider interface.
 */
export class MockDocumentIntelligenceProvider implements DocumentIntelligenceProvider {
  readonly name = "mock";

  async classify(input: ClassificationInput): Promise<ClassificationResult> {
    await delay(400);

    const match = FILENAME_KEYWORDS.find(([pattern]) => pattern.test(input.fileName));
    const documentType: DocumentType = match?.[1] ?? "invoice";

    // Confident when the filename matched a known pattern; a lower,
    // more "uncertain AI" score when we had to fall back to a guess.
    const confidence = match ? randomInRange(88, 99) : randomInRange(55, 74);

    return { documentType, confidence };
  }

  async extract(input: ExtractionInput): Promise<ExtractionResult> {
    await delay(600);

    const sampleFields = SAMPLE_FIELDS[input.documentType] ?? SAMPLE_FIELDS.invoice;

    const fields: ExtractedFieldResult[] = sampleFields.map((f) => ({
      fieldName: f.name,
      fieldValue: f.value,
      confidence: randomInRange(78, 99),
      pageNumber: Math.floor(Math.random() * 3) + 1,
    }));

    const overallConfidence =
      Math.round((fields.reduce((sum, f) => sum + f.confidence, 0) / fields.length) * 100) / 100;

    return { fields, overallConfidence };
  }
}
