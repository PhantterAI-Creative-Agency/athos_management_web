import { api } from "./client";

export interface MinistryDTO {
  id: string;
  churchId: string;
  name: string;
  iconUrl?: string;
  contractRequired: boolean;
  participantsCount: number;
  isVolunteer: boolean;
  leaderId?: string;
  leaderName?: string;
  createdAt: string;
}

export interface MinistryVolunteerDTO {
  id: string;
  ministryId: string;
  userId: string;
  role?: string;
  contractSigned: boolean;
  active: boolean;
  joinedAt: string;
}

export function listMinistries(highlightUserId?: string): Promise<MinistryDTO[]> {
  const params: Record<string, string> = {};
  if (highlightUserId) params.highlightUserId = highlightUserId;
  return api.get<MinistryDTO[]>("/ministries", { params });
}

export function getPublicMinistries(slug: string): Promise<MinistryDTO[]> {
  return api.get<MinistryDTO[]>(`/public/churches/${slug}/ministries`);
}

export function getMinistry(id: string): Promise<MinistryDTO> {
  return api.get<MinistryDTO>(`/ministries/${id}`);
}

export interface MinistryInputDTO {
  name: string;
  iconUrl?: string;
  contractRequired?: boolean;
  leaderId?: string | null;
}

export function createMinistry(data: MinistryInputDTO): Promise<MinistryDTO> {
  return api.post<MinistryDTO>("/ministries", data);
}

export function updateMinistry(id: string, data: Partial<MinistryInputDTO>): Promise<MinistryDTO> {
  return api.patch<MinistryDTO>(`/ministries/${id}`, data);
}

export function deleteMinistry(id: string): Promise<void> {
  return api.delete<void>(`/ministries/${id}`);
}

export function addVolunteer(
  ministryId: string,
  data?: { userId?: string; role?: string },
): Promise<MinistryVolunteerDTO> {
  return api.post<MinistryVolunteerDTO>(`/ministries/${ministryId}/volunteers`, data);
}

export function listMinistryVolunteers(ministryId: string): Promise<MinistryVolunteerDTO[]> {
  return api.get<MinistryVolunteerDTO[]>(`/ministries/${ministryId}/volunteers`);
}

export interface ServiceFunctionDTO {
  id: string;
  name: string;
  order: number;
}

export function getServiceFunctions(ministryId: string): Promise<ServiceFunctionDTO[]> {
  return api.get<ServiceFunctionDTO[]>(`/ministries/${ministryId}/service-functions`);
}

export function replaceServiceFunctions(
  ministryId: string,
  functions: { id?: string; name: string }[],
): Promise<ServiceFunctionDTO[]> {
  return api.put<ServiceFunctionDTO[]>(`/ministries/${ministryId}/service-functions`, { functions });
}
