import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KpiCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  label: string;
  value: React.ReactNode;
  delta?: string;
  deltaColor?: string;
}

/** The KPI summary cards used at the top of every dashboard (owner + CA). */
export function KpiCard({ icon: Icon, iconBg, iconColor, label, value, delta, deltaColor = "text-ink-400" }: KpiCardProps) {
  return (
    <Card className="p-5">
      <div
        className="mb-3.5 flex h-[34px] w-[34px] items-center justify-center rounded-[9px]"
        style={{ background: iconBg }}
      >
        <Icon className="h-4 w-4" style={{ color: iconColor }} />
      </div>
      <div className="mb-1.5 text-[12.5px] font-semibold text-ink-500">{label}</div>
      <div className="font-mono text-[28px] font-semibold tracking-tight">{value}</div>
      {delta && <div className={cn("mt-1.5 text-xs font-semibold", deltaColor)}>{delta}</div>}
    </Card>
  );
}
