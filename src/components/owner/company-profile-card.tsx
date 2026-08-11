import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import type { Company } from "@/types";

export function CompanyProfileCard({ company, editHref = "/owner/company" }: { company: Company; editHref?: string }) {
  const rows: [string, string][] = [
    ["Company", company.name],
    ["GSTIN", company.gstin || "—"],
    ["PAN", company.pan || "—"],
    ["Sector", company.sector || "—"],
    ["Financial Year", company.financial_year],
  ];

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle>Company Profile</CardTitle>
        <Link href={editHref} className="text-[12.5px] font-semibold text-brand-600">
          Edit
        </Link>
      </CardHeader>
      <div>
        {rows.map(([label, value], i) => (
          <div key={label} className={`flex justify-between py-2 text-[13px] ${i < rows.length - 1 ? "border-b border-line" : ""}`}>
            <span className="text-ink-500">{label}</span>
            <span className="font-semibold text-ink-800">{value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
