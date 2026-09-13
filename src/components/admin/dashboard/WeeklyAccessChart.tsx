import type { DailyAccessDTO } from "@/api-client/dashboard";

const WEEKDAY_LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function WeeklyAccessChart({ data }: { data: DailyAccessDTO[] }) {
  const max = Math.max(1, ...data.map((day) => day.authenticated + day.anonymous));
  const chartHeight = 120;
  const barGroupWidth = 100 / Math.max(1, data.length);

  return (
    <div className="rounded-2xl bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="label-caps text-text-muted">Acessos (7 dias)</p>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent" /> Logados
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-accent-warm" /> Visitantes
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 100 ${chartHeight + 16}`} className="w-full" preserveAspectRatio="none">
        {data.map((day, index) => {
          const loggedHeight = (day.authenticated / max) * chartHeight;
          const anonHeight = (day.anonymous / max) * chartHeight;
          const groupX = index * barGroupWidth;
          const barWidth = barGroupWidth * 0.28;
          const gap = barGroupWidth * 0.06;
          const loggedX = groupX + barGroupWidth / 2 - barWidth - gap / 2;
          const anonX = groupX + barGroupWidth / 2 + gap / 2;

          return (
            <g key={day.date}>
              <rect
                x={loggedX}
                y={chartHeight - loggedHeight}
                width={barWidth}
                height={loggedHeight}
                rx={1.2}
                className="fill-accent"
              />
              <rect
                x={anonX}
                y={chartHeight - anonHeight}
                width={barWidth}
                height={anonHeight}
                rx={1.2}
                className="fill-accent-warm"
              />
              <text
                x={groupX + barGroupWidth / 2}
                y={chartHeight + 11}
                textAnchor="middle"
                fontSize="5.5"
                className="fill-text-muted"
              >
                {WEEKDAY_LABELS[new Date(day.date).getUTCDay()]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
