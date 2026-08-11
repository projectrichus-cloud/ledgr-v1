import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar, type SidebarNavItem } from "@/components/layout/sidebar";

const OWNER_NAV: SidebarNavItem[] = [
  { label: "Dashboard", href: "/owner/dashboard", icon: "dashboard" },
  { label: "My Documents", href: "/owner/documents", icon: "documents" },
  { label: "Reports", href: "/owner/reports", icon: "reports" },
  { label: "Company Profile", href: "/owner/company", icon: "company" },
];

const CA_NAV: SidebarNavItem[] = [
  { label: "Dashboard", href: "/ca/dashboard", icon: "dashboard" },
  { label: "Clients", href: "/ca/clients", icon: "clients" },
  { label: "Documents", href: "/upload", icon: "documents" },
  { label: "AI Findings", href: "/ca/findings", icon: "findings" },
  { label: "Reports", href: "/ca/reports", icon: "reports" },
];

/**
 * Shared shell for every authenticated route (both /owner/* and /ca/*).
 * This is a Server Component: it reads the logged-in user's profile
 * once per request and decides which sidebar to show — no client-side
 * role check needed, and it fails closed (redirects to /login) if the
 * session is missing, as a second line of defense behind middleware.ts.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const profileData = profile as any;

const role = profileData?.role ?? "business_owner";

const fullName = profileData?.full_name || user.email || "there";

const initials = fullName
  .split(" ")
  .map((p: string) => p[0])
  .slice(0, 2)
  .join("")
  .toUpperCase();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        navItems={role === "ca" ? CA_NAV : OWNER_NAV}
        user={{
          name: fullName,
          role: role === "ca" ? "Chartered Accountant" : "Business Owner",
          initials: initials || "U",
        }}
      />
      <main className="flex-1 px-6 py-7 md:px-8">{children}</main>
    </div>
  );
}
