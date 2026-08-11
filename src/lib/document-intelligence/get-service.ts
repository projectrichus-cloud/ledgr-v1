import { createClient } from "@/lib/supabase/server";
import { DocumentsRepository } from "@/repositories/documents.repository";
import { DocumentExtractionsRepository } from "@/repositories/document-extractions.repository";
import { getDocumentIntelligenceProvider } from "@/lib/document-intelligence/providers";
import { DocumentIntelligenceService } from "@/lib/document-intelligence/document-intelligence.service";

/**
 * Composition root for the Document Intelligence engine on the server.
 * Keeps API routes free of wiring logic — a route just calls
 * `await getDocumentIntelligenceService()` and gets a fully-assembled,
 * request-scoped (RLS-respecting) service instance.
 */
export async function getDocumentIntelligenceService() {
  const supabase = await createClient();
  const documentsRepo = new DocumentsRepository(supabase);
  const extractionsRepo = new DocumentExtractionsRepository(supabase);
  const provider = getDocumentIntelligenceProvider();

  return new DocumentIntelligenceService(documentsRepo, extractionsRepo, provider);
}
