"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import { ProcessingStatusBadge } from "@/components/shared/status-badge";
import { ExtractedFieldsList } from "@/components/documents/extracted-fields-list";
import { RunProcessingButton } from "@/components/documents/run-processing-button";
import { formatDate, cn } from "@/lib/utils";
import type { Document, DocumentExtraction } from "@/types";

interface DocumentIntelligenceRowProps {
  document: Document;
  extractions: DocumentExtraction[];
}

/**
 * The Documents page row: filename, document type, processing status,
 * confidence score, uploaded date, and extracted-field count, with an
 * expandable detail panel showing every extracted field. This is a
 * pure UI component — it renders props and delegates the one action it
 * offers (running processing) to RunProcessingButton. It has no
 * knowledge of the pipeline's internals.
 */
export function DocumentIntelligenceRow({ document, extractions }: DocumentIntelligenceRowProps) {
  const [open, setOpen] = useState(false);

  const canRun = document.processing_status === "uploaded" || document.processing_status === "failed";
  const isBusy = ["processing", "classified", "extracted", "validated"].includes(document.processing_status);

  // Prefer the AI-classified type once available; fall back to the
  // type declared at upload time until classification has run.
  const displayType = document.document_type ?? document.type;

  return (
    <div className="rounded-xl border border-line bg-paper">
      <div className="flex flex-wrap items-center gap-3.5 p-4">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-1 items-center gap-3 text-left"
          aria-expanded={open}
        >
          <ChevronDown className={cn("h-4 w-4 flex-shrink-0 text-ink-400 transition-transform", open && "rotate-180")} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[13.5px] font-semibold">
              <span className="truncate">{document.file_name}</span>
              <span className="flex-shrink-0 rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-700">
                {DOCUMENT_TYPE_LABELS[displayType]}
                {!document.document_type && " (declared)"}
              </span>
            </div>
            <div className="mt-0.5 text-xs text-ink-400">
              Uploaded {formatDate(document.created_at)} · {extractions.length} field
              {extractions.length === 1 ? "" : "s"} extracted
            </div>
          </div>
        </button>

        <div className="flex flex-shrink-0 items-center gap-3">
          <div className="text-right">
            <div className="font-mono text-[13px] font-semibold">
              {document.confidence_score !== null ? `${document.confidence_score}%` : "—"}
            </div>
            <div className="text-[10.5px] text-ink-400">confidence</div>
          </div>
          <ProcessingStatusBadge status={document.processing_status} />
          {canRun && <RunProcessingButton documentId={document.id} isRetry={document.processing_status === "failed"} />}
          {isBusy && <span className="text-xs text-ink-400">Working…</span>}
        </div>
      </div>

      {document.processing_status === "failed" && document.processing_error && (
        <div className="mx-4 mb-3 rounded-lg bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
          {document.processing_error}
        </div>
      )}

      {open && (
        <div className="border-t border-line px-4">
          <ExtractedFieldsList fields={extractions} />
        </div>
      )}
    </div>
  );
}
