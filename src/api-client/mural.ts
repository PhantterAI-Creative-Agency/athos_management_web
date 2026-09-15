import { api } from "./client";

export type MuralFriendshipRelationStatus = "none" | "pending_sent" | "pending_received" | "accepted";

export interface MuralPostDTO {
  id: string;
  churchId: string;
  authorType: "user" | "church";
  authorId: string;
  authorName?: string;
  authorPhotoUrl?: string;
  content: string;
  audience: "all" | "ministry" | "growthGroup";
  audienceRefId?: string;
  visibility: "public" | "private";
  likesCount: number;
  commentsCount: number;
  liked: boolean;
  viewerFollowsAuthor?: boolean;
  viewerFriendshipStatus?: MuralFriendshipRelationStatus;
  createdAt: string;
}

export interface MuralFeedDTO {
  items: MuralPostDTO[];
  nextCursor?: string;
}

export interface ToggleMuralLikeDTO {
  liked: boolean;
  likesCount: number;
}

export function listMural(cursor?: string, limit?: number): Promise<MuralFeedDTO> {
  const params: Record<string, string> = {};
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = String(limit);
  return api.get<MuralFeedDTO>("/mural", { params });
}

export function createMuralPost(data: {
  content: string;
  authorType?: "user" | "church";
  audience?: "all" | "ministry" | "growthGroup";
  audienceRefId?: string;
  visibility?: "public" | "private";
}): Promise<MuralPostDTO> {
  return api.post<MuralPostDTO>("/mural", data);
}

export function deleteMuralPost(id: string): Promise<void> {
  return api.delete<void>(`/mural/${id}`);
}

export function toggleMuralLike(id: string): Promise<ToggleMuralLikeDTO> {
  return api.post<ToggleMuralLikeDTO>(`/mural/${id}/like`);
}
