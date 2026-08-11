import type { DocumentExtraction } from "@/types";

function humanizeFieldName(name: string) {
  return name
    .split("_")
    .map((w) => w[0]?.toUpperCase() + w.slice(1))
    .join(" ");
}

function confidenceColor(score: number | null) {
  if (score === null) return "text-ink-400";
  if (score >= 90) return "text-green-700";
  if (score >= 75) return "text-amber-700";
  return "text-red-600";
}

/**
 * Pure presentational component — just renders the extraction rows
 * it's given. No fetching, no state. The Documents page (Server
 * Component) fetches all extractions up front and passes them down,
 * so this stays a plain, easily-testable render function.
 */
export function ExtractedFieldsList({ fields }: { fields: DocumentExtraction[] }) {
  if (fields.length === 0) {
    return <p className="py-3 text-[12.5px] text-ink-400">No fields extracted yet.</p>;
  }

  return (
    <div className="divide-y divide-line">
      {fields.map((f) => (
        <div key={f.id} className="flex items-center justify-between gap-3 py-2.5">
          <div className="min-w-0">
            <div className="text-[12.5px] font-semibold text-ink-800">{humanizeFieldName(f.field_name)}</div>
            <div className="mt-0.5 truncate font-mono text-[13px] text-ink-700">{f.field_value ?? "—"}</div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-3 text-xs">
            {f.page_number !== null && <span className="text-ink-400">p.{f.page_number}</span>}
            <span className={`font-mono font-semibold ${confidenceColor(f.confidence_score)}`}>
              {f.confidence_score !== null ? `${f.confidence_score}%` : "—"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
