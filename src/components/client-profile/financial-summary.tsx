import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/lib/utils";

interface SummaryBlock {
  title: string;
  rows: { label: string; value: number }[];
}

export function FinancialSummary({ blocks }: { blocks: SummaryBlock[] }) {
  return (
    <Card className="mb-5 p-6">
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {blocks.map((b) => (
          <div key={b.title} className="rounded-xl border border-line p-4">
            <div className="mb-2.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-400">{b.title}</div>
            {b.rows.map((r) => (
              <div key={r.label} className="flex justify-between py-1.5 text-[13px]">
                <span>{r.label}</span>
                <span className="font-mono font-semibold">{formatINR(r.value)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}
