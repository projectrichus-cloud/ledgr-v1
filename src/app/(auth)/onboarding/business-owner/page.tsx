"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * First-run setup for a Business Owner: create their company profile
 * (companies table). A CA later links to this company via ca_clients
 * when they invite the owner, or the owner can be linked to a CA by
 * accepting an invite email (see /api/clients route).
 */
export default function BusinessOwnerOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [form, setForm] = useState({
    name: "",
    gstin: "",
    pan: "",
    sector: "",
    financial_year: "2025-26",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session expired — please sign in again.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("companies").insert({
      owner_id: user.id,
      ...form,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/owner/dashboard");
  }

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-semibold">Tell us about your company</h1>
      <p className="mb-6 text-sm text-ink-500">This creates your company profile — you can edit it anytime.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Company name</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="gstin">GSTIN</Label>
            <Input id="gstin" value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pan">PAN</Label>
            <Input id="pan" value={form.pan} onChange={(e) => setForm({ ...form, pan: e.target.value })} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sector">Sector</Label>
          <Input
            id="sector"
            placeholder="e.g. Textiles & Manufacturing"
            value={form.sector}
            onChange={(e) => setForm({ ...form, sector: e.target.value })}
          />
        </div>

        {error && <p className="text-[13px] text-red-600">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Setting up..." : "Continue to dashboard"}
        </Button>
      </form>
    </>
  );
}
