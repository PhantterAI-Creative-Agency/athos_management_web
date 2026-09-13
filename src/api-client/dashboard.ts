import { api } from "./client";

export interface DashboardCountsDTO {
  upcomingEvents: number;
  ministries: number;
  growthGroups: number;
  pendingPastoralCareRequests: number;
  activeUsers: number;
}

export interface DailyAccessDTO {
  date: string;
  authenticated: number;
  anonymous: number;
}

export interface MinistryAccessDTO {
  ministryId: string;
  name: string;
  count: number;
}

export interface DashboardSummaryDTO {
  counts: DashboardCountsDTO;
  accessesByDay: DailyAccessDTO[];
  accessesByMinistry: MinistryAccessDTO[];
}

export function getDashboardSummary(): Promise<DashboardSummaryDTO> {
  return api.get<DashboardSummaryDTO>("/dashboard/summary");
}
