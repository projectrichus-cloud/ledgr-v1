import { DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import { DocumentStatusBadge } from "@/components/shared/status-badge";
import type { Document } from "@/types";

export function UploadRow({ document }: { document: Document }) {
  const sizeLabel = document.file_size_bytes
    ? `${(document.file_size_bytes / (1024 * 1024)).toFixed(1)} MB`
    : "";
  const isBusy = document.status === "uploading" || document.status === "processing";

  return (
    <div className="rounded-xl border border-line bg-paper p-4">
      <div className="flex items-center gap-3.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-[13.5px] font-semibold">
            <span className="truncate">{document.file_name}</span>
            <span className="flex-shrink-0 rounded-full bg-ink-100 px-2 py-0.5 text-[11px] font-semibold text-ink-700">
              {DOCUMENT_TYPE_LABELS[document.type]}
            </span>
          </div>
          <div className="mt-0.5 text-xs text-ink-400">{sizeLabel}</div>
        </div>
        <DocumentStatusBadge status={document.status} />
      </div>
      {isBusy && (
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-mist-dark">
          <div
            className={`h-full rounded-full ${document.status === "processing" ? "bg-gold-500" : "bg-brand-500"}`}
            style={{ width: document.status === "processing" ? "64%" : "45%" }}
          />
        </div>
      )}
    </div>
  );
}
