import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TaskItem {
  id: string;
  label: string;
  meta: string;
  done?: boolean;
}

export function TasksPanel({ tasks }: { tasks: TaskItem[] }) {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
        <a href="#" className="text-[12.5px] font-semibold text-brand-600">
          Add task
        </a>
      </CardHeader>
      <div>
        {tasks.length === 0 ? (
          <p className="text-[12.5px] text-ink-400">No tasks right now.</p>
        ) : (
          tasks.map((t, i) => (
          <div key={t.id} className={`flex items-start gap-2.5 py-2.5 ${i < tasks.length - 1 ? "border-b border-line" : ""}`}>
            <div
              className={cn(
                "mt-0.5 h-[18px] w-[18px] flex-shrink-0 rounded-[5px] border-[1.5px]",
                t.done ? "border-ink-900 bg-ink-900" : "border-line-strong"
              )}
            />
            <div>
              <div className={cn("text-[13.5px] font-medium", t.done && "text-ink-400 line-through")}>{t.label}</div>
              <div className="mt-0.5 text-[11.5px] text-ink-400">{t.meta}</div>
            </div>
          </div>
          ))
        )}
      </div>
    </Card>
  );
}
