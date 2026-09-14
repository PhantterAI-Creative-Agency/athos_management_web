"use client";

import { useAd } from "@/hooks/useAd";
import { Reveal } from "@/components/ui/Reveal";
import { AdSlot } from "@/components/ui/AdSlot";
import type { AdFormat } from "@/api-client/ads";

/** Section wrapper for a home-page ad slot — renders nothing (no empty band) when there is no active ad. */
export function AdSection({
  placement,
  format,
  className,
  background = "bg-surface",
}: {
  placement: string;
  format: AdFormat;
  className?: string;
  background?: string;
}) {
  const { ad } = useAd(placement, format);

  if (!ad) return null;

  return (
    <Reveal as="section" className={background}>
      <div className="mx-auto max-w-3xl px-5 py-7 md:max-w-5xl md:px-12">
        <AdSlot placement={placement} format={format} className={className} />
      </div>
    </Reveal>
  );
}
