import { api } from "./client";

export type AdFormat = "card" | "slide";

export interface AdDTO {
  id: string;
  churchId: string;
  format: AdFormat;
  placement: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
  order: number;
  clicks: number;
  impressions: number;
  createdAt: string;
}

export interface AdInputDTO {
  format: AdFormat;
  placement: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  order?: number;
}

export interface AdsSettingsDTO {
  adsEnabled: boolean;
  disabledAdPlacements: string[];
}

export function getAdsSettings(): Promise<AdsSettingsDTO> {
  return api.get<AdsSettingsDTO>("/ads/settings");
}

export function updateAdsSettings(data: Partial<AdsSettingsDTO>): Promise<AdsSettingsDTO> {
  return api.patch<AdsSettingsDTO>("/ads/settings", data);
}

export function listAds(): Promise<AdDTO[]> {
  return api.get<AdDTO[]>("/ads");
}

export function getAd(id: string): Promise<AdDTO> {
  return api.get<AdDTO>(`/ads/${id}`);
}

export function createAd(data: AdInputDTO): Promise<AdDTO> {
  return api.post<AdDTO>("/ads", data);
}

export function updateAd(id: string, data: Partial<AdInputDTO>): Promise<AdDTO> {
  return api.patch<AdDTO>(`/ads/${id}`, data);
}

export function deleteAd(id: string): Promise<void> {
  return api.delete<void>(`/ads/${id}`);
}

export function getRandomAd(placement: string, format: AdFormat): Promise<AdDTO | null> {
  return api.get<AdDTO | null>("/ads/random", { params: { placement, format } });
}

export function getPublicRandomAd(slug: string, placement: string, format: AdFormat): Promise<AdDTO | null> {
  return api.get<AdDTO | null>(`/public/churches/${slug}/ads`, { params: { placement, format } });
}

export function registerAdClick(id: string): Promise<void> {
  return api.post<void>(`/ads/${id}/click`);
}

export function registerPublicAdClick(slug: string, id: string): Promise<void> {
  return api.post<void>(`/public/churches/${slug}/ads/${id}/click`);
}
