"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { ClientRow } from "@/components/ca/client-row";
import type { CaClient } from "@/types";

interface ClientWithMeta {
  client: CaClient;
  docsCompleted: number;
  docsTotal: number;
  lastActivityAt: string;
  avatarColor: string;
}

/**
 * Client list with search + status/risk filters, per the original
 * dashboard requirements. Filtering happens client-side over data
 * fetched server-side (see app/(app)/ca/dashboard/page.tsx) — swap in
 * server-side filtering later if the client list grows very large.
 */
export function ClientList({ clients, viewAllHref }: { clients: ClientWithMeta[]; viewAllHref?: string }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");

  const filtered = useMemo(() => {
    return clients.filter(({ client }) => {
      const matchesQuery = client.company?.name?.toLowerCase().includes(query.toLowerCase()) ?? true;
      const matchesStatus = statusFilter === "all" || client.status === statusFilter;
      const matchesRisk = riskFilter === "all" || client.risk_level === riskFilter;
      return matchesQuery && matchesStatus && matchesRisk;
    });
  }, [clients, query, statusFilter, riskFilter]);

  return (
    <Card className="mb-5 p-6">
      <CardHeader className="flex-wrap gap-3">
        <CardTitle>Your Clients</CardTitle>
        <div className="flex gap-2">
          <Input
            placeholder="Search clients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-[38px] w-40 text-[12.5px]"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="action_needed">Action needed</SelectItem>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="onboarding">Onboarding</SelectItem>
            </SelectContent>
          </Select>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All risk levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All risk levels</SelectItem>
              <SelectItem value="high">High risk</SelectItem>
              <SelectItem value="medium">Medium risk</SelectItem>
              <SelectItem value="low">Low risk</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      {filtered.length === 0 ? (
        <div className="py-10 text-center text-sm text-ink-400">No clients match your filters.</div>
      ) : (
        filtered.map((c) => (
          <ClientRow
            key={c.client.id}
            client={c.client}
            docsCompleted={c.docsCompleted}
            docsTotal={c.docsTotal}
            lastActivityAt={c.lastActivityAt}
            avatarColor={c.avatarColor}
          />
        ))
      )}

      {viewAllHref && (
        <div className="pt-3.5 text-center">
          <a href={viewAllHref} className="text-[12.5px] font-semibold text-brand-600">
            View all clients →
          </a>
        </div>
      )}
    </Card>
  );
}
