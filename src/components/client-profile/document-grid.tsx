import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, CircleDashed } from "lucide-react";
import { DOCUMENT_TYPE_LABELS, REQUIRED_DOCUMENT_TYPES } from "@/lib/constants";
import type { Document, DocumentType } from "@/types";

export function DocumentGrid({ documents, uploadHref }: { documents: Document[]; uploadHref: string }) {
  const byType = new Map<DocumentType, Document>(documents.map((d) => [d.type, d]));

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Documents</CardTitle>
        <a href={uploadHref} className="text-[12.5px] font-semibold text-brand-600">
          Upload more
        </a>
      </CardHeader>
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {REQUIRED_DOCUMENT_TYPES.map((type) => {
          const doc = byType.get(type);
          const status = doc?.status ?? "missing";
          const isDone = status === "completed";
          const isProcessing = status === "processing" || status === "uploading";
          return (
            <div key={type} className={`flex items-center gap-2.5 rounded-[10px] border p-2.5 ${status === "missing" ? "border-dashed border-line-strong bg-mist" : "border-line"}`}>
              <div className={`flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg ${isDone ? "bg-green-100" : isProcessing ? "bg-gold-50" : "bg-ink-100"}`}>
                {isDone ? <CheckCircle2 className="h-[14px] w-[14px] text-green-700" /> : isProcessing ? <Clock className="h-[14px] w-[14px] text-gold-600" /> : <CircleDashed className="h-[14px] w-[14px] text-ink-500" />}
              </div>
              <div>
                <div className="text-[12.5px] font-semibold">{DOCUMENT_TYPE_LABELS[type]}</div>
                <div className="text-[11px] text-ink-400 capitalize">{status.replace("_", " ")}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
