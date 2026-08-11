import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <div
      className="relative mx-4 mb-8 overflow-hidden rounded-3xl bg-ink-950 px-6 py-16 text-center sm:mx-8 sm:px-10"
      style={{ backgroundImage: "radial-gradient(600px 300px at 50% 0%, rgba(212,169,63,.12), transparent)" }}
    >
      <h2 className="relative mb-3.5 font-display text-4xl font-semibold text-white">Ready to modernize your practice?</h2>
      <p className="relative mx-auto mb-8 max-w-[520px] text-lg text-ink-300">
        Join CAs across India who&apos;ve replaced manual reconciliation with AI.
      </p>
      <div className="relative flex justify-center gap-3.5">
        <Button asChild size="lg" className="bg-white text-ink-950 hover:bg-mist">
          <Link href="/signup">Start Free</Link>
        </Button>
        <Button size="lg" variant="secondary" className="border-white/25 bg-transparent text-white hover:bg-white/10">
          Talk to Sales
        </Button>
      </div>
    </div>
  );
}
