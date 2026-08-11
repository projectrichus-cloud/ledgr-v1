import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { RiskLevel } from "@/types";

const SEVERITY_COLOR: Record<RiskLevel, string> = {
  high: "#DC2626",
  medium: "#D97706",
  low: "#B4C0D1",
};

export interface FindingMini {
  id: string;
  severity: RiskLevel;
  title: string;
  description: string;
}

export function FindingsMiniList({ findings, viewAllHref }: { findings: FindingMini[]; viewAllHref?: string }) {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Recent AI Findings</CardTitle>
        {viewAllHref && (
          <a href={viewAllHref} className="text-[12.5px] font-semibold text-brand-600">
            View all
          </a>
        )}
      </CardHeader>
      <div>
        {findings.length === 0 ? (
          <p className="text-[12.5px] text-ink-400">No AI findings yet — they&apos;ll appear here once documents are processed.</p>
        ) : (
          findings.map((f, i) => (
          <div key={f.id} className={`flex gap-3 py-3 ${i < findings.length - 1 ? "border-b border-line" : ""}`}>
            <div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full" style={{ background: SEVERITY_COLOR[f.severity] }} />
            <div>
              <div className="text-[13.5px] font-semibold text-ink-800">{f.title}</div>
              <div className="mt-0.5 text-[12.5px] leading-relaxed text-ink-500">{f.description}</div>
            </div>
          </div>
          ))
        )}
      </div>
    </Card>
  );
}
