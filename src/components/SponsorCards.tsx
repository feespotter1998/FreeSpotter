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
  isPro: boolean;
  onOpenProModal?: () => void;
}

// ─────────────────────────────────────────────────────────────
// 1. ETSY SPONSOR 1: EVERBEE (ETSY SPY TOOL, 30% RECURRING)
// ─────────────────────────────────────────────────────────────
export function EtsyEverbeeSponsorCard({ isPro, onOpenProModal }: SponsorProps) {
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
export function EtsyThermalPrinterSponsorCard({ isPro }: SponsorProps) {
  const config = AFFILIATE_CONFIG.etsy.thermalPrinter;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
          <Printer className="w-4 h-4 text-emerald-400" />
        </div>
        <div>
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Essential Seller Hardware
          </span>
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
// 3. TIKTOK SHOP SPONSOR 1: KALODATA (VIRAL PRODUCT SPY)
// ─────────────────────────────────────────────────────────────
export function TikTokKalodataSponsorCard({ isPro, onOpenProModal }: SponsorProps) {
  const config = AFFILIATE_CONFIG.tiktok.kalodata;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-950/30 via-zinc-900/60 to-zinc-950 border border-cyan-500/30 p-4 shadow-lg transition-all hover:border-cyan-500/50 group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-700/50 mt-0.5">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-800/80">
                TikTok Intelligence
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Top Rated</span>
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
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 shadow-md shadow-cyan-950/50 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            Explore Kalodata
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 4. TIKTOK SHOP SPONSOR 2: PRINTIFY (ZERO INVENTORY SUPPLIER)
// ─────────────────────────────────────────────────────────────
export function TikTokPrintifySponsorCard({ isPro }: SponsorProps) {
  const config = AFFILIATE_CONFIG.tiktok.printify;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
          <PackageCheck className="w-4 h-4 text-teal-400" />
        </div>
        <div>
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Automated Fulfillment
          </span>
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
          className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700"
        >
          Start with Printify <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. AMAZON SPONSOR 1: HELIUM 10 (FBA RESEARCH SUITE, 33% RECURRING)
// ─────────────────────────────────────────────────────────────
export function AmazonHelium10SponsorCard({ isPro }: SponsorProps) {
  const config = AFFILIATE_CONFIG.amazon.helium10;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-900/60 to-zinc-950 border border-amber-500/30 p-4 shadow-lg transition-all hover:border-amber-500/50 group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-950/80 text-amber-400 flex items-center justify-center shrink-0 border border-amber-700/50 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-800/80">
                Amazon FBA Intelligence
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Industry Standard</span>
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
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-950/50 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            Try Helium 10 Free
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. AMAZON SPONSOR 2: JUNGLE SCOUT ($150 BOUNTY)
// ─────────────────────────────────────────────────────────────
export function AmazonJungleScoutSponsorCard({ isPro }: SponsorProps) {
  const config = AFFILIATE_CONFIG.amazon.jungleScout;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-zinc-300 shrink-0">
          <TrendingUp className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
            Sales Estimator & Supplier Sourcing
          </span>
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
          className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-zinc-700"
        >
          Check Jungle Scout <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 5. EBAY SPONSOR: ZIK ANALYTICS
// ─────────────────────────────────────────────────────────────
export function EbayZikAnalyticsSponsorCard({ isPro }: SponsorProps) {
  const config = AFFILIATE_CONFIG.ebay.zikAnalytics;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/30 via-zinc-900/60 to-zinc-950 border border-blue-500/30 p-4 shadow-lg transition-all hover:border-blue-500/50 group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-950/80 text-blue-400 flex items-center justify-center shrink-0 border border-blue-700/50 mt-0.5">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 bg-blue-950/90 px-2 py-0.5 rounded border border-blue-800/80">
                eBay Seller Tool
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Market Research</span>
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
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-950/50 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            Try ZIK Analytics Free
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 6. SHOPIFY SPONSOR: KLAVIYO
// ─────────────────────────────────────────────────────────────
export function ShopifyKlaviyoSponsorCard({ isPro }: SponsorProps) {
  const config = AFFILIATE_CONFIG.shopify.klaviyo;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-zinc-950 border border-emerald-500/30 p-4 shadow-lg transition-all hover:border-emerald-500/50 group">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-950/80 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-700/50 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800/80">
                Shopify Growth Tool
              </span>
              <span className="text-[10px] text-zinc-500 font-medium">Email & SMS Marketing</span>
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
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/50 transition-all cursor-pointer whitespace-nowrap active:scale-95"
          >
            Start Free on Klaviyo
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
