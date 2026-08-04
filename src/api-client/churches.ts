import { api } from "./client";

export interface ChurchSearchResultDTO {
  name: string;
  logoUrl: string;
  slug: string;
  address?: string;
}

export interface ChurchHomeContentDTO {
  intro?: string;
  mission?: string;
  vision?: string;
  values?: string;
  bannerEventId?: string;
}

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "twitter"
  | "linkedin"
  | "youtube"
  | "spotify"
  | "applemusic";

export interface SocialLinkDTO {
  platform: SocialPlatform;
  url: string;
}

export interface ChurchContactDTO {
  email?: string;
  whatsapp?: string;
  socialLinks?: SocialLinkDTO[];
}

export interface ChurchSettingsDTO {
  primaryColor: string;
  growthGroupName: string;
  growthGroupAcronym: string;
}

export interface ChurchDTO {
  id: string;
  name: string;
  logoUrl: string;
  address?: string;
  slug: string;
  settings: ChurchSettingsDTO;
  homeContent?: ChurchHomeContentDTO;
  contact?: ChurchContactDTO;
  createdAt: string;
}

export function searchChurches(q: string): Promise<ChurchSearchResultDTO[]> {
  return api.get<ChurchSearchResultDTO[]>("/churches/search", { params: { q } });
}

export function getMyChurch(): Promise<ChurchDTO> {
  return api.get<ChurchDTO>("/churches/me");
}

export function getPublicChurch(slug: string): Promise<ChurchDTO> {
  return api.get<ChurchDTO>(`/public/churches/${slug}`);
}

export function updateMyChurch(
  data: Partial<Pick<ChurchDTO, "name" | "logoUrl" | "address" | "homeContent" | "contact">> & {
    settings?: Partial<ChurchSettingsDTO>;
  },
): Promise<ChurchDTO> {
  return api.patch<ChurchDTO>("/churches/me", data);
}
