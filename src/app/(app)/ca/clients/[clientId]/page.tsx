import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClientHeader } from "@/components/client-profile/client-header";
import { ScoreCards } from "@/components/client-profile/score-cards";
import { DocumentGrid } from "@/components/client-profile/document-grid";
import { FinancialSummary } from "@/components/client-profile/financial-summary";
import { NotesPanel } from "@/components/client-profile/notes-panel";
import { ActivityTimeline, type ActivityItem } from "@/components/dashboard/activity-timeline";
import { FindingsMiniList } from "@/components/dashboard/findings-mini-list";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileCheck2 } from "lucide-react";
import type { Document } from "@/types";

const RISK_SCORE: Record<string, number> = { low: 20, medium: 55, high: 88 };
const RISK_LABEL: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };

export default async function ClientProfilePage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId: companyId } = await params;
  const supabase = await createClient();

  const [{ data: company }, { data: documents }, { data: notes }, { data: activity }, { data: caLink }] =
    await Promise.all([
      supabase.from("companies").select("*").eq("id", companyId).maybeSingle(),
      supabase.from("documents").select("*").eq("company_id", companyId),
      supabase.from("notes").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
      supabase
        .from("activity_log")
        .select("*")
        .eq("company_id", companyId)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.from("ca_clients").select("*, ca:profiles(full_name)").eq("company_id", companyId).maybeSingle(),
    ]);

  if (!company) notFound();

  const docs: Document[] = (documents ?? []) as Document[];
  const completedCount = docs.filter((d) => d.status === "completed").length;
  const riskLevel = (caLink as unknown as { risk_level?: string })?.risk_level ?? "low";
  const caName = (caLink as unknown as { ca?: { full_name?: string } })?.ca?.full_name ?? "Unassigned";

const activityItems: ActivityItem[] = ((activity ?? []) as any[]).map((a) => ({    id: a.id,
    icon: FileCheck2,
    iconBg: "#E8EEF6",
    iconColor: "#234E85",
    message: a.message,
    createdAt: a.created_at,
  }));

  return (
    <>
      <ClientHeader company={company} caName={caName} findingsHref={`/ca/findings/${companyId}`} requestHref="/upload" />

      <ScoreCards
        complianceScore={85}
        riskLabel={RISK_LABEL[riskLevel]}
        riskScoreValue={RISK_SCORE[riskLevel]}
        docsCompleted={completedCount}
        docsTotal={9}
        caName={caName}
        caInitials={caName.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <DocumentGrid documents={docs} uploadHref="/upload" />
          <div className="mt-5">
            {/* Placeholder figures — there's no financial_summaries table yet.
                Once extraction exists, replace this with real aggregates
                computed from the uploaded GST/ITR/bank documents. */}
            <FinancialSummary
              blocks={[
                {
                  title: "GST Summary",
                  rows: [
                    { label: "Turnover declared", value: 18400000 },
                    { label: "Tax paid", value: 2210000 },
                    { label: "ITC claimed", value: 940000 },
                  ],
                },
                {
                  title: "Tax Summary",
                  rows: [
                    { label: "Total income", value: 12000000 },
                    { label: "Tax liability", value: 1860000 },
                    { label: "TDS credit", value: 620000 },
                  ],
                },
                {
                  title: "Bank Summary",
                  rows: [
                    { label: "Total credits", value: 19000000 },
                    { label: "Total debits", value: 17000000 },
                    { label: "Closing balance", value: 3140000 },
                  ],
                },
              ]}
            />
          </div>
          <div className="mt-5">
            <FindingsMiniList findings={[]} viewAllHref={`/ca/findings/${companyId}`} />
          </div>
        </div>
        <div className="space-y-5">
          {activityItems.length > 0 ? (
            <ActivityTimeline title="Activity Timeline" items={activityItems} />
          ) : (
            <Card className="p-6 text-center text-[13px] text-ink-400">No activity yet.</Card>
          )}
          <NotesPanel notes={notes ?? []} authorName={caName} />
          <Card className="p-6">
            <Button variant="secondary" className="w-full">
              Download Report
            </Button>
          </Card>
        </div>
      </div>
    </>
  );
}
