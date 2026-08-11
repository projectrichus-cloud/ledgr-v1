import { DocumentsRepository } from "@/repositories/documents.repository";
import { DocumentExtractionsRepository } from "@/repositories/document-extractions.repository";
import type { DocumentIntelligenceProvider } from "@/lib/document-intelligence/providers/provider.interface";
import { DocumentNotFoundError } from "@/lib/document-intelligence/types";
import type { Document } from "@/types";
import { StorageService } from "@/lib/storage/storage.service";

interface ValidationResult {
  passed: boolean;
  reason?: string;
}

const MIN_CONFIDENCE_TO_PASS_VALIDATION = 70;

export class DocumentIntelligenceService {
  private readonly storage = new StorageService();

  constructor(
    private readonly documentsRepo: DocumentsRepository,
    private readonly extractionsRepo: DocumentExtractionsRepository,
    private readonly provider: DocumentIntelligenceProvider
  ) {}

  async processDocument(documentId: string): Promise<Document> {
    const document = await this.documentsRepo.findById(documentId);

    if (!document) {
      throw new DocumentNotFoundError(documentId);
    }

    try {
      await this.documentsRepo.updateProcessingStatus(documentId, {
        processing_status: "processing",
      });

      let documentBytes: Buffer | undefined;

      if (document.file_path) {
        documentBytes = await this.storage.downloadDocument(
          document.file_path
        );
      }

      const classification = await this.provider.classify({
        fileName: document.file_name ?? "",
        filePath: document.file_path,
        documentBytes,
      });

      await this.documentsRepo.updateProcessingStatus(documentId, {
        processing_status: "classified",
        document_type: classification.documentType,
      });

      const extraction = await this.provider.extract({
        fileName: document.file_name ?? "",
        documentType: classification.documentType,
        filePath: document.file_path,
        documentBytes,
      });

      await this.extractionsRepo.deleteByDocument(documentId);

      await this.extractionsRepo.insertMany(
        documentId,
        extraction.fields.map((f) => ({
          field_name: f.fieldName,
          field_value: f.fieldValue,
          confidence_score: f.confidence,
          page_number: f.pageNumber ?? null,
        }))
      );

      await this.documentsRepo.updateProcessingStatus(documentId, {
        processing_status: "extracted",
        confidence_score: extraction.overallConfidence,
      });

      const validation = this.validate(extraction.overallConfidence);

      await this.documentsRepo.updateProcessingStatus(documentId, {
        processing_status: "validated",
      });

      if (validation.passed) {
        await this.documentsRepo.updateProcessingStatus(documentId, {
          processing_status: "ready",
          processed_at: new Date().toISOString(),
        });
      } else {
        await this.documentsRepo.updateProcessingStatus(documentId, {
          processing_status: "failed",
          processing_error:
            validation.reason ?? "Validation failed",
          processed_at: new Date().toISOString(),
        });
      }

      const updated = await this.documentsRepo.findById(documentId);

      if (!updated) {
        throw new DocumentNotFoundError(documentId);
      }

      return updated;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown processing error";

      await this.documentsRepo.updateProcessingStatus(documentId, {
        processing_status: "failed",
        processing_error: message,
        processed_at: new Date().toISOString(),
      });

      throw err;
    }
  }

  private validate(overallConfidence: number): ValidationResult {
    if (overallConfidence < MIN_CONFIDENCE_TO_PASS_VALIDATION) {
      return {
        passed: false,
        reason: `Overall confidence (${overallConfidence}%) is below the ${MIN_CONFIDENCE_TO_PASS_VALIDATION}% threshold required for automatic validation.`,
      };
    }

    return {
      passed: true,
    };
  }
}