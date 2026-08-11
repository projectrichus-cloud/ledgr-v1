import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Company } from "@/types";

export function ClientHeader({ company, caName, findingsHref, requestHref }: { company: Company; caName: string; findingsHref: string; requestHref: string }) {
  const initials = company.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-5">
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 rounded-2xl">
          <AvatarFallback className="rounded-2xl bg-brand-900 text-xl text-white">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-display text-[23px] font-semibold">{company.name}</h1>
          <div className="mt-1 flex flex-wrap gap-3.5 text-[13px] text-ink-500">
            <span>{company.gstin ?? "GSTIN not set"}</span>
            <span>·</span>
            <span>{company.sector ?? "Sector not set"}</span>
            <span>·</span>
            <span>
              Assigned to <b className="text-ink-700">{caName}</b>
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-2.5">
        <Button variant="secondary" asChild>
          <a href={requestHref}>Request Document</a>
        </Button>
        <Button asChild>
          <a href={findingsHref}>View AI Findings</a>
        </Button>
      </div>
    </div>
  );
}
