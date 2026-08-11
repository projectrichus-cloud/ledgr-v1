import type { DocumentIntelligenceProvider } from "@/lib/document-intelligence/providers/provider.interface";
import { MockDocumentIntelligenceProvider } from "@/lib/document-intelligence/providers/mock-provider";
import { AzureDocumentIntelligenceProvider } from "@/lib/document-intelligence/providers/azure-document-intelligence-provider";
import { OpenAIProvider } from "@/lib/document-intelligence/providers/openai-provider";

export function getDocumentIntelligenceProvider(): DocumentIntelligenceProvider {
  const providerName =
    process.env.DOCUMENT_INTELLIGENCE_PROVIDER ?? "mock";

  console.log("PROVIDER =", JSON.stringify(providerName));

  switch (providerName) {
    case "mock":
      console.log("Using Mock Provider");
      return new MockDocumentIntelligenceProvider();

    case "azure-document-intelligence":
      console.log("Using Azure Provider");
      return new AzureDocumentIntelligenceProvider();

    case "openai":
      console.log("Using OpenAI Provider");
      return new OpenAIProvider();

    default:
      console.log("UNKNOWN PROVIDER =", providerName);

      throw new Error(
        `Unknown DOCUMENT_INTELLIGENCE_PROVIDER "${providerName}".`
      );
  }
}