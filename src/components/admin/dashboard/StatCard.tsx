type StatCardTone = "accent" | "warm";

export function StatCard({
  icon,
  label,
  value,
  tone = "accent",
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone?: StatCardTone;
}) {
  const iconWrapClass = tone === "accent" ? "bg-accent-tint text-accent" : "bg-accent-warm-tint text-accent-warm";
  const underlineClass = tone === "accent" ? "bg-accent" : "bg-accent-warm";

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
      <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-full ${iconWrapClass}`}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="label-caps text-text-muted">{label}</p>
        <p className="text-2xl font-semibold leading-tight">{value}</p>
        <span className={`mt-1 block h-1 w-8 rounded-full ${underlineClass}`} />
      </div>
    </div>
  );
}
