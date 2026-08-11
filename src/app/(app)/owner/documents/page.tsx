import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { UploadRow } from "@/components/upload/upload-row";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function OwnerDocumentsPage() {
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

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("company_id", company.id)
    .order("created_at", { ascending: false });

  return (
    <>
      <Topbar title="My Documents" subtitle={company.name} search={false}>
        <Button asChild size="sm">
          <Link href="/upload">Upload</Link>
        </Button>
      </Topbar>

      {!documents || documents.length === 0 ? (
        <Card className="p-10 text-center text-sm text-ink-400">You haven&apos;t uploaded any documents yet.</Card>
      ) : (
        <div className="space-y-3">
          {documents.map((d) => (
            <UploadRow key={d.id} document={d} />
          ))}
        </div>
      )}
    </>
  );
}
