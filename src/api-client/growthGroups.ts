import { api } from "./client";

export interface GrowthGroupDTO {
  id: string;
  churchId: string;
  name: string;
  leaderId: string;
  leaderName: string;
  membersIds: string[];
  hasPendencies: boolean;
  indicators: {
    attendanceRate: number;
    lastMeetingAt?: string;
  };
  createdAt: string;
}

export function listGrowthGroups(mine?: boolean): Promise<GrowthGroupDTO[]> {
  const params: Record<string, string> = {};
  if (mine !== undefined) params.mine = String(mine);
  return api.get<GrowthGroupDTO[]>("/growth-groups", { params });
}

export function getGrowthGroup(id: string): Promise<GrowthGroupDTO> {
  return api.get<GrowthGroupDTO>(`/growth-groups/${id}`);
}

export interface GrowthGroupInputDTO {
  name: string;
  leaderId: string;
  membersIds?: string[];
  hasPendencies?: boolean;
}

export function createGrowthGroup(data: GrowthGroupInputDTO): Promise<GrowthGroupDTO> {
  return api.post<GrowthGroupDTO>("/growth-groups", data);
}

export function updateGrowthGroup(
  id: string,
  data: Partial<GrowthGroupInputDTO>,
): Promise<GrowthGroupDTO> {
  return api.patch<GrowthGroupDTO>(`/growth-groups/${id}`, data);
}

export function deleteGrowthGroup(id: string): Promise<void> {
  return api.delete<void>(`/growth-groups/${id}`);
}
