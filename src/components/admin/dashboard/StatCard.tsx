type StatCardTone = "accent" | "warm";

export function StatCard({
  icon,
  label,
  value,
  tone = "accent",
  max,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: StatCardTone;
  max?: number;
}) {
  const ringColor = tone === "accent" ? "var(--accent)" : "var(--accent-warm)";
  const iconWrapClass = tone === "accent" ? "bg-accent-tint text-accent" : "bg-accent-warm-tint text-accent-warm";

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const ratio = max && max > 0 ? Math.min(1, value / max) : 1;
  const dashOffset = circumference * (1 - ratio);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl bg-surface p-4 text-center">
      <div className="relative flex h-16 w-16 flex-none items-center justify-center">
        <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
          <circle cx="20" cy="20" r={radius} fill="none" stroke="var(--divider)" strokeWidth="3" />
          <circle
            cx="20"
            cy="20"
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 500ms ease" }}
          />
        </svg>
        <span className={`flex h-9 w-9 items-center justify-center rounded-full ${iconWrapClass}`}>{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-xl font-semibold leading-tight">{value}</p>
        <p className="label-caps text-text-muted">{label}</p>
      </div>
    </div>
  );
}
