import type { ClassificationInput, ClassificationResult, ExtractionInput, ExtractionResult } from "@/lib/document-intelligence/types";

/**
 * The contract every Document Intelligence provider must satisfy.
 *
 * This is the single seam where a real AI/OCR vendor gets plugged in
 * later. To add OpenAI, Gemini, Azure Document Intelligence, or Google
 * Document AI: write one new class implementing this interface,
 * register it in providers/index.ts, and change an environment
 * variable. Nothing in the repository layer, the service layer, the
 * API route, or the UI needs to change — they all depend on this
 * interface, never on a concrete provider.
 *
 * Keep implementations of this interface "dumb": no Supabase calls, no
 * knowledge of the `documents` table, no business rules about what
 * counts as a valid extraction. That orchestration lives in
 * DocumentIntelligenceService, not here — a provider's only job is
 * "given a file, tell me what it is and what's in it."
 */
export interface DocumentIntelligenceProvider {
  /** A short identifier for logging/debugging, e.g. "mock", "openai", "azure-document-intelligence". */
  readonly name: string;

  classify(input: ClassificationInput): Promise<ClassificationResult>;

  extract(input: ExtractionInput): Promise<ExtractionResult>;
}
