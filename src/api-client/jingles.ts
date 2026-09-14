import { api } from "./client";

export interface JingleDTO {
  id: string;
  churchId: string;
  title: string;
  url: string;
  active: boolean;
  order: number;
  createdAt: string;
}

export function listJingles(): Promise<JingleDTO[]> {
  return api.get<JingleDTO[]>("/jingles");
}

export function getPublicJingles(slug: string): Promise<JingleDTO[]> {
  return api.get<JingleDTO[]>(`/public/churches/${slug}/jingles`);
}

export function getJingle(id: string): Promise<JingleDTO> {
  return api.get<JingleDTO>(`/jingles/${id}`);
}

export interface JingleInputDTO {
  title: string;
  url: string;
  active?: boolean;
  order?: number;
}

export function createJingle(data: JingleInputDTO): Promise<JingleDTO> {
  return api.post<JingleDTO>("/jingles", data);
}

export function updateJingle(id: string, data: Partial<JingleInputDTO>): Promise<JingleDTO> {
  return api.patch<JingleDTO>(`/jingles/${id}`, data);
}

export function deleteJingle(id: string): Promise<void> {
  return api.delete<void>(`/jingles/${id}`);
}
