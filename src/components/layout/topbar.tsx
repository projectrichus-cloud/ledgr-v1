import { Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/layout/user-menu";

interface TopbarProps {
  title: string;
  subtitle: string;
  search?: boolean;
  action?: { label: string; onClickId?: string };
  children?: React.ReactNode; // slot for a page-specific action (e.g. Invite dialog trigger)
}

export function Topbar({ title, subtitle, search = true, children }: TopbarProps) {
  return (
    <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-[26px] font-semibold">{title}</h1>
        <div className="mt-0.5 text-[13.5px] text-ink-500">{subtitle}</div>
      </div>
      <div className="flex items-center gap-2.5">
        {search && (
          <Input placeholder="Search clients, documents..." className="w-[240px] hidden sm:flex" />
        )}
        <Button variant="secondary" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border-2 border-paper bg-red-600" />
        </Button>
        {children}
        <UserMenu />
      </div>
    </div>
  );
}
