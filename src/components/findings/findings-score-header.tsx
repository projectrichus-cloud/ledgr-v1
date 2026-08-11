import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/shared/score-ring";

interface ScoreItem {
  value: number; // 0-100, drives the ring fill
  label: string;
  sublabel: string;
  color: string;
}

export function FindingsScoreHeader({ scores }: { scores: ScoreItem[] }) {
  return (
    <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {scores.map((s) => (
        <Card key={s.sublabel} className="flex flex-col items-center p-5 text-center">
          <ScoreRing value={s.value} size={64} strokeWidth={7} color={s.color} />
          <div className="mt-2.5 font-mono text-[19px] font-semibold">{s.label}</div>
          <div className="mt-0.5 text-xs font-semibold text-ink-500">{s.sublabel}</div>
        </Card>
      ))}
    </div>
  );
}
