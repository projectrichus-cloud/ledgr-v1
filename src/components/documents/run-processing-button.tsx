"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Triggers POST /api/documents/[id]/process. This is the only place in
 * the UI that knows the processing endpoint exists — the component
 * itself contains no pipeline logic, it just calls the API and reports
 * the outcome. All sequencing/validation logic lives server-side in
 * DocumentIntelligenceService.
 */
export function RunProcessingButton({ documentId, isRetry = false }: { documentId: string; isRetry?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch(`/api/documents/${documentId}/process`, { method: "POST" });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Processing failed" }));
      toast.error(error ?? "Processing failed");
      return;
    }

    toast.success("Document processed");
    router.refresh();
  }

  return (
    <Button size="sm" variant={isRetry ? "secondary" : "gold"} onClick={handleClick} disabled={loading}>
      <Sparkles className="h-3.5 w-3.5" />
      {loading ? "Processing..." : isRetry ? "Retry" : "Run Document Intelligence"}
    </Button>
  );
}
