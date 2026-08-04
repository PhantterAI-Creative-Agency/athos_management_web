import { api } from "./client";

export interface ContactMessageDTO {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export function sendContactMessage(data: ContactMessageDTO): Promise<void> {
  return api.post<void>("/contact", data);
}
