import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";

import OpenAI from "openai";

import type {
  ClassificationInput,
  ClassificationResult,
  ExtractionInput,
  ExtractionResult,
} from "@/lib/document-intelligence/types";

import type { DocumentIntelligenceProvider } from "./provider.interface";
import type { DocumentType } from "@/types";

export class AzureDocumentIntelligenceProvider
  implements DocumentIntelligenceProvider
{
  readonly name = "azure-document-intelligence";

  private readonly client: DocumentAnalysisClient;
  private readonly openai: OpenAI;

  constructor() {
    const endpoint = process.env.AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT;
    const apiKey = process.env.AZURE_DOCUMENT_INTELLIGENCE_KEY;

    if (!endpoint) {
      throw new Error(
        "AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT is missing."
      );
    }

    if (!apiKey) {
      throw new Error(
        "AZURE_DOCUMENT_INTELLIGENCE_KEY is missing."
      );
    }

    this.client = new DocumentAnalysisClient(
      endpoint,
      new AzureKeyCredential(apiKey)
    );

    const openAiEndpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const openAiKey = process.env.AZURE_OPENAI_API_KEY;

    if (!openAiEndpoint) {
      throw new Error("AZURE_OPENAI_ENDPOINT is missing.");
    }

    if (!openAiKey) {
      throw new Error("AZURE_OPENAI_API_KEY is missing.");
    }

    this.openai = new OpenAI({
      baseURL: openAiEndpoint,
      apiKey: openAiKey,
    });
  }

  async classify(
    input: ClassificationInput
  ): Promise<ClassificationResult> {
    return {
      documentType: this.detectDocumentType(input.fileName),
      confidence: 95,
    };
  }

  async extract(
    input: ExtractionInput
  ): Promise<ExtractionResult> {
    if (!input.documentBytes) {
      throw new Error("Document bytes are missing.");
    }

    // =====================================
    // OCR
    // =====================================

    const poller = await this.client.beginAnalyzeDocument(
      "prebuilt-document",
      input.documentBytes
    );

    const result = await poller.pollUntilDone();

    let text = "";

    if (result.pages) {
      for (const page of result.pages) {
        if (!page.lines) continue;

        for (const line of page.lines) {
          text += line.content + "\n";
        }
      }
    }

    console.log("====================================");
    console.log("OCR RESULT");
    console.log("====================================");
    console.log(text);
    console.log("====================================");

    // =====================================
    // GPT
    // =====================================

    const response = await this.openai.responses.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT!,

      input: [
        {
          role: "system",
          content: `
You are Ledgr AI.

You are a Senior Chartered Accountant and Finance Analyst.

Your responsibility is to extract structured financial information from Indian bank statements.

Rules:

- Return ONLY valid JSON.
- Never use markdown.
- Never explain.
- Never invent values.
- If a value cannot be found use null.
- Preserve all numbers exactly.
- Preserve transaction order.
- Dates must be YYYY-MM-DD.
`,
        },

        {
          role: "user",
          content: `
Extract the following JSON.

{
  "metadata": {
    "bankName": "",
    "accountHolder": "",
    "accountNumber": "",
    "customerId": "",
    "ifsc": "",
    "branch": "",
    "statementFrom": "",
    "statementTo": "",
    "currency": "",
    "openingBalance": null,
    "closingBalance": null
  },

  "transactions":[
    {
      "date":"",
      "valueDate":"",
      "description":"",
      "reference":"",
      "merchant":"",
      "category":"",
      "transactionType":"",
      "debit":null,
      "credit":null,
      "balance":null
    }
  ]

Bank Statement OCR:

${text}
`,
        },
      ],
    });

    console.log("====================================");
    console.log("GPT RESULT");
    console.log("====================================");
    console.log(response.output_text);
    console.log("====================================");

    return {
      overallConfidence: 100,
      fields: [
        {
          fieldName: "gpt_json",
          fieldValue: response.output_text,
          confidence: 100,
          pageNumber: 1,
        },
      ],
    };
  }

  private detectDocumentType(fileName: string): DocumentType {
    const lower = fileName.toLowerCase();

    if (lower.includes("gstr1")) return "gstr1";
    if (lower.includes("gstr3b")) return "gstr3b";
    if (lower.includes("26as")) return "form_26as";
    if (lower.includes("ais")) return "ais_tis";
    if (lower.includes("itr")) return "itr";
    if (lower.includes("balance")) return "balance_sheet";
    if (lower.includes("profit")) return "profit_loss";
    if (lower.includes("trial")) return "trial_balance";
    if (lower.includes("bank")) return "bank_statement";

    return "invoice";
  }
}