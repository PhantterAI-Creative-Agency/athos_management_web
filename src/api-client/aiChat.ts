import { api } from "./client";

export type ChatMessageCategory = "system_question" | "pastoral_care" | "other";

export interface ChatReplyDTO {
  sessionId: string;
  reply: string;
  category: ChatMessageCategory;
}

export function sendChatMessage(sessionId: string, message: string): Promise<ChatReplyDTO> {
  return api.post<ChatReplyDTO>("/ai-chat/messages", { sessionId, message });
}

export function sendGuestChatMessage(
  churchSlug: string,
  data: { sessionId: string; message: string; guestName: string; guestWhatsapp: string },
): Promise<ChatReplyDTO> {
  return api.post<ChatReplyDTO>(`/public/churches/${churchSlug}/ai-chat/messages`, data);
}
