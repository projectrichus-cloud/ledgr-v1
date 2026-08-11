"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface CurrentUser {
  fullName: string;
  email: string;
  role: "business_owner" | "ca";
  initials: string;
}

const ROLE_LABEL: Record<CurrentUser["role"], string> = {
  business_owner: "Business Owner",
  ca: "Chartered Accountant",
};

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
}

/**
 * Account menu shown in the top-right corner of every authenticated
 * screen. Self-contained: it fetches the current user client-side so
 * it can be dropped into the shared Topbar once and "just work" on
 * both the Business Owner and CA dashboards without every page having
 * to thread user data down as props.
 */
export function UserMenu() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser || !active) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("id", authUser.id)
        .single();

      if (!active) return;

      const fullName = profile?.full_name || authUser.email || "Account";
      const role = (profile?.role as CurrentUser["role"]) ?? "business_owner";

      setUser({
        fullName,
        email: authUser.email ?? "",
        role,
        initials: getInitials(fullName),
      });
    })();

    return () => {
      active = false;
    };
  }, [supabase]);

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border border-line-strong bg-paper py-1 pl-1 pr-2.5 transition-colors hover:bg-mist-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Account menu"
        >
          <Avatar className="h-7 w-7">
            <AvatarFallback className="bg-brand-500 text-[11px] text-white">
              {user ? user.initials : "…"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[120px] truncate text-[13px] font-semibold text-ink-800 sm:inline">
            {user ? user.fullName.split(" ")[0] : "Account"}
          </span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        {/* User identity header */}
        <div className="flex items-start gap-3 px-2.5 py-2.5">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-brand-500 text-white">
              {user ? user.initials : "…"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-bold text-ink-900">
              {user ? user.fullName : "Loading..."}
            </div>
            <div className="truncate text-xs text-ink-500">{user?.email}</div>
            {user && (
              <div className="mt-1 inline-flex items-center rounded-full bg-brand-100 px-2 py-0.5 text-[10.5px] font-semibold text-brand-700">
                {ROLE_LABEL[user.role]}
              </div>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onSelect={() => toast("Profile page is coming soon")}>
          <User className="mr-2 h-3.5 w-3.5 text-ink-500" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast("Settings page is coming soon")}>
          <Settings className="mr-2 h-3.5 w-3.5 text-ink-500" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onSelect={handleSignOut}
          disabled={signingOut}
          className="text-red-600 hover:!bg-red-50 focus:!bg-red-50"
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          {signingOut ? "Signing out..." : "Sign Out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
