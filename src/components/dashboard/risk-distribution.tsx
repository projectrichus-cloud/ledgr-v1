import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface RiskRow {
  label: string;
  count: number;
  percent: number;
  color: string;
}

export function RiskDistribution({ rows }: { rows: RiskRow[] }) {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
      </CardHeader>
      <div className="space-y-3.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <div className="w-16 flex-shrink-0 text-[12.5px] font-semibold text-ink-600">{r.label}</div>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-mist-dark">
              <div className="h-full rounded-full" style={{ width: `${r.percent}%`, background: r.color }} />
            </div>
            <div className="w-7 flex-shrink-0 text-right font-mono text-[12.5px] font-semibold">{r.count}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
