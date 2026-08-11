const TESTIMONIALS = [
  { q: "Reconciliation that took my team two days now takes twenty minutes. The mismatch detection alone has caught issues we'd have missed manually.", n: "Rohit Agarwal", r: "Partner, Agarwal & Co.", i: "RA" },
  { q: "My clients finally have visibility into their own compliance status instead of calling me every other day for updates.", n: "Sneha Mehta", r: "Chartered Accountant", i: "SM" },
  { q: "The confidence scoring gives me exactly the right amount of trust — I know precisely where to apply my own judgment.", n: "Vikram Kapoor", r: "Founder, Kapoor Finserve", i: "VK" },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="border-y border-line bg-paper px-4 py-24">
      <div className="mx-auto mb-16 max-w-[640px] text-center">
        <span className="mb-3.5 block text-xs font-bold uppercase tracking-wider text-brand-600">Customer stories</span>
        <h2 className="font-display text-4xl font-semibold">Built with practising CAs, for practising CAs</h2>
      </div>
      <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TESTIMONIALS.map((t) => (
          <div key={t.n} className="rounded-2xl border border-line bg-paper p-6.5">
            <div className="mb-3.5 tracking-widest text-gold-500">★★★★★</div>
            <p className="mb-5 text-sm leading-relaxed text-ink-700">{t.q}</p>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-[13px] font-bold text-brand-700">
                {t.i}
              </div>
              <div>
                <div className="text-[13.5px] font-bold">{t.n}</div>
                <div className="text-xs text-ink-400">{t.r}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
