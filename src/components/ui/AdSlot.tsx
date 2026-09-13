"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { CoverImage } from "@/components/ui/CoverImage";
import {
  getPublicRandomAd,
  getRandomAd,
  registerAdClick,
  registerPublicAdClick,
  type AdFormat,
} from "@/api-client/ads";

const CHURCH_SLUG = process.env.NEXT_PUBLIC_CHURCH_SLUG ?? "principios-de-vida";

export function AdSlot({
  placement,
  format,
  className = "",
}: {
  placement: string;
  format: AdFormat;
  className?: string;
}) {
  const { user } = useAuth();

  const { data: ad } = useQuery({
    queryKey: ["ads", "random", placement, format, user?.id],
    queryFn: () =>
      user ? getRandomAd(placement, format) : getPublicRandomAd(CHURCH_SLUG, placement, format),
  });

  if (!ad) return null;

  function handleClick() {
    if (user) {
      registerAdClick(ad!.id).catch(() => {});
    } else {
      registerPublicAdClick(CHURCH_SLUG, ad!.id).catch(() => {});
    }
  }

  const ratioClass = format === "slide" ? "aspect-[1200/450]" : "aspect-square";

  const content = (
    <CoverImage label={ad.title} seed={`ad-${ad.id}`} src={ad.imageUrl} className={`${ratioClass} ${className}`}>
      <span className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[9px] uppercase tracking-wide text-white/80">
        Publicidade
      </span>
    </CoverImage>
  );

  if (!ad.linkUrl) return content;

  return (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" onClick={handleClick}>
      {content}
    </a>
  );
}
