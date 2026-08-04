"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/ui/AppShell";
import { CoverImage } from "@/components/ui/CoverImage";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { listUsers } from "@/api-client/users";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function getMonthFromId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
  }
  return Math.abs(hash) % 12;
}

function AniversariantesContent() {
  const { user } = useAuth();
  const currentMonth = new Date().getMonth();

  const { data: users } = useQuery({
    queryKey: ["users", "church"],
    queryFn: () => listUsers(),
    enabled: !!user?.churchId,
  });

  const grouped = useMemo(() => {
    const map: Record<string, NonNullable<typeof users>> = {};
    if (!users) return map;
    for (const u of users) {
      if (u.id === user?.id) continue;
      const month = MONTHS[getMonthFromId(u.id)];
      if (!map[month]) map[month] = [];
      map[month].push(u);
    }
    return map;
  }, [users, user?.id]);

  const currentMonthName = MONTHS[currentMonth];
  const currentMonthUsers = grouped[currentMonthName] || [];
  const otherMonths = Object.entries(grouped).filter(([m]) => m !== currentMonthName);

  return (
    <div className="mx-auto max-w-3xl px-5 pb-10 pt-6 md:max-w-5xl md:px-12 md:py-10">
      <h2 className="mb-1 text-2xl font-semibold">Aniversariantes</h2>
      <p className="mb-5 text-sm text-text-muted">Celebre com seus irmãos</p>

      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-accent">
        {currentMonthName}
      </h3>
      <div className="mb-8 flex flex-col gap-3">
        {currentMonthUsers.length === 0 && (
          <p className="text-sm text-text-muted">Nenhum aniversariante este mês</p>
        )}
        {currentMonthUsers.map((u) => (
          <div key={u.id} className="flex items-center gap-3">
            <CoverImage label={u.name} seed={`user-${u.id}`} className="h-12 w-12 flex-none rounded-full" />
            <div>
              <p className="text-sm font-semibold">{u.name}</p>
            </div>
          </div>
        ))}
      </div>

      {otherMonths.map(([month, monthUsers]) => {
        if (!monthUsers) return null;
        return (
          <div key={month} className="mb-6">
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-text-muted">
              {month}
            </h3>
            <div className="flex flex-col gap-2">
              {monthUsers.map((u) => (
                <div key={u.id} className="flex items-center gap-3">
                  <CoverImage label={u.name} seed={`user-${u.id}`} className="h-10 w-10 flex-none rounded-full" />
                  <p className="text-sm">{u.name}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AniversariantesPage() {
  return (
    <AuthGuard>
      <AppShell active="/aniversariantes">
        <AniversariantesContent />
      </AppShell>
    </AuthGuard>
  );
}
