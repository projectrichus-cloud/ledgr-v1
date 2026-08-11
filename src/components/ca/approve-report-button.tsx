"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

/**
 * Flips a report to "approved" via PATCH /api/reports/[id] — the gate
 * that makes it visible to the business owner (see that route for the
 * server-side enforcement; this button is just the trigger).
 */
export function ApproveReportButton({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleApprove() {
    setLoading(true);
    const res = await fetch(`/api/reports/${reportId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    setLoading(false);

    if (!res.ok) {
      toast.error("Could not approve report");
      return;
    }

    toast.success("Report approved — the client can now view it");
    router.refresh();
  }

  return (
    <Button size="sm" onClick={handleApprove} disabled={loading}>
      {loading ? "Approving..." : "Approve"}
    </Button>
  );
}
