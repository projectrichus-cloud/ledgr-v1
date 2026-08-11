const FIRMS = ["Anand & Associates", "Mehta CA LLP", "Sharma Auditors", "Kapoor Finserve", "Rao & Co."];

export function TrustStrip() {
  return (
    <div className="px-4 pb-20 pt-8 text-center">
      <div className="mb-6 text-xs font-bold uppercase tracking-wider text-ink-400">
        Trusted by chartered accountants across India
      </div>
      <div className="flex flex-wrap items-center justify-center gap-10 opacity-55 sm:gap-14">
        {FIRMS.map((f) => (
          <span key={f} className="font-display text-xl font-semibold text-ink-700">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
