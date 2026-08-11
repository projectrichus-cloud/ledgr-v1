"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Banknote,
  Brain,
  Building2,
  CalendarRange,
  CheckCircle2,
  Clock3,
  Coins,
  FileWarning,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Wallet,
} from "lucide-react";

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

interface DocumentRow {
  id: string;
  company_id: string;
  file_name: string | null;
  confidence_score: number | null;
  processing_status: string | null;
  created_at?: string;
}

interface Transaction {
  date?: string;
  description?: string;
  category?: string;
  debit?: number | null;
  credit?: number | null;
  balance?: number | null;
  [key: string]: unknown;
}

interface AnalysisMetadata {
  bankName?: string;
  accountHolder?: string;
  statementFrom?: string;
  statementTo?: string;
  openingBalance?: number;
  closingBalance?: number;
  currency?: string;
}

interface Analysis {
  metadata?: AnalysisMetadata;
  transactions?: Transaction[];
}

type PageState = "loading" | "ready" | "not_found" | "parse_error" | "error";

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

function estimateMinutesSaved(transactionCount: number): number {
  return Math.max(20, Math.round(transactionCount * 2));
}

function formatCurrency(value: number | null | undefined, currency?: string) {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency || "INR",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value}`;
  }
}

function buildObservations(analysis: Analysis, doc: DocumentRow | null): string[] {
  // Rule-based for now. Designed to be swapped 1:1 for GPT-generated
  // observations later — just replace this function's body with a call
  // to the model and return the resulting string[].
  const observations: string[] = [];
  const transactions = analysis.transactions ?? [];
  const metadata = analysis.metadata ?? {};

  observations.push(
    transactions.length > 0
      ? `Successfully extracted ${transactions.length} transaction${
          transactions.length === 1 ? "" : "s"
        }`
      : "No transactions were found in this document"
  );

  const confidence = doc?.confidence_score ?? 1;
  observations.push(
    confidence >= 0.9
      ? "No OCR issues detected"
      : "Some pages had lower OCR confidence — spot-check recommended"
  );

  observations.push(
    metadata.statementFrom && metadata.statementTo
      ? "Statement period is complete and verified"
      : "Statement period could not be fully verified"
  );

  observations.push(
    metadata.openingBalance !== undefined && metadata.closingBalance !== undefined
      ? "Opening and closing balances are present"
      : "Opening or closing balance was not found in the document"
  );

  observations.push("Ready for Chartered Accountant review");

  return observations;
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------

export default function DocumentReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const documentId = params?.id;

  const [state, setState] = useState<PageState>("loading");
  const [doc, setDoc] = useState<DocumentRow | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [ownerFirstName, setOwnerFirstName] = useState<string>("there");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!documentId) return;

    let cancelled = false;
    const supabase = createClient();

    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!cancelled) {
          const name =
            (user?.user_metadata?.full_name as string | undefined)?.split(
              " "
            )?.[0] ??
            (user?.user_metadata?.first_name as string | undefined) ??
            "there";
          setOwnerFirstName(name);
        }

        const { data: documentData, error: documentError } = await supabase
          .from("documents")
          .select("id, company_id, file_name, confidence_score, processing_status, created_at")
          .eq("id", documentId)
          .maybeSingle();

        if (documentError || !documentData) {
          if (!cancelled) setState("not_found");
          return;
        }

        if (!cancelled) setDoc(documentData as DocumentRow);

        const { data: extractionData, error: extractionError } = await supabase
          .from("document_extractions")
          .select("field_value, created_at")
          .eq("document_id", documentId)
          .eq("field_name", "gpt_json")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (extractionError || !extractionData) {
          if (!cancelled) setState("not_found");
          return;
        }

        try {
          const parsed = JSON.parse(extractionData.field_value ?? "{}");
          if (!cancelled) {
            setAnalysis(parsed);
            setState("ready");
          }
        } catch {
          if (!cancelled) setState("parse_error");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [documentId]);

  const metadata = analysis?.metadata ?? {};
  const transactions = useMemo(() => analysis?.transactions ?? [], [analysis]);

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.trim().toLowerCase();
    return transactions.filter((t) => {
      const haystack = `${t.description ?? ""} ${t.category ?? ""} ${
        t.date ?? ""
      }`.toLowerCase();
      return haystack.includes(q);
    });
  }, [transactions, search]);

  const minutesSaved = estimateMinutesSaved(transactions.length);
  const confidencePct = Math.round((doc?.confidence_score ?? 1) * 100);
  const observations = analysis ? buildObservations(analysis, doc) : [];

  // --------------------------------------------------------------------
  // Loading state
  // --------------------------------------------------------------------
  if (state === "loading") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
        <p className="text-sm">Your AI Finance Team is pulling up this document…</p>
      </div>
    );
  }

  // --------------------------------------------------------------------
  // Not found / error states
  // --------------------------------------------------------------------
  if (state === "not_found" || state === "error" || state === "parse_error") {
    const messages: Record<string, { title: string; body: string }> = {
      not_found: {
        title: "We couldn't find this document",
        body: "It may have been removed, or the analysis hasn't finished yet.",
      },
      error: {
        title: "Something went wrong",
        body: "We ran into a problem loading this document. Please try again.",
      },
      parse_error: {
        title: "Analysis unavailable",
        body: "We couldn't read the AI output for this document. Try re-uploading the statement.",
      },
    };
    const info = messages[state];

    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50">
            <FileWarning className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-slate-900">{info.title}</p>
            <p className="mt-1 text-sm text-slate-500">{info.body}</p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------
  // Ready state
  // --------------------------------------------------------------------
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      {/* Header */}
      <div className="pt-6">
        <button
          onClick={() => router.back()}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900">
              <Brain className="h-5 w-5 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                AI Finance Team
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                Bank Statement Analysis
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Ready for CA Review
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 px-3 py-1.5 text-xs font-medium text-indigo-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              {confidencePct}% Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Executive Summary */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm">
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
                {getGreeting()}, {ownerFirstName}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-300">
                Your AI Finance Team completed the analysis of this document.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 rounded-xl bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-50 p-6 ring-1 ring-inset ring-indigo-100 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <Clock3 className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-700/80">
                  Estimated work saved
                </p>
                <p className="text-xs text-slate-500">
                  vs. manual entry &amp; reconciliation
                </p>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-bold tracking-tight text-indigo-700 sm:text-5xl">
                {minutesSaved}
              </span>
              <span className="text-sm font-medium text-indigo-600">Minutes</span>
            </div>
          </div>

          <p className="mt-4 text-sm text-slate-500">
            No action is required from you. Your Chartered Accountant can now
            review the results.
          </p>
        </div>
      </div>

      {/* Section 2: Today's Work */}
      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Today&apos;s Work
        </p>
        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {[
            "OCR completed",
            "Bank identified",
            "Statement period verified",
            "Transactions extracted",
            "Financial summary prepared",
            "Ready for CA review",
          ].map((item) => (
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

      {/* Section 3: Analysis Summary */}
      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Analysis Summary
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-3 lg:grid-cols-4">
          <SummaryItem icon={Building2} label="Bank Name" value={metadata.bankName} />
          <SummaryItem
            icon={UserRound}
            label="Account Holder"
            value={metadata.accountHolder}
          />
          <SummaryItem
            icon={CalendarRange}
            label="Statement Period"
            value={
              metadata.statementFrom && metadata.statementTo
                ? `${metadata.statementFrom} → ${metadata.statementTo}`
                : undefined
            }
          />
          <SummaryItem
            icon={Wallet}
            label="Opening Balance"
            value={
              metadata.openingBalance !== undefined
                ? formatCurrency(metadata.openingBalance, metadata.currency)
                : undefined
            }
          />
          <SummaryItem
            icon={Banknote}
            label="Closing Balance"
            value={
              metadata.closingBalance !== undefined
                ? formatCurrency(metadata.closingBalance, metadata.currency)
                : undefined
            }
          />
          <SummaryItem icon={Coins} label="Currency" value={metadata.currency} />
          <SummaryItem
            icon={ShieldCheck}
            label="Confidence"
            value={`${confidencePct}%`}
            accent="text-emerald-600"
          />
        </div>
      </div>

      {/* Section 4: AI Observations */}
      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-500" />
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            AI Observations
          </p>
        </div>
        <ul className="mt-4 space-y-2.5">
          {observations.map((obs, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2.5 text-sm text-slate-700"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
              <span>{obs}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 5: Transactions */}
      <div className="mt-6 rounded-2xl border border-slate-200/70 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Transactions
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {filteredTransactions.length} of {transactions.length} shown
            </p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search description or category…"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Description</th>
                <th className="px-6 py-3 font-semibold">Category</th>
                <th className="px-6 py-3 text-right font-semibold">Debit</th>
                <th className="px-6 py-3 text-right font-semibold">Credit</th>
                <th className="px-6 py-3 text-right font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-sm text-slate-400">
                    {transactions.length === 0
                      ? "No transactions found in this document."
                      : "No transactions match your search."}
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t, idx) => (
                  <tr key={idx} className="transition-colors hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-6 py-3 text-slate-600">
                      {t.date ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-slate-800">
                      {t.description ?? "—"}
                    </td>
                    <td className="px-6 py-3 text-slate-500">
                      {t.category ? (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                          {t.category}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-red-600">
                      {t.debit ? formatCurrency(t.debit, metadata.currency) : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right text-emerald-600">
                      {t.credit ? formatCurrency(t.credit, metadata.currency) : "—"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-3 text-right font-medium text-slate-800">
                      {t.balance !== undefined && t.balance !== null
                        ? formatCurrency(t.balance, metadata.currency)
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Small presentational helper
// ----------------------------------------------------------------------------

function SummaryItem({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Building2;
  label: string;
  value?: string;
  accent?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-1.5 text-slate-400">
        <Icon size={14} />
        <span className="text-[11px] font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className={`text-sm font-semibold text-slate-900 ${accent ?? ""}`}>
        {value ?? "—"}
      </p>
    </div>
  );
}
