import { Button } from "@/components/ui/button";
import { FileWarning } from "lucide-react";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import type { DocumentType } from "@/types";

export function MissingDocsGrid({ missingTypes }: { missingTypes: DocumentType[] }) {
  if (missingTypes.length === 0) return null;

  return (
    <div>
      <div className="mb-3.5 text-xs font-bold uppercase tracking-wide text-ink-400">Still needed</div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {missingTypes.map((type) => (
          <div key={type} className="rounded-xl border border-dashed border-line-strong bg-mist p-4 text-center">
            <div className="mx-auto mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg bg-ink-100">
              <FileWarning className="h-[15px] w-[15px] text-ink-500" />
            </div>
            <div className="mb-0.5 text-[12.5px] font-bold">{DOCUMENT_TYPE_LABELS[type]}</div>
            <div className="mb-2.5 text-[11.5px] text-ink-400">Not uploaded yet</div>
            <Button variant="secondary" size="sm" className="w-full">
              Upload
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
