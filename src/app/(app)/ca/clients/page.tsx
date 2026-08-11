import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { ClientList } from "@/components/ca/client-list";
import { InviteClientDialog } from "@/components/ca/invite-client-dialog";
import type { CaClient } from "@/types";

const AVATAR_COLORS = ["#0F2A4A", "#DC2626", "#0B7A50", "#5B6B84", "#234E85", "#A8790E"];

export default async function CaClientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: clientLinks } = await supabase
    .from("ca_clients")
    .select("*, company:companies(*)")
    .eq("ca_id", user!.id)
    .order("created_at", { ascending: false });

  const clients = (clientLinks ?? []) as unknown as CaClient[];
  const companyIds = clients.map((c) => c.company_id);

  const { data: allDocuments } = companyIds.length
    ? await supabase.from("documents").select("*").in("company_id", companyIds)
    : { data: [] as { company_id: string; status: string }[] };

  const clientsWithMeta = clients.map((c, i) => {
    const companyDocs = (allDocuments ?? []).filter((d) => d.company_id === c.company_id);
    return {
      client: c,
      docsCompleted: companyDocs.filter((d) => d.status === "completed").length,
      docsTotal: 9,
      lastActivityAt: c.created_at,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
    };
  });

  return (
    <>
      <Topbar title="Clients" subtitle={`${clients.length} client${clients.length === 1 ? "" : "s"} in your portfolio`}>
        <InviteClientDialog />
      </Topbar>
      <ClientList clients={clientsWithMeta} />
    </>
  );
}
