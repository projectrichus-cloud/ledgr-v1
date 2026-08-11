import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { ReportsList } from "@/components/owner/reports-list";

export default async function OwnerReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: company } = await supabase.from("companies").select("id, name").eq("owner_id", user!.id).maybeSingle();

  if (!company) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="mb-2 font-display text-2xl font-semibold">Set up your company first</h1>
        <Link href="/onboarding/business-owner" className="font-semibold text-brand-600">
          Complete setup →
        </Link>
      </div>
    );
  }

  // Owners only ever see approved reports — enforced again here (not
  // just relying on the API route) since this reads straight from
  // Supabase in a Server Component.
  const { data: reports } = await supabase
    .from("reports")
    .select("*")
    .eq("company_id", company.id)
    .eq("status", "approved")
    .order("approved_at", { ascending: false });

  return (
    <>
      <Topbar title="Reports" subtitle={company.name} search={false} />
      <ReportsList reports={reports ?? []} />
    </>
  );
}
