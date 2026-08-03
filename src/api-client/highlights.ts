import { api } from "./client";

export interface HighlightDTO {
  id: string;
  userId: string;
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  version: string;
  text: string;
  likesCount: number;
  visibility: "public" | "friends";
  liked: boolean;
  createdAt: string;
}

export interface ToggleHighlightLikeDTO {
  liked: boolean;
  likesCount: number;
}

export function listHighlights(params?: {
  userId?: string;
  visibility?: string;
}): Promise<HighlightDTO[]> {
  const query: Record<string, string> = {};
  if (params?.userId) query.userId = params.userId;
  if (params?.visibility) query.visibility = params.visibility;
  return api.get<HighlightDTO[]>("/highlights", { params: query });
}

export function createHighlight(data: {
  book: string;
  chapter: number;
  verseStart: number;
  verseEnd?: number;
  version: string;
  text: string;
  visibility?: "public" | "friends";
}): Promise<HighlightDTO> {
  return api.post<HighlightDTO>("/highlights", data);
}

export function deleteHighlight(id: string): Promise<void> {
  return api.delete<void>(`/highlights/${id}`);
}

export function toggleHighlightLike(id: string): Promise<ToggleHighlightLikeDTO> {
  return api.post<ToggleHighlightLikeDTO>(`/highlights/${id}/like`);
}
