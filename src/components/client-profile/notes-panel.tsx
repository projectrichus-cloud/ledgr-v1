import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";
import type { Note } from "@/types";

export function NotesPanel({ notes, authorName }: { notes: Note[]; authorName: string }) {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
        <a href="#" className="text-[12.5px] font-semibold text-brand-600">
          + Add
        </a>
      </CardHeader>
      {notes.length === 0 ? (
        <p className="text-[12.5px] text-ink-400">No notes yet.</p>
      ) : (
        <div className="space-y-2.5">
          {notes.map((n) => (
            <div key={n.id} className="rounded-[10px] bg-mist p-3.5">
              <p className="text-[13px] leading-relaxed text-ink-700">{n.body}</p>
              <div className="mt-1.5 text-[11.5px] text-ink-400">
                {authorName} · {timeAgo(n.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
