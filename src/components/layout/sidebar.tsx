"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Sparkles,
  ClipboardList,
  Settings,
  Building2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface SidebarNavItem {
  label: string;
  href: string;
  icon: keyof typeof ICONS;
  count?: number;
  countTone?: "default" | "warn";
}

const ICONS = {
  dashboard: LayoutDashboard,
  clients: Users,
  documents: FileText,
  findings: Sparkles,
  reports: ClipboardList,
  settings: Settings,
  company: Building2,
};

interface SidebarProps {
  navItems: SidebarNavItem[];
  user: { name: string; role: string; initials: string };
}

/**
 * Shared sidebar shell. Both /owner and /ca layouts pass in their own
 * nav items, so this one component renders both roles' distinct
 * navigation without duplicating the shell markup. Active state is
 * derived from the current route via usePathname().
 */
export function Sidebar({ navItems, user }: SidebarProps) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 hidden h-screen w-[240px] flex-col bg-ink-950 p-3.5 text-white md:flex">
      <Link href="/" className="mb-2 flex items-center gap-2.5 px-2.5 py-1.5 font-display text-lg font-semibold">
        <span className="relative h-6 w-6 flex-shrink-0 rounded-md bg-white">
          <span className="absolute left-1.5 right-1.5 top-2 h-0.5 rounded bg-gold-500" />
        </span>
        Ledgr
      </Link>

      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = ICONS[item.icon];
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-semibold text-ink-300 transition-colors hover:bg-white/5 hover:text-white",
                active && "bg-white/[0.09] text-white"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {item.label}
              {typeof item.count === "number" && (
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold",
                    item.countTone === "warn" ? "bg-red-600 text-white" : "bg-white/10"
                  )}
                >
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex items-center gap-2.5 border-t border-white/[0.08] px-2.5 pt-4">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-brand-500 text-white">{user.initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="text-[13px] font-semibold text-white">{user.name}</div>
          <div className="text-[11.5px] text-ink-400">{user.role}</div>
        </div>
      </div>
    </aside>
  );
}
