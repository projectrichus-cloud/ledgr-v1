import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { Card } from "@/components/ui/card";
import { ApproveReportButton } from "@/components/ca/approve-report-button";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export default async function CaReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: reports } = await supabase
    .from("reports")
    .select("*, company:companies(name)")
    .eq("ca_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Topbar title="Reports" subtitle="Draft, review, and approve reconciliation reports" search={false} />

      {!reports || reports.length === 0 ? (
        <Card className="p-10 text-center text-sm text-ink-400">
          No reports yet — reports are created from a client&apos;s AI Findings page.
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r: any) => (
            <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <div className="text-[13.5px] font-semibold">{r.title}</div>
                <div className="mt-0.5 text-xs text-ink-400">
                  {r.company?.name} · {formatDate(r.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={r.status === "approved" ? "green" : r.status === "pending_approval" ? "amber" : "ink"}>
                  {r.status.replace("_", " ")}
                </Badge>
                {r.status !== "approved" && <ApproveReportButton reportId={r.id} />}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
