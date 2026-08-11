"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Company } from "@/types";

export default function OwnerCompanyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from("companies").select("*").eq("owner_id", user.id).maybeSingle();
      setCompany(data);
      setLoading(false);
    })();
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!company) return;
    setSaving(true);

    const { error } = await supabase
      .from("companies")
      .update({
        name: company.name,
        gstin: company.gstin,
        pan: company.pan,
        sector: company.sector,
        financial_year: company.financial_year,
      })
      .eq("id", company.id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Company profile updated");
    router.refresh();
  }

  if (loading) {
    return <div className="text-sm text-ink-400">Loading...</div>;
  }

  if (!company) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="mb-2 font-display text-2xl font-semibold">No company profile yet</h1>
        <a href="/onboarding/business-owner" className="font-semibold text-brand-600">
          Complete setup →
        </a>
      </div>
    );
  }

  return (
    <>
      <h1 className="mb-6 font-display text-2xl font-semibold">Company Profile</h1>
      <Card className="max-w-xl p-6">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Company name</Label>
            <Input id="name" value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="gstin">GSTIN</Label>
              <Input id="gstin" value={company.gstin ?? ""} onChange={(e) => setCompany({ ...company, gstin: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pan">PAN</Label>
              <Input id="pan" value={company.pan ?? ""} onChange={(e) => setCompany({ ...company, pan: e.target.value })} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sector">Sector</Label>
            <Input id="sector" value={company.sector ?? ""} onChange={(e) => setCompany({ ...company, sector: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fy">Financial Year</Label>
            <Input id="fy" value={company.financial_year} onChange={(e) => setCompany({ ...company, financial_year: e.target.value })} />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </form>
      </Card>
    </>
  );
}
