"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "@/api-client/dashboard";
import { StatCard } from "@/components/admin/dashboard/StatCard";
import { WeeklyAccessChart } from "@/components/admin/dashboard/WeeklyAccessChart";
import { MinistryAccessChart } from "@/components/admin/dashboard/MinistryAccessChart";
import { CalendarIcon, ChatIcon, HeartIcon, UsersIcon } from "@/components/icons";

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: getDashboardSummary,
  });

  if (isLoading || !data) {
    return <p className="text-sm text-text-muted">Carregando...</p>;
  }

  const { counts, accessesByDay, accessesByMinistry } = data;
  const maxCount = Math.max(
    counts.upcomingEvents,
    counts.ministries,
    counts.growthGroups,
    counts.pendingPastoralCareRequests,
    counts.activeUsers
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-1 text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-text-muted">Visão geral da igreja</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={<CalendarIcon className="text-xl" />} label="Eventos" value={counts.upcomingEvents} tone="accent" max={maxCount} />
        <StatCard icon={<UsersIcon className="text-xl" />} label="Ministérios" value={counts.ministries} tone="warm" max={maxCount} />
        <StatCard icon={<HeartIcon className="text-xl" />} label="Grupos" value={counts.growthGroups} tone="accent" max={maxCount} />
        <StatCard
          icon={<ChatIcon className="text-xl" />}
          label="Pedidos pastorais"
          value={counts.pendingPastoralCareRequests}
          tone="warm"
          max={maxCount}
        />
        <StatCard icon={<UsersIcon className="text-xl" />} label="Membros ativos" value={counts.activeUsers} tone="accent" max={maxCount} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WeeklyAccessChart data={accessesByDay} />
        </div>
        <MinistryAccessChart data={accessesByMinistry} />
      </div>
    </div>
  );
}
