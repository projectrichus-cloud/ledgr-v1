import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScoreRing } from "@/components/shared/score-ring";

interface ScoreCardsProps {
  complianceScore: number;
  riskLabel: string;
  riskScoreValue: number; // 0-100, used to color/position the ring
  docsCompleted: number;
  docsTotal: number;
  caName: string;
  caInitials: string;
}

export function ScoreCards({ complianceScore, riskLabel, riskScoreValue, docsCompleted, docsTotal, caName, caInitials }: ScoreCardsProps) {
  return (
    <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Card className="p-5">
        <div className="mb-2.5 text-[12.5px] font-semibold text-ink-500">Compliance Score</div>
        <ScoreRing value={complianceScore} size={52} strokeWidth={6} color="#0E9F6E" label={String(complianceScore)} sublabel="Good standing" />
      </Card>
      <Card className="p-5">
        <div className="mb-2.5 text-[12.5px] font-semibold text-ink-500">Risk Score</div>
        <ScoreRing value={riskScoreValue} size={52} strokeWidth={6} color="#D97706" label={riskLabel} sublabel="Open findings" />
      </Card>
      <Card className="p-5">
        <div className="mb-2.5 text-[12.5px] font-semibold text-ink-500">Documents</div>
        <div>
          <div className="font-mono text-2xl font-semibold">
            {docsCompleted}
            <span className="text-sm text-ink-400">/{docsTotal}</span>
          </div>
          <div className="text-xs text-ink-500">{docsTotal - docsCompleted} still missing</div>
        </div>
      </Card>
      <Card className="p-5">
        <div className="mb-2.5 text-[12.5px] font-semibold text-ink-500">Assigned CA</div>
        <div className="flex items-center gap-2.5">
          <Avatar className="h-[38px] w-[38px]">
            <AvatarFallback className="bg-brand-500 text-white">{caInitials}</AvatarFallback>
          </Avatar>
          <div className="text-[15px] font-semibold">{caName}</div>
        </div>
      </Card>
    </div>
  );
}
