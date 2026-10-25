"use client";

import React, { useEffect, useRef } from "react";
import { AFFILIATE_CONFIG } from "@/lib/affiliates";

interface GoogleAdBannerProps {
  slotId?: string;
  isPro?: boolean;
  onOpenProModal?: () => void;
  format?: "auto" | "horizontal" | "rectangle";
  className?: string;
}

export function GoogleAdBanner({
  slotId,
  isPro = false,
  format = "horizontal",
  className = "",
}: GoogleAdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adsenseClientId = AFFILIATE_CONFIG.adsense.clientId;
  const activeSlotId = slotId || AFFILIATE_CONFIG.adsense.slots.dashboardBanner;

  useEffect(() => {
    // If client ID and slot exist, trigger Google AdSense
    if (adsenseClientId && activeSlotId && !isPro) {
      try {
        // @ts-expect-error Google AdSense global array
        ((window.adsbygoogle = window.adsbygoogle || [])).push({});
      } catch (err) {
        console.warn("Google AdSense push error:", err);
      }
    }
  }, [adsenseClientId, activeSlotId, isPro]);

  // Pro members or unconfigured AdSense sites see zero ads / placeholders
  if (isPro || !adsenseClientId) return null;

  return (
    <div
      ref={adRef}
      className={`relative w-full overflow-hidden rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-3 sm:p-4 min-h-[90px] sm:min-h-[100px] flex items-center justify-center text-center transition-all ${className}`}
    >
      {/* Live Google AdSense Container */}
      <div className="w-full flex justify-center overflow-hidden">
        <ins
          className="adsbygoogle"
          style={{ display: "block", textAlign: "center" }}
          data-ad-layout="key-visual"
          data-ad-format={format}
          data-full-width-responsive="true"
          data-ad-client={adsenseClientId}
          data-ad-slot={activeSlotId}
        />
      </div>
    </div>
  );
}

export default GoogleAdBanner;
