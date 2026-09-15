import { api } from "./client";

export interface FollowDTO {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export function listFollows(type: "followers" | "following" = "following"): Promise<FollowDTO[]> {
  return api.get<FollowDTO[]>("/follows", { params: { type } });
}

export function followUser(followingId: string): Promise<FollowDTO> {
  return api.post<FollowDTO>("/follows", { followingId });
}

export function unfollowUser(followingId: string): Promise<void> {
  return api.delete<void>(`/follows/${followingId}`);
}
