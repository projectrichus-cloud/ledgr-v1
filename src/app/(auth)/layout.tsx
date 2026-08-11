import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4 py-12">
      <div className="w-full max-w-[440px]">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5 font-display text-xl font-semibold">
          <span className="relative h-7 w-7 flex-shrink-0 rounded-md bg-ink-950">
            <span className="absolute left-1.5 right-1.5 top-2 h-0.5 rounded bg-gold-400" />
          </span>
          Ledgr
        </Link>
        <div className="rounded-lg border border-line bg-paper p-8 shadow-card">{children}</div>
      </div>
    </div>
  );
}
