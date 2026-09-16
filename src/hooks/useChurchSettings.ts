"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyChurch, getPublicChurch, type ChurchSettingsDTO } from "@/api-client/churches";
import { useAuth } from "@/hooks/useAuth";

const CHURCH_SLUG = process.env.NEXT_PUBLIC_CHURCH_SLUG ?? "principios-de-vida";

const DEFAULT_SETTINGS: ChurchSettingsDTO = {
  primaryColor: "#000000",
  growthGroupName: "Grupos de Crescimento",
  growthGroupAcronym: "GC",
  adsEnabled: true,
  disabledAdPlacements: [],
};

export function useChurchSettings(): ChurchSettingsDTO {
  const { user } = useAuth();

  const { data: church } = useQuery({
    queryKey: ["churches", user ? "me" : "public", user?.id],
    queryFn: () => (user ? getMyChurch() : getPublicChurch(CHURCH_SLUG)),
  });

  return church?.settings ?? DEFAULT_SETTINGS;
}
