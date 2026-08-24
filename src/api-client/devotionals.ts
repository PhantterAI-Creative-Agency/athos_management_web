import { api } from "./client";

export interface DevotionalDTO {
  id: string;
  churchId: string;
  title: string;
  content: string;
  publishedAt: string;
  createdAt: string;
  imageUrl?: string;
}

export function listDevotionals(): Promise<DevotionalDTO[]> {
  return api.get<DevotionalDTO[]>("/devotionals");
}

export function getPublicDevotionals(slug: string): Promise<DevotionalDTO[]> {
  return api.get<DevotionalDTO[]>(`/public/churches/${slug}/devotionals`);
}

export function getDevotional(id: string): Promise<DevotionalDTO> {
  return api.get<DevotionalDTO>(`/devotionals/${id}`);
}

export interface DevotionalInputDTO {
  title: string;
  content: string;
  publishedAt?: string;
  imageUrl?: string;
}

export function createDevotional(data: DevotionalInputDTO): Promise<DevotionalDTO> {
  return api.post<DevotionalDTO>("/devotionals", data);
}

export function updateDevotional(
  id: string,
  data: Partial<DevotionalInputDTO>,
): Promise<DevotionalDTO> {
  return api.patch<DevotionalDTO>(`/devotionals/${id}`, data);
}

export function deleteDevotional(id: string): Promise<void> {
  return api.delete<void>(`/devotionals/${id}`);
}
