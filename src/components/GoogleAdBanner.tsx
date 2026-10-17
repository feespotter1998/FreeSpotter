"use client";

import React, { useEffect, useRef } from "react";
import { AFFILIATE_CONFIG } from "@/lib/affiliates";
import { Sparkles, Megaphone } from "lucide-react";

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
  onOpenProModal,
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

  // Pro members see zero ads
  if (isPro) return null;

  return (
    <div
      ref={adRef}
      className={`relative w-full overflow-hidden rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-3 sm:p-4 min-h-[90px] sm:min-h-[100px] flex items-center justify-center text-center transition-all ${className}`}
    >
      {adsenseClientId && activeSlotId ? (
        // Live Google AdSense Container
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
      ) : (
        // Demo Placeholder before AdSense approval
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-4xl px-2">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-400 shrink-0">
              <Megaphone className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                  Google Ad Space
                </span>
                <span className="text-[10px] text-zinc-500">
                  (CPM Impression Slot)
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Targeted display ads for e-commerce tools, shipping solutions, and supplies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenProModal && (
              <button
                onClick={onOpenProModal}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Remove Ads with Pro ($5/mo)
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default GoogleAdBanner;
