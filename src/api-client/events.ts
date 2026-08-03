import { api } from "./client";

export interface EventDTO {
  id: string;
  title: string;
  imageUrl: string;
  featuredImageUrl?: string;
  date: string;
  location?: string;
  price?: number;
  featured: boolean;
}

export interface EventInputDTO {
  title: string;
  imageUrl: string;
  featuredImageUrl?: string;
  date: string;
  location?: string;
  price?: number;
  featured?: boolean;
}

export interface EventRegistrationDTO {
  id: string;
  churchId: string;
  eventId: string;
  userId: string;
  status: "registered" | "attending" | "attended" | "cancelled";
  paymentId?: string;
  createdAt: string;
}

export interface RegisterEventResultDTO extends EventRegistrationDTO {
  clientSecret?: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
}

export function listEvents(upcoming?: boolean): Promise<EventDTO[]> {
  const params: Record<string, string> = {};
  if (upcoming !== undefined) params.upcoming = String(upcoming);
  return api.get<EventDTO[]>("/events", { params });
}

export function getPublicEvents(slug: string): Promise<EventDTO[]> {
  return api.get<EventDTO[]>(`/public/churches/${slug}/events`);
}

export function getEvent(id: string): Promise<EventDTO> {
  return api.get<EventDTO>(`/events/${id}`);
}

export function createEvent(data: EventInputDTO): Promise<EventDTO> {
  return api.post<EventDTO>("/events", data);
}

export function updateEvent(id: string, data: Partial<EventInputDTO>): Promise<EventDTO> {
  return api.patch<EventDTO>(`/events/${id}`, data);
}

export function deleteEvent(id: string): Promise<void> {
  return api.delete<void>(`/events/${id}`);
}

export function registerForEvent(
  eventId: string,
  provider = "stripe",
): Promise<RegisterEventResultDTO> {
  return api.post<RegisterEventResultDTO>(`/events/${eventId}/register`, { provider });
}

export function listMyRegistrations(status?: string): Promise<EventRegistrationDTO[]> {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  return api.get<EventRegistrationDTO[]>("/events/registrations", { params });
}

export function updateRegistration(
  id: string,
  data: { status: string },
): Promise<EventRegistrationDTO> {
  return api.patch<EventRegistrationDTO>(`/events/registrations/${id}`, data);
}
