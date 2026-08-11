const COLUMNS = [
  { h: "Product", links: ["Dashboard", "Document AI", "Reconciliation", "Reports"] },
  { h: "Company", links: ["About", "Careers", "Blog"] },
  { h: "Resources", links: ["Help Center", "Security", "API Docs"] },
  { h: "Legal", links: ["Privacy", "Terms"] },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-line px-4 py-16">
      <div className="container grid grid-cols-2 gap-8 pb-12 sm:grid-cols-3 lg:grid-cols-5">
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="mb-3.5 flex items-center gap-2.5 font-display text-lg font-semibold">
            <span className="relative h-6 w-6 flex-shrink-0 rounded-md bg-ink-950">
              <span className="absolute left-1.5 right-1.5 top-2 h-0.5 rounded bg-gold-400" />
            </span>
            Ledgr
          </div>
          <p className="max-w-[260px] text-sm text-ink-500">
            The AI financial intelligence platform for Indian chartered accountants and finance teams.
          </p>
        </div>
        {COLUMNS.map((c) => (
          <div key={c.h}>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wide text-ink-400">{c.h}</h4>
            <ul className="space-y-1.5">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="text-[13.5px] text-ink-600 hover:text-ink-950">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container flex flex-col gap-2 border-t border-line pt-7 text-xs text-ink-400 sm:flex-row sm:justify-between">
        <span>© 2026 Ledgr Technologies Pvt. Ltd.</span>
        <span>Made for Indian CAs</span>
      </div>
    </footer>
  );
}
