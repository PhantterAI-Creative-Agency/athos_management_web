import { api } from "./client";

export interface PlanDTO {
  id: string;
  title: string;
  coverUrl: string;
  durationDays: number;
  themes: string[];
  rating: number;
  source: "internal" | "partner";
  createdAt: string;
}

export interface PlanProgressDTO {
  id: string;
  userId: string;
  planId: string;
  status: "saved" | "in_progress" | "completed";
  currentDay: number;
  totalDays: number;
  completedAt?: string;
  friendsAlsoCompletedIds: string[];
  updatedAt: string;
}

export interface PlanDetailDTO extends PlanDTO {
  progress: PlanProgressDTO | null;
}

export interface PlanListItemDTO extends PlanDTO {
  progress: PlanProgressDTO;
}

export function listPlans(tab?: string): Promise<PlanDetailDTO[]> {
  const params: Record<string, string> = {};
  if (tab) params.tab = tab;
  return api.get<PlanDetailDTO[]>("/plans", { params });
}

export function getPlan(id: string): Promise<PlanDetailDTO> {
  return api.get<PlanDetailDTO>(`/plans/${id}`);
}

export function upsertPlanProgress(
  planId: string,
  data: { status?: string; currentDay?: number },
): Promise<PlanProgressDTO> {
  return api.post<PlanProgressDTO>(`/plans/${planId}/progress`, data);
}
