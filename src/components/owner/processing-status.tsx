import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { DOCUMENT_TYPE_LABELS, REQUIRED_DOCUMENT_TYPES } from "@/lib/constants";
import { DocumentStatusBadge } from "@/components/shared/status-badge";
import type { Document } from "@/types";

export function ProcessingStatus({ documents }: { documents: Document[] }) {
  const completedCount = documents.filter((d) => d.status === "completed").length;
  const total = REQUIRED_DOCUMENT_TYPES.length;
  const percent = Math.round((completedCount / total) * 100);
  const active = documents.filter((d) => d.status === "processing" || d.status === "uploading").slice(0, 4);

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>AI Processing Status</CardTitle>
      </CardHeader>
      <div className="mb-4">
        <div className="mb-2 flex justify-between text-[12.5px] font-semibold text-ink-600">
          <span>Overall progress</span>
          <span className="font-mono">
            {completedCount} of {total}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-mist-dark">
          <div className="h-full rounded-full bg-brand-500" style={{ width: `${percent}%` }} />
        </div>
      </div>
      {active.length === 0 ? (
        <p className="text-[12.5px] text-ink-400">Nothing is processing right now.</p>
      ) : (
        active.map((doc, i) => (
          <div key={doc.id} className={`flex items-center gap-3 py-2.5 ${i < active.length - 1 ? "border-b border-line" : ""}`}>
            <DocumentStatusBadge status={doc.status} />
            <div className="flex-1 text-[13px] font-semibold">{DOCUMENT_TYPE_LABELS[doc.type]}</div>
          </div>
        ))
      )}
    </Card>
  );
}
