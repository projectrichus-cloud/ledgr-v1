import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Dropzone } from "@/components/upload/dropzone";
import { UploadRow } from "@/components/upload/upload-row";
import { MissingDocsGrid } from "@/components/upload/missing-docs-grid";
import { Card } from "@/components/ui/card";
import { REQUIRED_DOCUMENT_TYPES } from "@/lib/constants";
import type { DocumentType } from "@/types";

export default async function UploadPage({ searchParams }: { searchParams: Promise<{ company?: string }> }) {
  const { company: companyIdParam } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();

  let companyId = companyIdParam;

  if (!companyId && profile?.role !== "ca") {
    const { data: company } = await supabase
      .from("companies")
      .select("id, name")
      .eq("owner_id", user!.id)
      .maybeSingle();
    companyId = company?.id;
  }

  // CA hasn't picked a client yet — show a picker instead of a dropzone.
  if (!companyId && profile?.role === "ca") {
    const { data: clientLinks } = await supabase
      .from("ca_clients")
      .select("company_id, company:companies(name)")
      .eq("ca_id", user!.id);

    return (
      <>
        <h1 className="mb-1 font-display text-2xl font-semibold">Upload documents</h1>
        <p className="mb-6 text-[13.5px] text-ink-500">Choose which client you&apos;re uploading for.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(clientLinks ?? []).map((c: any) => (
            <Link key={c.company_id} href={`/upload?company=${c.company_id}`}>
              <Card className="p-5 transition-shadow hover:shadow-hover">
                <div className="text-[13.5px] font-semibold">{c.company?.name}</div>
              </Card>
            </Link>
          ))}
        </div>
      </>
    );
  }

  if (!companyId) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="mb-2 font-display text-2xl font-semibold">Set up your company first</h1>
        <p className="mb-6 text-sm text-ink-500">You need a company profile before you can upload documents.</p>
        <Link href="/onboarding/business-owner" className="font-semibold text-brand-600">
          Complete setup →
        </Link>
      </div>
    );
  }

  const [{ data: company }, { data: documents }] = await Promise.all([
    supabase.from("companies").select("*").eq("id", companyId).single(),
    supabase.from("documents").select("*").eq("company_id", companyId).order("created_at", { ascending: false }),
  ]);

  const docs = documents ?? [];
  const uploadedTypes = new Set(docs.filter((d) => d.status !== "failed").map((d) => d.type));
  const missingTypes = REQUIRED_DOCUMENT_TYPES.filter((t) => !uploadedTypes.has(t)) as DocumentType[];

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-semibold">Upload documents</h1>
      <p className="mb-6 text-[13.5px] text-ink-500">
        {company?.name} · FY {company?.financial_year}
      </p>

      <Dropzone companyId={companyId} />

      {docs.length > 0 && (
        <>
          <div className="mb-3.5 text-xs font-bold uppercase tracking-wide text-ink-400">
            This session · {docs.length} file{docs.length === 1 ? "" : "s"}
          </div>
          <div className="mb-7 space-y-3">
            {docs.map((d) => (
              <UploadRow key={d.id} document={d} />
            ))}
          </div>
        </>
      )}

      <MissingDocsGrid missingTypes={missingTypes} />
    </>
  );
}
