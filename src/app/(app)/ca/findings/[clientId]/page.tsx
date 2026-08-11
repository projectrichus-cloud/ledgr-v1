import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { FindingsScoreHeader } from "@/components/findings/findings-score-header";
import { FindingCard, type Finding } from "@/components/findings/finding-card";

/**
 * Sample findings — AI extraction isn't implemented yet (by design, per
 * the project brief), so these illustrate the exact shape real findings
 * will have once the reconciliation engine exists: severity, amount,
 * explanation, involved documents, AI reasoning, and a recommended
 * action. Replace this array with a real `findings` table + query once
 * that engine is built.
 */
const SAMPLE_FINDINGS: Finding[] = [
  {
    id: "1",
    severity: "high",
    title: "Unexplained cash deposits in bank statement",
    category: "Bank Statement vs Books of Accounts",
    amount: 680000,
    explanation:
      "Three cash deposits made between January and March do not correspond to any recorded sale, loan, or capital infusion in the books of accounts.",
    documents: ["Bank Statement", "Trial Balance", "GSTR-3B"],
    aiReasoning:
      "214 bank transactions were cross-referenced against ledger entries. Three deposits have no matching invoice, loan agreement, or capital account entry within a 5-day window.",
    recommendedAction: "Obtain a written explanation and supporting documentation for each deposit before finalizing the return.",
  },
  {
    id: "2",
    severity: "high",
    title: "Turnover mismatch — GSTR-3B vs Profit & Loss",
    category: "GST Returns vs Financial Statements",
    amount: 420000,
    explanation: "Turnover reported in GSTR-3B for the quarter is higher than the revenue recognized in the Profit & Loss statement for the same period.",
    documents: ["GSTR-3B", "Profit & Loss"],
    aiReasoning: "GSTR-3B declares outward taxable supply higher than P&L revenue for the same period — could be a timing difference or an omission in the books.",
    recommendedAction: "Reconcile the sales register against GSTR-3B outward supplies to confirm the cause of the difference.",
  },
  {
    id: "3",
    severity: "medium",
    title: "TDS credit not fully claimed in ITR",
    category: "Form 26AS vs Income Tax Return",
    amount: 18400,
    explanation: "Form 26AS shows TDS deducted by a vendor that has not been claimed as credit in the filed ITR.",
    documents: ["Form 26AS", "ITR"],
    aiReasoning: "One TDS entry appears in Form 26AS but is absent from Schedule TDS in the filed return, resulting in an unclaimed credit.",
    recommendedAction: "File a rectification request to claim the missed TDS credit before the deadline.",
  },
];

export default async function ClientFindingsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId: companyId } = await params;
  const supabase = await createClient();
  const { data: company } = await supabase.from("companies").select("*").eq("id", companyId).maybeSingle();

  const companyData = company as { name: string } | null;

  if (!companyData) notFound();

  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">AI Findings — {companyData.name} </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">Sample findings shown — AI extraction isn&apos;t wired up yet.</p>
        </div>
        <div className="flex gap-2.5">
          <Button variant="secondary">Share Report</Button>
          <Button>Download PDF</Button>
        </div>
      </div>

      <FindingsScoreHeader
        scores={[
          { value: 55, label: "Medium", sublabel: "Overall Risk", color: "#D97706" },
          { value: 82, label: "82/100", sublabel: "Financial Health", color: "#0E9F6E" },
          { value: 85, label: "85/100", sublabel: "Compliance Score", color: "#0E9F6E" },
          { value: 91, label: "91%", sublabel: "AI Confidence", color: "#C4901A" },
        ]}
      />

      <div className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-400">
        {SAMPLE_FINDINGS.length} findings · sorted by severity
      </div>

      {SAMPLE_FINDINGS.map((f, i) => (
        <FindingCard key={f.id} finding={f} defaultOpen={i === 0} />
      ))}
    </>
  );
}
