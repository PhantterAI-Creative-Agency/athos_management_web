"use client";

import { useAd } from "@/hooks/useAd";
import { CoverImage } from "@/components/ui/CoverImage";
import type { AdFormat } from "@/api-client/ads";

export function AdSlot({
  placement,
  format,
  className = "",
}: {
  placement: string;
  format: AdFormat;
  className?: string;
}) {
  const { ad, registerClick, enabled } = useAd(placement, format);

  const ratioClass = className.includes("aspect-")
    ? ""
    : format === "slide"
      ? "aspect-[1200/450]"
      : "aspect-square";

  if (!enabled) {
    return null;
  }

  if (!ad) {
    return (
      <div
        className={`flex items-center justify-center rounded-2xl border border-dashed border-divider bg-surface/50 ${ratioClass} ${className}`}
      >
        <span className="px-3 text-center text-[11px] uppercase tracking-wide text-text-muted">
          Espaço para anúncio
        </span>
      </div>
    );
  }

  const content = (
    <CoverImage label={ad.title} seed={`ad-${ad.id}`} src={ad.imageUrl} className={`${ratioClass} ${className}`}>
      <span className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[9px] uppercase tracking-wide text-white/80">
        Publicidade
      </span>
    </CoverImage>
  );

  if (!ad.linkUrl) return content;

  return (
    <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer sponsored" onClick={registerClick}>
      {content}
    </a>
  );
}
