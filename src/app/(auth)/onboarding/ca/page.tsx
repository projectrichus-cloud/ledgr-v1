"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * First-run setup for a Chartered Accountant. Unlike the business owner
 * flow, there's no separate "firm" table yet in this foundation — the
 * profile row (full_name, role) created at signup is enough to start.
 * This screen collects a couple of extra practice details up front so
 * the pattern is easy to extend (e.g. firm name, ICAI membership no.)
 * once you're ready to add those columns.
 */
export default function CaOnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [firmName, setFirmName] = useState("");
  const [membershipNo, setMembershipNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // For now this just confirms the profile exists; extend `profiles`
    // with firm_name / membership_no columns when you're ready to
    // persist these fields.
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Your session expired — please sign in again.");
      setLoading(false);
      return;
    }

    router.push("/ca/dashboard");
  }

  return (
    <>
      <h1 className="mb-1 font-display text-2xl font-semibold">Set up your practice</h1>
      <p className="mb-6 text-sm text-ink-500">A couple of details before you start inviting clients.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="firmName">Firm name</Label>
          <Input
            id="firmName"
            placeholder="e.g. Mehta & Associates"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="membershipNo">ICAI membership number</Label>
          <Input
            id="membershipNo"
            placeholder="Optional"
            value={membershipNo}
            onChange={(e) => setMembershipNo(e.target.value)}
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
