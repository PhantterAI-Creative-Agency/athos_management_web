import { api } from "./client";

export interface DataDeletionRequestDTO {
  name: string;
  email: string;
  reason?: string;
}

export function sendDataDeletionRequest(data: DataDeletionRequestDTO): Promise<void> {
  return api.post<void>("/data-deletion-requests", data);
}
