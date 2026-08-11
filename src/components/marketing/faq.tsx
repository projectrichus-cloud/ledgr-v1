"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  { q: "Which documents can Ledgr read?", a: "GSTR-1, GSTR-3B, ITR, Form 26AS, AIS/TIS, Balance Sheet, P&L, Trial Balance, bank statements and invoices — all as PDF uploads." },
  { q: "Is my clients' financial data secure?", a: "Yes. All documents are encrypted at rest and in transit, with role-based access so only assigned CAs and the business owner can view them." },
  { q: "Does the AI replace my professional judgment?", a: "No — Ledgr surfaces mismatches and evidence for you to review. Every report requires your explicit approval before a client can see it." },
  { q: "Can my clients upload documents themselves?", a: "Yes. Business owners get their own portal to upload documents directly and track processing status in real time." },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line bg-paper px-4 py-24">
      <div className="mx-auto mb-16 max-w-[640px] text-center">
        <span className="mb-3.5 block text-xs font-bold uppercase tracking-wider text-brand-600">FAQ</span>
        <h2 className="font-display text-4xl font-semibold">Questions, answered</h2>
      </div>
      <div className="mx-auto max-w-[760px]">
        {FAQS.map((f, i) => (
          <div key={f.q} className="cursor-pointer border-b border-line py-5.5" onClick={() => setOpen(open === i ? null : i)}>
            <div className="flex items-center justify-between text-[15.5px] font-semibold">
              {f.q}
              <Plus className={cn("h-4 w-4 flex-shrink-0 text-ink-400 transition-transform", open === i && "rotate-45")} />
            </div>
            <div className={cn("overflow-hidden transition-all", open === i ? "max-h-40 pt-3.5" : "max-h-0")}>
              <p className="max-w-[640px] text-[13.5px] leading-relaxed text-ink-500">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
