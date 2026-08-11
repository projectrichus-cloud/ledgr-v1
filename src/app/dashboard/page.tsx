import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Single, stable post-login destination. Both the login form and
 * middleware.ts send users here, and this route sends them onward to
 * their role-specific dashboard. Keeping one neutral URL means we can
 * change /owner or /ca's structure later without breaking login links.
 */
export default async function DashboardRedirectPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(profile?.role === "ca" ? "/ca/dashboard" : "/owner/dashboard");
}
