"use client";

import { useState } from "react";
import { ChevronDown, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatINR } from "@/lib/utils";
import type { RiskLevel } from "@/types";

export interface Finding {
  id: string;
  severity: RiskLevel;
  title: string;
  category: string;
  amount: number;
  explanation: string;
  documents: string[];
  aiReasoning?: string;
  recommendedAction: string;
}

const SEVERITY_BADGE: Record<RiskLevel, { label: string; variant: "red" | "amber" | "ink" }> = {
  high: { label: "Critical", variant: "red" },
  medium: { label: "Moderate", variant: "amber" },
  low: { label: "Low", variant: "ink" },
};

const SEVERITY_DOT: Record<RiskLevel, string> = { high: "#DC2626", medium: "#D97706", low: "#B4C0D1" };
const AMOUNT_COLOR: Record<RiskLevel, string> = { high: "text-red-600", medium: "text-amber-700", low: "text-ink-900" };

/**
 * A single AI finding — expandable to show explanation, involved
 * documents, the AI's reasoning, and a recommended action. This is the
 * one component the whole Findings page is built from.
 */
export function FindingCard({ finding, defaultOpen = false }: { finding: Finding; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const badge = SEVERITY_BADGE[finding.severity];

  return (
    <div className="mb-3.5 overflow-hidden rounded-2xl border border-line bg-paper">
      <div className="flex cursor-pointer items-start gap-3.5 p-5" onClick={() => setOpen(!open)}>
        <div className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: SEVERITY_DOT[finding.severity] }} />
        <div className="flex flex-1 flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[14.5px] font-bold">{finding.title}</div>
            <div className="mt-1 flex items-center gap-1.5 text-[13px] text-ink-500">
              <Badge variant={badge.variant}>{badge.label}</Badge>
              {finding.category}
            </div>
          </div>
          <div className={cn("font-mono text-[15px] font-semibold", AMOUNT_COLOR[finding.severity])}>
            {formatINR(finding.amount)}
          </div>
        </div>
        <ChevronDown className={cn("mt-2 h-4 w-4 flex-shrink-0 text-ink-400 transition-transform", open && "rotate-180")} />
      </div>

      {open && (
        <div className="border-t border-line bg-mist p-5">
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-400">Explanation</div>
              <div className="text-[13.5px] leading-relaxed text-ink-700">{finding.explanation}</div>
            </div>
            <div>
              <div className="mb-1.5 text-[11.5px] font-bold uppercase tracking-wide text-ink-400">Documents Involved</div>
              <div className="flex flex-wrap gap-1.5">
                {finding.documents.map((d) => (
                  <span key={d} className="rounded-full border border-line-strong bg-paper px-2.5 py-1 text-xs font-semibold">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {finding.aiReasoning && (
            <div className="mb-4 rounded-xl border border-gold-100 bg-gold-50 p-4">
              <div className="mb-2 flex items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-wide text-gold-700">
                <Sparkles className="h-3 w-3" /> AI Reasoning
              </div>
              <p className="text-[13px] leading-relaxed text-ink-700">{finding.aiReasoning}</p>
            </div>
          )}

          <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-line bg-paper p-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
            <p className="text-[13px] leading-relaxed text-ink-700">
              <b>Recommended action:</b> {finding.recommendedAction}
            </p>
          </div>

          <div className="flex gap-2.5">
            <Button variant="secondary" size="sm">
              View Evidence
            </Button>
            <Button variant="ghost" size="sm">
              Mark Resolved
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
