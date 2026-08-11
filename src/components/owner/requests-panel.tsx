import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { DocumentRequest } from "@/types";

/**
 * "Requests from your CA" — deliberately the most visually prominent
 * panel on the owner dashboard, since it's the thing they most need
 * to act on (per the product requirements).
 */
export function RequestsPanel({ requests, uploadHref }: { requests: DocumentRequest[]; uploadHref: string }) {
  if (requests.length === 0) return null;

  return (
    <div className="mb-5 rounded-lg border border-gold-100 bg-gold-50 p-5">
      <div className="mb-3.5 flex items-center gap-2.5">
        <ArrowUpRight className="h-[17px] w-[17px] text-gold-600" />
        <h3 className="text-[14.5px] font-bold text-gold-700">Requests from your CA</h3>
      </div>
      <div className="space-y-2.5">
        {requests.map((r) => (
          <div key={r.id} className="flex items-center justify-between gap-3.5 rounded-[10px] border border-gold-100 bg-paper p-3.5">
            <div>
              <div className="text-[13.5px] font-semibold">{DOCUMENT_TYPE_LABELS[r.document_type]}</div>
              <div className="mt-0.5 text-xs text-ink-500">
                {r.note ? r.note : "Requested"} · {formatDate(r.created_at)}
              </div>
            </div>
            <Button size="sm" asChild>
              <a href={uploadHref}>Upload</a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
