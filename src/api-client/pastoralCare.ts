import { api } from "./client";

export interface PrayerCareRecipientDTO {
  id: string;
  churchId: string;
  userId: string;
  active: boolean;
  createdAt: string;
}

export interface PastoralCareRequestDTO {
  id: string;
  churchId: string;
  userId?: string;
  guestName?: string;
  guestWhatsapp?: string;
  message: string;
  status: "pending" | "acknowledged";
  notifiedRecipientIds: string[];
  createdAt: string;
}

export function listPrayerCareRecipients(): Promise<PrayerCareRecipientDTO[]> {
  return api.get<PrayerCareRecipientDTO[]>("/pastoral-care/recipients");
}

export function addPrayerCareRecipient(userId: string): Promise<PrayerCareRecipientDTO> {
  return api.post<PrayerCareRecipientDTO>("/pastoral-care/recipients", { userId });
}

export function updatePrayerCareRecipient(id: string, active: boolean): Promise<PrayerCareRecipientDTO> {
  return api.patch<PrayerCareRecipientDTO>(`/pastoral-care/recipients/${id}`, { active });
}

export function listPastoralCareRequests(): Promise<PastoralCareRequestDTO[]> {
  return api.get<PastoralCareRequestDTO[]>("/pastoral-care/requests");
}
