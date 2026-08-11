import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * PATCH /api/reports/[id]
 * Body: { status: "pending_approval" | "approved" }
 *
 * This is the "Approve reports before clients can view them" gate from
 * the requirements — only a CA can flip status to "approved", and only
 * then does GET /api/reports (see route.ts) let the business owner see it.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "ca") {
    return NextResponse.json({ error: "Only the assigned chartered accountant can approve a report" }, { status: 403 });
  }

  const body = await request.json();
  const { status } = body as { status: "pending_approval" | "approved" };

  const { data, error } = await supabase
    .from("reports")
    .update({
      status,
      ...(status === "approved" && { approved_at: new Date().toISOString() }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (status === "approved" && data) {
    await supabase.from("activity_log").insert({
      company_id: data.company_id,
      actor_id: user.id,
      action: "report_approved",
      message: `Approved "${data.title}"`,
    });
  }

  return NextResponse.json({ report: data });
}
