import Link from "next/link";
import { Button } from "@/components/ui/button";

const LINKS = [
  { label: "Product", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Customers", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function MarketingNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-lg font-semibold">
          <span className="relative h-6.5 w-6.5 flex-shrink-0 rounded-md bg-ink-950" style={{ height: 26, width: 26 }}>
            <span className="absolute left-1.5 right-1.5 top-2 h-0.5 rounded bg-gold-400" />
          </span>
          Ledgr
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-ink-500 hover:text-ink-900">
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2.5">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/signup">Start Free</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
