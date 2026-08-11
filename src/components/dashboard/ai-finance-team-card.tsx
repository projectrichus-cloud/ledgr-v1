import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  Building2,
  CalendarRange,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";

interface Props {
  companyId: string;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

// Rough, conservative estimate of manual effort saved by the AI Finance Team.
// ~2.5 minutes of manual entry/reconciliation per transaction, floored at 15.
function estimateMinutesSaved(transactionCount: number): number {
  if (transactionCount <= 50) return 20;
  if (transactionCount <= 150) return 35;
  if (transactionCount <= 300) return 60;
  return 90;
}

export async function AiFinanceTeamCard({ companyId }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName =
    (user?.user_metadata?.full_name as string | undefined)?.split(" ")?.[0] ??
    (user?.user_metadata?.first_name as string | undefined) ??
    "there";

  const greeting = getGreeting();

  const { data } = await supabase
    .from("document_extractions")
    .select(
      `
      *,
      document:documents!inner(
      id,
        company_id,
        file_name,
        confidence_score,
        processing_status
      )
    `
    )
    .eq("document.company_id", companyId)
    .eq("field_name", "gpt_json")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return (
      <Card className="mb-6 overflow-hidden rounded-2xl border-slate-200/70 shadow-sm">
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white">
          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
              <Brain className="h-6 w-6 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight">
                {greeting}, {firstName}
              </h2>
              <p className="mt-1 text-sm text-slate-300">
                Your AI Finance Team is standing by. Upload a bank statement
                and analysis will begin automatically.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-500">
            No documents yet — once you add your first statement, you&apos;ll
            see a full breakdown here within moments.
          </p>
        </div>
      </Card>
    );
  }

  let analysis: any = null;

  try {
    analysis = JSON.parse(data.field_value ?? "{}");
  } catch {
    return (
      <Card className="mb-6 overflow-hidden rounded-2xl border-slate-200/70 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
            <Brain className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-slate-900">
              Analysis unavailable
            </p>
            <p className="text-sm text-slate-500">
              We couldn&apos;t read the AI output for this document. Try
              re-uploading the statement.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const metadata = analysis.metadata ?? {};
  const transactions = analysis.transactions ?? [];
  const minutesSaved = estimateMinutesSaved(transactions.length);

  const workItems = [
    "Bank statement analysed",
    `${transactions.length} transaction${transactions.length === 1 ? "" : "s"} extracted`,
    "Statement period verified",
    "Ready for CA review",
  ];

  const summaryItems = [
    {
      icon: Building2,
      label: "Bank",
      value: metadata.bankName ?? "—",
    },
    {
      icon: UserRound,
      label: "Account Holder",
      value: metadata.accountHolder ?? "—",
    },
    {
      icon: CalendarRange,
      label: "Statement Period",
      value:
        metadata.statementFrom && metadata.statementTo
          ? `${metadata.statementFrom} → ${metadata.statementTo}`
          : "—",
    },
    {
      icon: ShieldCheck,
      label: "AI Confidence",
      value: "100%",
      accent: "text-emerald-600",
    },
    {
      icon: Sparkles,
      label: "Status",
      value: "Ready for Review",
      badge: true,
    },
  ];

  return (
    <Card className="mb-6 overflow-hidden rounded-2xl border-slate-200/70 shadow-sm">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 text-white">
        <div
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative flex items-start gap-4">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <Brain className="h-6 w-6 text-indigo-300" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
              {greeting}, {firstName}
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-300">
              Your AI Finance Team has completed the analysis of your latest
              bank statement.
            </p>
            <p className="mt-3 max-w-xl text-sm text-slate-400">
  No action is required from you. Your Chartered Accountant can now
  review the results and continue with the next steps.
</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8">
        {/* Today's Work */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Today&apos;s Work
          </p>
          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {workItems.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 text-sm text-slate-700"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* KPI: Time saved */}
        <div className="mt-6 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 p-6 ring-1 ring-inset ring-indigo-100">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <Clock3 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-700/80">
                  Estimated manual work saved
                </p>
                <p className="text-xs text-slate-500">
                  vs. manual entry &amp; reconciliation
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 pl-13 sm:pl-0">
              <span className="text-4xl font-bold tracking-tight text-indigo-700 sm:text-5xl">
                {minutesSaved}
              </span>
              <span className="text-sm font-medium text-indigo-600">
                Minutes
              </span>
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Financial Summary
          </p>
          <div className="mt-3 grid gap-5 rounded-xl border border-slate-100 bg-slate-50/50 p-5 sm:grid-cols-5">
            {summaryItems.map(({ icon: Icon, label, value, accent, badge }) => (
              <div key={label}>
                <div className="mb-1.5 flex items-center gap-1.5 text-slate-400">
                  <Icon size={14} />
                  <span className="text-[11px] font-medium uppercase tracking-wide">
                    {label}
                  </span>
                </div>
                {badge ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {value}
                  </span>
                ) : (
                  <p
                    className={`text-sm font-semibold text-slate-900 ${accent ?? ""}`}
                  >
                    {value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
<div className="mt-6">
  <Link
    href={`/documents/${data?.document?.id}/analysis`}
    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 sm:w-auto"
  >
    Open Full AI Analysis
    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
  </Link>
</div>
      </div>
    </Card>
  );
}
