"use client";

import React from "react";
import {
  Search,
  Printer,
  TrendingUp,
  PackageCheck,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { AFFILIATE_CONFIG } from "@/lib/affiliates";

interface SponsorProps {
  isPro?: boolean;
  onOpenProModal?: () => void;
}

// ─────────────────────────────────────────────────────────────
// 1. ETSY SPONSOR 1: EVERBEE (ETSY SPY TOOL, 30% RECURRING)
// ─────────────────────────────────────────────────────────────
export function EtsyEverbeeSponsorCard({ isPro = false }: SponsorProps = {}) {
  if (isPro) return null;
  const config = AFFILIATE_CONFIG.etsy.everbee;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-950/30 via-zinc-900/60 to-zinc-950 border border-orange-500/30 p-4 shadow-lg transition-all hover:border-orange-500/50 group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-950/80 text-orange-400 flex items-center justify-center shrink-0 border border-orange-700/50 mt-0.5">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-950/90 px-2 py-0.5 rounded border border-orange-800/80">
                Etsy Seller Tool
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 uppercase tracking-wider">
                Sponsored
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Trending</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              {config.title}
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              {config.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <a
            href={config.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-md shadow-orange-950/50 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            Try EverBee Free
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 2. ETSY SPONSOR 2: 4x6 THERMAL PRINTER (AMAZON ASSOCIATES)
// ─────────────────────────────────────────────────────────────
export function EtsyThermalPrinterSponsorCard({ isPro = false }: SponsorProps = {}) {
  if (isPro) return null;
  const config = AFFILIATE_CONFIG.etsy.thermalPrinter;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
          <Printer className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
              Essential Seller Hardware
            </span>
            <span className="text-[9px] text-zinc-400 font-semibold bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 uppercase tracking-wider">
              Sponsored Partner
            </span>
          </div>
          <p className="font-bold text-zinc-100 mt-0.5">
            {config.title}
          </p>
          <p className="text-[11px] text-zinc-400">
            {config.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
        <a
          href={config.url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700"
        >
          View on Amazon <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 3. TRUEPROFIT (REAL-TIME PROFIT & AD SPEND ANALYTICS FOR SHOPIFY, TIKTOK, AMAZON)
// ─────────────────────────────────────────────────────────────
export interface TrueProfitSponsorProps extends SponsorProps {
  platform?: "shopify" | "tiktok" | "amazon" | "ebay" | "general";
}

export function TrueProfitSponsorCard({
  isPro = false,
  platform = "general",
}: TrueProfitSponsorProps = {}) {
  if (isPro) return null;
  const config = AFFILIATE_CONFIG.trueprofit;
  const content =
    platform === "shopify"
      ? config.shopify
      : platform === "tiktok"
      ? config.tiktok
      : platform === "amazon"
      ? config.amazon
      : config.general;

  const badgeText =
    platform === "shopify"
      ? "Shopify Real-Time Profit"
      : platform === "tiktok"
      ? "TikTok Shop Profit Engine"
      : platform === "amazon"
      ? "Amazon FBA Real Profit"
      : "Multi-Store Profit Tracking";

  const buttonText =
    platform === "shopify"
      ? "Try TrueProfit Free"
      : platform === "tiktok"
      ? "Track TikTok Profit"
      : platform === "amazon"
      ? "Track FBA Profit"
      : "Try TrueProfit Free";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-zinc-950 border border-emerald-500/30 p-4 shadow-lg transition-all hover:border-emerald-500/50 group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-700/50 mt-0.5">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800/80">
                {badgeText}
              </span>
              <span className="text-[10px] text-zinc-400 font-semibold bg-zinc-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 uppercase tracking-wider">
                Sponsored Partner
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Real-Time Sync</span>
            </div>
            <h4 className="text-sm font-bold text-white mt-1">
              {content.title}
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
              {content.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <a
            href={config.url}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/50 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            {buttonText}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPATIBILITY EXPORTS MAPPED TO THE 3 ACTIVE AFFILIATE PARTNERS
// (EverBee, TrueProfit, and JADENS Bluetooth Thermal Printer)
// ─────────────────────────────────────────────────────────────

export function TikTokKalodataSponsorCard({ isPro = false }: SponsorProps = {}) {
  return <TrueProfitSponsorCard isPro={isPro} platform="tiktok" />;
}

export function TikTokPrintifySponsorCard({ isPro = false }: SponsorProps = {}) {
  return <EtsyThermalPrinterSponsorCard isPro={isPro} />;
}

export function AmazonHelium10SponsorCard({ isPro = false }: SponsorProps = {}) {
  return <TrueProfitSponsorCard isPro={isPro} platform="amazon" />;
}

export function AmazonJungleScoutSponsorCard({ isPro = false }: SponsorProps = {}) {
  return <EtsyThermalPrinterSponsorCard isPro={isPro} />;
}

export function EbayZikAnalyticsSponsorCard({ isPro = false }: SponsorProps = {}) {
  return <EtsyThermalPrinterSponsorCard isPro={isPro} />;
}

export function ShopifyKlaviyoSponsorCard({ isPro = false }: SponsorProps = {}) {
  return <TrueProfitSponsorCard isPro={isPro} platform="shopify" />;
}
