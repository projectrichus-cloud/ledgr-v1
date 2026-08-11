import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { timeAgo } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface ActivityItem {
  id: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  message: React.ReactNode;
  createdAt: string;
}

interface ActivityTimelineProps {
  title?: string;
  items: ActivityItem[];
  viewAllHref?: string;
}

/** Shared activity feed — used on both the owner and CA dashboards, and the client profile page. */
export function ActivityTimeline({ title = "Recent Activity", items, viewAllHref }: ActivityTimelineProps) {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {viewAllHref && (
          <a href={viewAllHref} className="text-[12.5px] font-semibold text-brand-600">
            View all
          </a>
        )}
      </CardHeader>
      <div>
        {items.map((item, i) => (
          <div key={item.id} className={`flex gap-3.5 py-3.5 ${i < items.length - 1 ? "border-b border-line" : ""}`}>
            <div
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
              style={{ background: item.iconBg }}
            >
              <item.icon className="h-[15px] w-[15px]" style={{ color: item.iconColor }} />
            </div>
            <div>
              <p className="text-[13.5px] font-medium leading-snug text-ink-800">{item.message}</p>
              <div className="mt-0.5 text-xs text-ink-400">{timeAgo(item.createdAt)}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
