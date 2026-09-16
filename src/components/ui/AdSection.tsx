"use client";

import { Reveal } from "@/components/ui/Reveal";
import { AdSlot } from "@/components/ui/AdSlot";
import { useAd } from "@/hooks/useAd";
import type { AdFormat } from "@/api-client/ads";

/** Section wrapper for a home-page ad slot — shows a placeholder until an ad is configured for this placement. */
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
  const { enabled } = useAd(placement, format);

  if (!enabled) {
    return null;
  }

  return (
    <Reveal as="section" className={background}>
      <div className="mx-auto max-w-3xl px-5 py-7 md:max-w-5xl md:px-12">
        <AdSlot placement={placement} format={format} className={className} />
      </div>
    </Reveal>
  );
}
