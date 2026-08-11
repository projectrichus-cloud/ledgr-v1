import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PLANS = [
  {
    tier: "Starter",
    amt: "₹0",
    per: "Free for up to 3 clients",
    features: ["Up to 3 clients", "All document types", "Basic AI reconciliation"],
    cta: "Start Free",
    featured: false,
  },
  {
    tier: "Professional",
    amt: "₹2,499",
    per: "per month · up to 30 clients",
    features: ["Up to 30 clients", "Full AI findings & reports", "Client self-serve portal", "Priority support"],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    tier: "Firm",
    amt: "Custom",
    per: "Unlimited clients & team seats",
    features: ["Unlimited clients & seats", "Dedicated onboarding", "SSO & audit logs"],
    cta: "Talk to Sales",
    featured: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="px-4 py-24">
      <div className="mx-auto mb-16 max-w-[640px] text-center">
        <span className="mb-3.5 block text-xs font-bold uppercase tracking-wider text-brand-600">Pricing</span>
        <h2 className="font-display text-4xl font-semibold">Simple plans that scale with your practice</h2>
      </div>
      <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-stretch gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.tier}
            className={`flex flex-col rounded-[18px] border p-8 ${
              p.featured ? "scale-[1.03] border-ink-950 bg-ink-950 text-white shadow-pop" : "border-line bg-paper"
            }`}
          >
            <div className={`mb-4 text-xs font-bold uppercase tracking-wider ${p.featured ? "text-gold-400" : "text-brand-600"}`}>
              {p.tier}
            </div>
            <div className="mb-1 font-mono text-[38px] font-semibold">{p.amt}</div>
            <div className={`mb-6 text-[13px] ${p.featured ? "text-ink-300" : "text-ink-400"}`}>{p.per}</div>
            <ul className="mb-7 flex-1 space-y-1">
              {p.features.map((f) => (
                <li key={f} className={`flex items-center gap-2.5 py-1.5 text-[13.5px] ${p.featured ? "text-ink-200" : "text-ink-600"}`}>
                  <Check className={`h-[15px] w-[15px] flex-shrink-0 ${p.featured ? "text-gold-400" : "text-green-600"}`} />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant={p.featured ? "primary" : "secondary"} className={p.featured ? "bg-white text-ink-950 hover:bg-mist" : ""}>
              <Link href="/signup">{p.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
}
