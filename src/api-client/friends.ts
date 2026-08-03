import { api } from "./client";

export interface FriendshipDTO {
  id: string;
  userId: string;
  friendId: string;
  status: "pending" | "accepted";
  mutualFriendsCount: number;
  createdAt: string;
}

export function listFriends(status?: string): Promise<FriendshipDTO[]> {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  return api.get<FriendshipDTO[]>("/friends", { params });
}

export function sendFriendRequest(friendId: string): Promise<FriendshipDTO> {
  return api.post<FriendshipDTO>("/friends", { friendId });
}

export function acceptFriendRequest(id: string): Promise<FriendshipDTO> {
  return api.patch<FriendshipDTO>(`/friends/${id}`);
}

export function removeFriend(id: string): Promise<void> {
  return api.delete<void>(`/friends/${id}`);
}
