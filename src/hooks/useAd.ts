"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useChurchSettings } from "@/hooks/useChurchSettings";
import {
  getPublicRandomAd,
  getRandomAd,
  registerAdClick,
  registerPublicAdClick,
  type AdDTO,
  type AdFormat,
} from "@/api-client/ads";

const CHURCH_SLUG = process.env.NEXT_PUBLIC_CHURCH_SLUG ?? "principios-de-vida";

export function useAd(
  placement: string,
  format: AdFormat,
): { ad: AdDTO | null; registerClick: () => void; enabled: boolean } {
  const { user } = useAuth();
  const { adsEnabled, disabledAdPlacements } = useChurchSettings();
  const enabled = adsEnabled && !disabledAdPlacements.includes(placement);

  const { data: ad } = useQuery({
    queryKey: ["ads", "random", placement, format, user?.id],
    queryFn: () =>
      user ? getRandomAd(placement, format) : getPublicRandomAd(CHURCH_SLUG, placement, format),
    enabled,
  });

  function registerClick() {
    if (!ad) return;
    if (user) {
      registerAdClick(ad.id).catch(() => {});
    } else {
      registerPublicAdClick(CHURCH_SLUG, ad.id).catch(() => {});
    }
  }

  return { ad: enabled ? (ad ?? null) : null, registerClick, enabled };
}
