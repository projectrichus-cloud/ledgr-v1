import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { RiskBadge, ClientStatusBadge } from "@/components/shared/status-badge";
import { timeAgo } from "@/lib/utils";
import type { CaClient } from "@/types";

interface ClientRowProps {
  client: CaClient;
  docsCompleted: number;
  docsTotal: number;
  lastActivityAt: string;
  avatarColor?: string;
}

export function ClientRow({ client, docsCompleted, docsTotal, lastActivityAt, avatarColor = "#0F2A4A" }: ClientRowProps) {
  const initials = (client.company?.name ?? "??")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      href={`/ca/clients/${client.company_id}`}
      className="grid grid-cols-[2.2fr_0.8fr_1fr_1fr_auto] items-center gap-3.5 rounded-lg border-b border-line px-1 py-3.5 transition-colors last:border-b-0 hover:bg-mist max-[800px]:grid-cols-[1fr_auto]"
    >
      <div className="flex items-center gap-2.5">
        <Avatar>
          <AvatarFallback style={{ background: avatarColor, color: "#fff" }}>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-[13.5px] font-semibold">{client.company?.name}</div>
          <div className="text-[11.5px] text-ink-400">{client.company?.sector}</div>
        </div>
      </div>
      <div className="text-[12.5px] text-ink-500 max-[800px]:hidden">
        <span className="font-mono font-semibold">
          {docsCompleted}/{docsTotal}
        </span>{" "}
        docs
      </div>
      <div className="max-[800px]:hidden">
        {client.status === "onboarding" ? <ClientStatusBadge status="onboarding" /> : <RiskBadge level={client.risk_level} />}
      </div>
      <div className="text-xs text-ink-400 max-[800px]:hidden">{timeAgo(lastActivityAt)}</div>
      <Button variant="secondary" size="sm">
        View
      </Button>
    </Link>
  );
}
