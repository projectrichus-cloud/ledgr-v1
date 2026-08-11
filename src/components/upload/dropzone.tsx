"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ALL_DOCUMENT_TYPES, DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import type { DocumentType } from "@/types";

/**
 * Drag & drop upload zone. On drop/select:
 *  1. POSTs a row to /api/documents (status: "uploading")
 *  2. Uploads the file bytes to the "documents" Supabase Storage bucket
 *  3. PATCHes the row to "completed" (or "failed") once the upload settles
 *
 * Document type auto-detection is a placeholder here (defaults to a
 * best-guess from the filename) — real classification is the AI work
 * explicitly deferred per the brief.
 */
export function Dropzone({ companyId }: { companyId: string }) {
  const router = useRouter();
  const supabase = createClient();
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);

  const guessType = (fileName: string): DocumentType => {
    const lower = fileName.toLowerCase();
    const match = ALL_DOCUMENT_TYPES.find((t) => lower.includes(t.replace("_", "")));
    return match ?? "invoice";
  };
const handleFiles = useCallback(
  async (files: FileList) => {
    if (files.length === 0) return;

    setBusy(true);
    toast(`${files.length} file(s) added — uploading`);

    for (const file of Array.from(files)) {
      const type = guessType(file.name);

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          type,
          fileName: file.name,
          fileSizeBytes: file.size,
        }),
      });

      if (!res.ok) {
        toast.error(`Could not start upload for ${file.name}`);
        continue;
      }

      const { document } = await res.json();

      const path = `${companyId}/${document.id}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(path, file);

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);

        await fetch(`/api/documents/${document.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "failed",
          }),
        });

        toast.error(uploadError.message);
        continue;
      }

      toast.success(
        `${file.name} uploaded as ${DOCUMENT_TYPE_LABELS[type]}`
      );

      // Navigate immediately in the same browser tab.
      router.push(`/documents/${document.id}/analysis`);

      // Continue updating the document in the background.
      fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "completed",
          filePath: path,
        }),
      }).catch((error) => {
        console.error("Document status update failed:", error);
      });

      return;
    }

    setBusy(false);
  },
  [companyId, router, supabase]
);
  return (
    <div
      onClick={() => document.getElementById("file-input")?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      className={`mb-7 cursor-pointer rounded-[20px] border-2 border-dashed p-14 text-center transition-colors ${
        dragging ? "border-brand-500 bg-brand-50" : "border-line-strong bg-paper hover:border-brand-500 hover:bg-brand-50"
      }`}
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-100">
        <UploadCloud className="h-6 w-6 text-brand-600" />
      </div>
      <h3 className="mb-1.5 text-[17px] font-bold">{busy ? "Uploading..." : "Drag & drop your PDFs here"}</h3>
      <p className="mb-5 text-[13.5px] text-ink-500">or click to browse — upload as many files as you like, in any order</p>
      <div className="flex flex-wrap justify-center gap-2">
        {Object.values(DOCUMENT_TYPE_LABELS).map((label) => (
          <span key={label} className="rounded-full bg-mist-dark px-2.5 py-1 text-[11.5px] font-semibold text-ink-500">
            {label}
          </span>
        ))}
      </div>
      <input
        id="file-input"
        type="file"
        multiple
        accept="application/pdf"
        className="hidden"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
