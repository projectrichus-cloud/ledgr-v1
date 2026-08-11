"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * "+ New Client" flow. Posts to /api/clients, which creates a company
 * row (owner_id left null until the invited owner signs up and claims
 * it) plus a ca_clients link, and — in a later iteration — sends the
 * actual invite email.
 */
export function InviteClientDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ companyName: "", ownerEmail: "", sector: "Manufacturing" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Something went wrong" }));
      toast.error(error ?? "Could not send invite");
      return;
    }

    toast.success("Invite sent — the owner will onboard by email");
    setOpen(false);
    setForm({ companyName: "", ownerEmail: "", sector: "Manufacturing" });
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">+ New Client</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a new client</DialogTitle>
          <DialogDescription>They&apos;ll get an email to create their Business Owner account.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="companyName">Company name</Label>
            <Input
              id="companyName"
              required
              placeholder="e.g. Verma Logistics"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ownerEmail">Owner email</Label>
            <Input
              id="ownerEmail"
              type="email"
              required
              placeholder="owner@company.com"
              value={form.ownerEmail}
              onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sector">Sector</Label>
            <Input
              id="sector"
              value={form.sector}
              onChange={(e) => setForm({ ...form, sector: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Invite"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
