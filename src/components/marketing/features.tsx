import { AlertTriangle, ScanSearch, Zap, FileCheck2, ShieldCheck } from "lucide-react";

const FEATURES = [
  { icon: ScanSearch, t: "Auto document classification", d: "Drop in any PDF — Ledgr identifies whether it's a GSTR-1, Form 26AS, or bank statement on its own." },
  { icon: Zap, t: "Confidence-scored extraction", d: "Every extracted figure carries a confidence score, so you know exactly what needs a second look." },
  { icon: FileCheck2, t: "Audit-ready reports", d: "Export a polished, shareable reconciliation report with evidence and recommended actions built in." },
  { icon: ShieldCheck, t: "Bank-grade security", d: "Documents are encrypted at rest and in transit, with granular access control per client." },
];

export function Features() {
  return (
    <section id="features" className="px-4 py-24">
      <div className="mx-auto mb-16 max-w-[640px] text-center">
        <span className="mb-3.5 block text-xs font-bold uppercase tracking-wider text-brand-600">AI Features</span>
        <h2 className="font-display text-4xl font-semibold">It thinks like a senior CA — instantly</h2>
        <p className="mt-4 text-ink-500">Every insight is traceable back to the exact document and line item it came from.</p>
      </div>
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-ink-950 p-7 text-white lg:col-span-2">
          <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px]" style={{ background: "rgba(212,169,63,.12)", border: "1px solid rgba(212,169,63,.25)" }}>
            <AlertTriangle className="h-[19px] w-[19px] text-gold-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold">Discrepancy detection across every filing</h3>
          <p className="text-[13.5px] leading-relaxed text-ink-300">
            Ledgr cross-checks turnover in GSTR-3B against the P&amp;L, TDS in 26AS against the books, and bank
            credits against declared revenue — flagging every mismatch with the exact amount and source.
          </p>
        </div>
        {FEATURES.map((f) => (
          <div key={f.t} className="rounded-2xl border border-line bg-paper p-7">
            <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-gold-100 bg-gold-50">
              <f.icon className="h-[19px] w-[19px] text-gold-600" />
            </div>
            <h3 className="mb-2 text-[16.5px] font-bold">{f.t}</h3>
            <p className="text-[13.5px] leading-relaxed text-ink-500">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
