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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-1 text-2xl font-semibold">Dashboard</h2>
        <p className="text-sm text-text-muted">Visão geral da igreja</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatCard icon={<CalendarIcon className="h-5 w-5" />} label="Eventos" value={counts.upcomingEvents} tone="accent" />
        <StatCard icon={<UsersIcon className="h-5 w-5" />} label="Ministérios" value={counts.ministries} tone="warm" />
        <StatCard icon={<HeartIcon className="h-5 w-5" />} label="Grupos" value={counts.growthGroups} tone="accent" />
        <StatCard
          icon={<ChatIcon className="h-5 w-5" />}
          label="Pedidos pastorais"
          value={counts.pendingPastoralCareRequests}
          tone="warm"
        />
        <StatCard icon={<UsersIcon className="h-5 w-5" />} label="Membros ativos" value={counts.activeUsers} tone="accent" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WeeklyAccessChart data={accessesByDay} />
        <MinistryAccessChart data={accessesByMinistry} />
      </div>
    </div>
  );
}
