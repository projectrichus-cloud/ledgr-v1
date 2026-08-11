import OpenAI from "openai";

import type {
  ClassificationInput,
  ClassificationResult,
  ExtractionInput,
  ExtractionResult,
} from "@/lib/document-intelligence/types";

import type { DocumentIntelligenceProvider } from "./provider.interface";

export class OpenAIProvider implements DocumentIntelligenceProvider {
  readonly name = "openai";

  private readonly client: OpenAI;

  constructor() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;

  if (!endpoint) {
    throw new Error("AZURE_OPENAI_ENDPOINT is missing.");
  }

  if (!apiKey) {
    throw new Error("AZURE_OPENAI_API_KEY is missing.");
  }

  if (!deployment) {
    throw new Error("AZURE_OPENAI_DEPLOYMENT is missing.");
  }

  this.client = new OpenAI({
    baseURL: endpoint,
    apiKey,
  });
}

  async classify(
    input: ClassificationInput
  ): Promise<ClassificationResult> {
    throw new Error("Not implemented yet.");
  }

  async extract(
    input: ExtractionInput
  ): Promise<ExtractionResult> {
    throw new Error("Not implemented yet.");
  }
}