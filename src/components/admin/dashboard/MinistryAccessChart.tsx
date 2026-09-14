import type { MinistryAccessDTO } from "@/api-client/dashboard";

const PALETTE = ["var(--accent)", "var(--accent-warm)"];

export function MinistryAccessChart({ data }: { data: MinistryAccessDTO[] }) {
  const max = Math.max(1, ...data.map((item) => item.count));

  return (
    <div className="rounded-2xl bg-surface p-4">
      <p className="label-caps mb-4 text-text-muted">Acessos por ministério</p>

      {data.length === 0 ? (
        <p className="text-sm text-text-muted">Nenhum acesso registrado ainda.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {data.map((item, index) => {
            const color = PALETTE[index % PALETTE.length];
            return (
              <li key={item.ministryId} className="flex items-center gap-3">
                <span className="w-24 flex-none truncate text-sm">{item.name}</span>
                <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-background">
                  <span
                    className="block h-full rounded-full transition-[width] duration-500"
                    style={{ width: `${Math.max(4, (item.count / max) * 100)}%`, backgroundColor: color }}
                  />
                </span>
                <span className="w-8 flex-none text-right text-sm font-medium text-text-muted">{item.count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
