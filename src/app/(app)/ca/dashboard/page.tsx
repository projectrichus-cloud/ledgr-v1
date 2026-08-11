import { Users, FileCheck2, Loader2, AlertTriangle, ClipboardList } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityTimeline, type ActivityItem } from "@/components/dashboard/activity-timeline";
import { RiskDistribution } from "@/components/dashboard/risk-distribution";
import { TasksPanel } from "@/components/dashboard/tasks-panel";
import { FindingsMiniList } from "@/components/dashboard/findings-mini-list";
import { ClientList } from "@/components/ca/client-list";
import { InviteClientDialog } from "@/components/ca/invite-client-dialog";
import { Card } from "@/components/ui/card";
import type { CaClient } from "@/types";

const AVATAR_COLORS = ["#0F2A4A", "#DC2626", "#0B7A50", "#5B6B84", "#234E85", "#A8790E"];

export default async function CaDashboardPage() {
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

  const [{ data: allDocuments }, { data: activity }] = await Promise.all([
    companyIds.length
      ? supabase.from("documents").select("*").in("company_id", companyIds)
      : Promise.resolve({ data: [] as { company_id: string; status: string }[] }),
    supabase
      .from("activity_log")
      .select("*, company:companies(name)")
      .in("company_id", companyIds.length ? companyIds : ["00000000-0000-0000-0000-000000000000"])
      .order("created_at", { ascending: false })
      .limit(6),
  ]);

  const docs = allDocuments ?? [];
  const completedDocs = docs.filter((d) => d.status === "completed").length;
  const processingDocs = docs.filter((d) => d.status === "processing").length;

  const riskCounts = {
    low: clients.filter((c) => c.risk_level === "low").length,
    medium: clients.filter((c) => c.risk_level === "medium").length,
    high: clients.filter((c) => c.risk_level === "high").length,
  };
  const totalClients = clients.length || 1;

  const clientsWithMeta = clients.map((c, i) => {
    const companyDocs = docs.filter((d) => d.company_id === c.company_id);
    return {
      client: c,
      docsCompleted: companyDocs.filter((d) => d.status === "completed").length,
      docsTotal: 9,
      lastActivityAt: c.created_at,
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
    };
  });

  const activityItems: ActivityItem[] = ((activity ?? []) as any[]).map((a) => ({
    id: a.id,
    icon: FileCheck2,
    iconBg: "#E8EEF6",
    iconColor: "#234E85",
    message: (
      <>
        <b>{(a as unknown as { company?: { name?: string } }).company?.name}</b>: {a.message}
      </>
    ),
    createdAt: a.created_at,
  }));

  return (
    <>
      <Topbar title="Good morning" subtitle="Here's what needs your attention today">
        <InviteClientDialog />
      </Topbar>

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <KpiCard icon={Users} iconBg="#E8EEF6" iconColor="#234E85" label="Total Clients" value={clients.length} delta="Your portfolio" />
        <KpiCard icon={FileCheck2} iconBg="#DEF7EC" iconColor="#0B7A50" label="Documents Uploaded" value={completedDocs} delta="Across all clients" />
        <KpiCard icon={Loader2} iconBg="#FDF8EE" iconColor="#A8790E" label="AI Processing" value={processingDocs} delta="~4 min avg" />
        <KpiCard
          icon={AlertTriangle}
          iconBg="#FBDCDC"
          iconColor="#DC2626"
          label="Critical Issues"
          value={riskCounts.high}
          delta="Needs review"
          deltaColor="text-red-600"
        />
        <KpiCard icon={ClipboardList} iconBg="#FCEACC" iconColor="#9A5B0A" label="Pending Reviews" value={riskCounts.high + riskCounts.medium} delta="Awaiting approval" />
      </div>

      <ClientList clients={clientsWithMeta} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div>
          {activityItems.length > 0 ? (
            <ActivityTimeline items={activityItems} viewAllHref="#" />
          ) : (
            <Card className="mb-5 p-6 text-center text-[13px] text-ink-400">
              No activity yet — invite your first client to get started.
            </Card>
          )}
          <FindingsMiniList findings={[]} viewAllHref="/ca/findings" />
        </div>
        <div className="space-y-5">
          <RiskDistribution
            rows={[
              { label: "Low", count: riskCounts.low, percent: (riskCounts.low / totalClients) * 100, color: "#0E9F6E" },
              { label: "Medium", count: riskCounts.medium, percent: (riskCounts.medium / totalClients) * 100, color: "#D97706" },
              { label: "High", count: riskCounts.high, percent: (riskCounts.high / totalClients) * 100, color: "#DC2626" },
            ]}
          />
          <TasksPanel tasks={[]} />
        </div>
      </div>
    </>
  );
}
