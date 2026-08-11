import Link from "next/link";
import {
  FileCheck2,
  Loader2,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { Topbar } from "@/components/layout/topbar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ActivityTimeline } from "@/components/dashboard/activity-timeline";
import { AiFinanceTeamCard } from "@/components/dashboard/ai-finance-team-card";
import { RequestsPanel } from "@/components/owner/requests-panel";
import { DocumentChecklist } from "@/components/owner/document-checklist";
import { CompanyProfileCard } from "@/components/owner/company-profile-card";
import { ProcessingStatus } from "@/components/owner/processing-status";
import { ReportsList } from "@/components/owner/reports-list";

import { REQUIRED_DOCUMENT_TYPES } from "@/lib/constants";

import { Card } from "@/components/ui/card";

import type { ActivityItem } from "@/components/dashboard/activity-timeline";

export default async function OwnerDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!company) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="mb-2 font-display text-2xl font-semibold">
          Let&apos;s set up your company
        </h1>

        <p className="mb-6 text-sm text-ink-500">
          You need a company profile before you can upload
          documents.
        </p>

        <Link
          href="/onboarding/business-owner"
          className="font-semibold text-brand-600"
        >
          Complete setup →
        </Link>
      </div>
    );
  }

  const [
    { data: documents },
    { data: requests },
    { data: reports },
    { data: activity },
    { data: caLinks },
  ] = await Promise.all([
    supabase
      .from("documents")
      .select("*")
      .eq("company_id", company.id),

    supabase
      .from("document_requests")
      .select("*")
      .eq("company_id", company.id)
      .eq("status", "pending"),

    supabase
      .from("reports")
      .select("*")
      .eq("company_id", company.id)
      .eq("status", "approved"),

    supabase
      .from("activity_log")
      .select("*")
      .eq("company_id", company.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(5),

    supabase
      .from("ca_clients")
      .select(
        "*, ca:profiles(full_name)"
      )
      .eq("company_id", company.id)
      .limit(1),
  ]);

  const docs = documents ?? [];

  const completedCount = docs.filter(
    (d) => d.status === "completed"
  ).length;

  const processingCount = docs.filter(
    (d) => d.status === "processing"
  ).length;

  const caName =
    (
      caLinks?.[0] as unknown as {
        ca?: {
          full_name?: string;
        };
      }
    )?.ca?.full_name ??
    "your CA";

  const activityItems: ActivityItem[] =
    (activity ?? []).map((a) => ({
      id: a.id,
      icon: FileCheck2,
      iconBg: "#E8EEF6",
      iconColor: "#234E85",
      message: a.message,
      createdAt: a.created_at,
    }));

  return (
    <>
      <Topbar
        title={`Welcome back, ${
          user?.user_metadata?.full_name?.split(
            " "
          )[0] ?? ""
        }`}
        subtitle={`${company.name} · CA: ${caName} · FY ${company.financial_year}`}
      >
        <Link
          href="/upload"
          className="rounded-sm bg-ink-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-900"
        >
          Upload Document
        </Link>
      </Topbar>

      <AiFinanceTeamCard
        companyId={company.id}
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          icon={FileCheck2}
          iconBg="#DEF7EC"
          iconColor="#0B7A50"
          label="Documents Uploaded"
          value={
            <>
              {completedCount}

              <span className="text-base text-ink-400">
                /{REQUIRED_DOCUMENT_TYPES.length}
              </span>
            </>
          }
          delta={`${
            REQUIRED_DOCUMENT_TYPES.length -
            completedCount
          } still required`}
        />

        <KpiCard
          icon={Loader2}
          iconBg="#FDF8EE"
          iconColor="#A8790E"
          label="AI Processing"
          value={processingCount}
          delta="In progress"
        />

        <KpiCard
          icon={AlertTriangle}
          iconBg="#FCEACC"
          iconColor="#9A5B0A"
          label="Missing Documents"
          value={
            (requests ?? []).length
          }
          delta="Requested by your CA"
          deltaColor="text-amber-700"
        />

        <KpiCard
          icon={ClipboardList}
          iconBg="#E8EEF6"
          iconColor="#234E85"
          label="Reports Ready"
          value={
            (reports ?? []).length
          }
          delta="Approved by your CA"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <RequestsPanel
            requests={requests ?? []}
            uploadHref="/upload"
          />

          <DocumentChecklist
            documents={docs}
            uploadHref="/upload"
          />

          {activityItems.length > 0 ? (
            <ActivityTimeline items={activityItems} />
          ) : (
            <Card className="p-6 text-center text-[13px] text-ink-400">
              No activity yet — upload your first document to get
              started.
            </Card>
          )}
        </div>

        <div className="space-y-5">
          <CompanyProfileCard company={company} />

          <ProcessingStatus documents={docs} />

          <ReportsList reports={reports ?? []} />
        </div>
      </div>
    </>
  );
}
