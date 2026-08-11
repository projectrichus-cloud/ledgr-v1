import { FileText, Lock } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Report } from "@/types";

export function ReportsList({ reports }: { reports: Report[] }) {
  if (reports.length === 0) {
    return (
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Reports</CardTitle>
        </CardHeader>
        <p className="text-[12.5px] text-ink-400">No reports have been approved by your CA yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <div className="space-y-2.5">
        {reports.map((r) => {
          const approved = r.status === "approved";
          return (
            <div
              key={r.id}
              className={`flex items-center gap-3 rounded-xl border p-3.5 ${
                approved ? "border-line" : "border-dashed border-line bg-mist"
              }`}
            >
              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] ${approved ? "bg-green-100" : "bg-ink-100"}`}>
                {approved ? <FileText className="h-4 w-4 text-green-700" /> : <Lock className="h-4 w-4 text-ink-400" />}
              </div>
              <div>
                <div className="text-[13.5px] font-semibold">{r.title}</div>
                <div className="mt-0.5 text-xs text-ink-400">
                  {approved && r.approved_at ? `Approved ${formatDate(r.approved_at)}` : "Awaiting your CA's approval"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
