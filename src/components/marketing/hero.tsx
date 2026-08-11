import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <header
      className="px-4 pb-10 pt-20 text-center"
      style={{ background: "radial-gradient(ellipse 900px 500px at 50% -10%, #F3F6FA, transparent)" }}
    >
      <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-line-strong bg-paper py-1.5 pl-2 pr-3.5 text-[13px] font-semibold text-ink-700 shadow-rest">
        <span className="h-[18px] w-[18px] rounded-[5px]" style={{ background: "linear-gradient(135deg,#D9A93F,#A8790E)" }} />
        Built for Indian GST, ITR &amp; AIS compliance
      </div>
      <h1 className="mx-auto max-w-[920px] text-balance font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl">
        Your AI <em className="text-brand-600 not-italic font-medium italic">Financial Intelligence</em> Platform
      </h1>
      <p className="mx-auto mt-5 max-w-[620px] text-lg leading-relaxed text-ink-500">
        Upload GST, ITR, 26AS, AIS, Bank Statements and Financial Statements. AI extracts, reconciles,
        detects discrepancies and generates audit-ready reports — in minutes, not weeks.
      </p>
      <div className="mt-9 mb-16 flex justify-center gap-3.5">
        <Button asChild size="lg">
          <Link href="/signup">Start Free</Link>
        </Button>
        <Button variant="secondary" size="lg">
          <PlayCircle className="h-4 w-4" /> Watch Demo
        </Button>
      </div>

      <div className="mx-auto max-w-[1040px] overflow-hidden rounded-[20px] border border-line bg-paper shadow-pop">
        <div className="flex items-center gap-1.5 border-b border-line bg-mist px-4.5 py-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        </div>
        <div className="grid grid-cols-1 text-left md:grid-cols-[180px_1fr]" style={{ minHeight: 380 }}>
          <div className="hidden bg-ink-950 p-5 md:block">
            {["Dashboard", "Clients", "Documents", "AI Findings", "Reports"].map((item, i) => (
              <div
                key={item}
                className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-semibold ${
                  i === 0 ? "bg-white/10 text-white" : "text-ink-400"
                }`}
              >
                <span className="h-3.5 w-3.5 rounded opacity-30" style={{ background: "currentColor" }} />
                {item}
              </div>
            ))}
          </div>
          <div className="bg-mist p-5.5">
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { l: "CLIENTS", v: "128", c: "" },
                { l: "DOCS PROCESSED", v: "2,940", c: "" },
                { l: "CRITICAL ISSUES", v: "7", c: "text-red-600" },
                { l: "COMPLIANCE", v: "94%", c: "text-green-600" },
              ].map((k) => (
                <div key={k.l} className="rounded-[10px] border border-line bg-paper p-3">
                  <div className="mb-1.5 text-[10.5px] font-semibold text-ink-400">{k.l}</div>
                  <div className={`font-mono text-[19px] font-semibold ${k.c}`}>{k.v}</div>
                </div>
              ))}
            </div>
            <div className="flex h-[170px] items-end gap-2 rounded-[10px] border border-line bg-paper p-4">
              {[40, 65, 48, 80, 60, 92, 70, 55].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t ${i === 5 ? "bg-gradient-to-b from-gold-400 to-gold-600" : "bg-gradient-to-b from-brand-500 to-brand-700"}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
