import { api } from "./client";

export interface OfferingDTO {
  id: string;
  churchId: string;
  userId: string;
  type: "event_registration" | "contribution" | "donation";
  relatedEventId?: string;
  amount: number;
  currency: "BRL";
  provider: string;
  providerPaymentId: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
}

export interface CreateOfferingResultDTO extends OfferingDTO {
  clientSecret: string;
  pixQrCode?: string;
  pixCopyPaste?: string;
}

export interface OfferingsSummaryDTO {
  year: number | "all";
  totalPaid: number;
  count: number;
}

export function createOffering(data: {
  type: "contribution" | "donation";
  amount: number;
  provider?: string;
}): Promise<CreateOfferingResultDTO> {
  return api.post<CreateOfferingResultDTO>("/offerings", data);
}

export function listOfferings(params?: {
  year?: number;
  userId?: string;
  churchId?: string;
}): Promise<OfferingDTO[]> {
  const query: Record<string, string> = {};
  if (params?.year) query.year = String(params.year);
  if (params?.userId) query.userId = params.userId;
  if (params?.churchId) query.churchId = params.churchId;
  return api.get<OfferingDTO[]>("/offerings", { params: query });
}

export function getOfferingsSummary(params?: {
  year?: number;
  userId?: string;
  churchId?: string;
}): Promise<OfferingsSummaryDTO> {
  const query: Record<string, string> = {};
  if (params?.year) query.year = String(params.year);
  if (params?.userId) query.userId = params.userId;
  if (params?.churchId) query.churchId = params.churchId;
  return api.get<OfferingsSummaryDTO>("/offerings/summary", { params: query });
}
