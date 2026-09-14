import type { DailyAccessDTO } from "@/api-client/dashboard";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function WeeklyAccessChart({ data }: { data: DailyAccessDTO[] }) {
  const totals = data.map((day) => day.authenticated + day.anonymous);
  const max = Math.max(1, ...totals);
  const weekTotal = totals.reduce((sum, value) => sum + value, 0);

  const width = 100;
  const height = 100;
  const stepX = data.length > 1 ? width / (data.length - 1) : 0;

  const points = data.map((day, index) => {
    const total = day.authenticated + day.anonymous;
    const x = data.length > 1 ? index * stepX : width / 2;
    const y = height - (total / max) * height;
    return { x, y, day };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
      : "";

  return (
    <div className="rounded-2xl bg-surface p-4">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="label-caps text-text-muted">Acessos (7 dias)</p>
          <p className="text-2xl font-semibold leading-tight">{weekTotal}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent" /> Logados
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent-warm" /> Visitantes
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-28 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="weeklyAccessFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {areaPath && <path d={areaPath} fill="url(#weeklyAccessFill)" stroke="none" />}
        <path d={linePath} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((point) => (
          <circle key={point.day.date} cx={point.x} cy={point.y} r="1.8" className="fill-background stroke-accent" strokeWidth="1.4" />
        ))}
      </svg>

      <div className="mt-2 flex justify-between text-[10px] text-text-muted">
        {data.map((day) => (
          <span key={day.date}>{WEEKDAY_LABELS[new Date(day.date).getUTCDay()]}</span>
        ))}
      </div>
    </div>
  );
}
