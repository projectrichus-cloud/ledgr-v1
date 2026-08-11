interface ScoreRingProps {
  /** 0-100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string; // any valid CSS color, matched to the design tokens by the caller
  label?: string;
  sublabel?: string;
}

/**
 * Reusable SVG donut used for Compliance Score, Risk Score, Financial
 * Health, and AI Confidence throughout the dashboard, client profile,
 * and findings pages — one implementation, different colors/values.
 */
export function ScoreRing({ value, size = 64, strokeWidth = 8, color = "#2A5CA0", label, sublabel }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F0F2F6" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      {(label || sublabel) && (
        <div>
          {label && <div className="font-mono text-xl font-semibold">{label}</div>}
          {sublabel && <div className="text-xs text-ink-500">{sublabel}</div>}
        </div>
      )}
    </div>
  );
}
