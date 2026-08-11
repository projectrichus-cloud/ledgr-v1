import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

/**
 * Portfolio-wide findings index. Since AI extraction isn't wired up
 * yet, this links out to each client's findings page rather than
 * listing individual findings — those are seeded per-client for now
 * (see ca/findings/[clientId]/page.tsx).
 */

interface CaClientLink {
  id: string;
  company_id: string;
  company?: { name?: string } | null;
}

export default async function CaFindingsIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clientLinks } = await supabase
    .from("ca_clients")
    .select("*, company:companies!ca_clients_company_id_fkey(*)")
    .eq("ca_id", user!.id)
    .order("created_at", { ascending: false });

  const clients = (clientLinks ?? []) as unknown as CaClientLink[];

  return (
    <>
      <Topbar title="AI Findings" subtitle="Select a client to review their findings" search={false} />
      {clients.length === 0 ? (
        <Card className="p-10 text-center text-sm text-ink-400">Invite a client to start seeing findings here.</Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Link key={c.id} href={`/ca/findings/${c.company_id}`}>
              <Card className="flex items-center gap-3 p-5 transition-shadow hover:shadow-hover">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gold-50">
                  <Sparkles className="h-4 w-4 text-gold-600" />
                </div>
                <div>
                  <div className="text-[13.5px] font-semibold">{c.company?.name}</div>
                  <div className="text-xs text-ink-400">View AI findings</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
