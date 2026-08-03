"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyChurch, type ChurchSettingsDTO } from "@/api-client/churches";
import { useAuth } from "@/hooks/useAuth";

const DEFAULT_SETTINGS: ChurchSettingsDTO = {
  primaryColor: "#000000",
  growthGroupName: "Grupos de Crescimento",
  growthGroupAcronym: "GC",
};

export function useChurchSettings(): ChurchSettingsDTO {
  const { user } = useAuth();

  const { data: church } = useQuery({
    queryKey: ["churches", "me"],
    queryFn: getMyChurch,
    enabled: !!user,
  });

  return church?.settings ?? DEFAULT_SETTINGS;
}
