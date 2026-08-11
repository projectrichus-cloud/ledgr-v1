const STEPS = [
  { n: "01", t: "Upload documents", d: "Drag in GST returns, ITR, 26AS, AIS, bank statements and financials — any order, any format." },
  { n: "02", t: "AI reads & extracts", d: "Ledgr identifies each document type and extracts every figure that matters, automatically." },
  { n: "03", t: "Cross-document reconciliation", d: "Revenue, tax and bank figures are matched across every filing to surface mismatches." },
  { n: "04", t: "Review & approve", d: "The CA reviews AI findings, approves the report, and the client sees a clean summary." },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-line bg-paper px-4 py-24">
      <div className="mx-auto mb-16 max-w-[640px] text-center">
        <span className="mb-3.5 block text-xs font-bold uppercase tracking-wider text-brand-600">How it works</span>
        <h2 className="font-display text-4xl font-semibold">From messy PDFs to an audit-ready report</h2>
        <p className="mt-4 text-ink-500">Four steps. No manual data entry, no cross-checking spreadsheets by hand.</p>
      </div>
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <div key={s.n} className={`px-5.5 py-7 ${i < STEPS.length - 1 ? "sm:border-r border-line" : ""}`}>
            <div className="mb-3.5 font-mono text-[13px] font-semibold text-gold-600">{s.n}</div>
            <h3 className="mb-2 text-[16.5px] font-bold">{s.t}</h3>
            <p className="text-[13.5px] leading-relaxed text-ink-500">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
