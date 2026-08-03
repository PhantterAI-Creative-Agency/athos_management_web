import { api } from "./client";

export interface MediaDTO {
  id: string;
  churchId: string;
  type: "video" | "photo";
  category: string;
  title: string;
  youtubeId?: string;
  url?: string;
  createdAt: string;
}

export function listMedia(): Promise<MediaDTO[]> {
  return api.get<MediaDTO[]>("/media");
}

export function getPublicMedia(slug: string): Promise<MediaDTO[]> {
  return api.get<MediaDTO[]>(`/public/churches/${slug}/media`);
}

export function getMedia(id: string): Promise<MediaDTO> {
  return api.get<MediaDTO>(`/media/${id}`);
}

export interface MediaInputDTO {
  type: "video" | "photo";
  category: string;
  title: string;
  youtubeId?: string;
  url?: string;
}

export function createMedia(data: MediaInputDTO): Promise<MediaDTO> {
  return api.post<MediaDTO>("/media", data);
}

export function updateMedia(id: string, data: Partial<MediaInputDTO>): Promise<MediaDTO> {
  return api.patch<MediaDTO>(`/media/${id}`, data);
}

export function deleteMedia(id: string): Promise<void> {
  return api.delete<void>(`/media/${id}`);
}
