import type { MinistryAccessDTO } from "@/api-client/dashboard";

export function MinistryAccessChart({ data }: { data: MinistryAccessDTO[] }) {
  const max = Math.max(1, ...data.map((item) => item.count));

  return (
    <div className="rounded-2xl bg-surface p-4">
      <p className="label-caps mb-3 text-text-muted">Acessos por ministério</p>

      {data.length === 0 ? (
        <p className="text-sm text-text-muted">Nenhum acesso registrado ainda.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {data.map((item) => (
            <li key={item.ministryId} className="flex items-center gap-3">
              <span className="w-24 flex-none truncate text-sm">{item.name}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-background">
                <span
                  className="block h-full rounded-full bg-accent"
                  style={{ width: `${Math.max(4, (item.count / max) * 100)}%` }}
                />
              </span>
              <span className="w-8 flex-none text-right text-sm text-text-muted">{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
