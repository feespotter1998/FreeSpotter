"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Percent,
  ShoppingBag,
  Store,
  Calculator,
  FileSpreadsheet,
  Plus,
  Minus,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Crown,
  ShieldCheck,
  Target,
  Calendar,
  Package,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Tag,
  Box,
  Truck,
  Layers,
  ExternalLink,
} from "lucide-react";
import {
  type EtsyInputs,
  type TikTokInputs,
  type ReverseCalcInputs,
  type AmazonInputs,
  type EbayInputs,
  type ShopifyInputs,
  type EtsyResult,
  type TikTokResult,
  type ReverseCalcResult,
  type AmazonResult,
  type EbayResult,
  type ShopifyResult,
  type ReverseTikTokInputs,
  type ReverseAmazonInputs,
  type ReverseEbayInputs,
  type ReverseShopifyInputs,
  calculateEtsyProfit,
  calculateTikTokProfit,
  calculateAmazonProfit,
  calculateEbayProfit,
  calculateShopifyProfit,
  round2,
  solveEtsyPriceForTargetMargin,
  solveTikTokPriceForTargetMargin,
  solveAmazonPriceForTargetMargin,
  solveEbayPriceForTargetMargin,
  solveShopifyPriceForTargetMargin,
  DEFAULT_ETSY_INPUTS,
  DEFAULT_TIKTOK_INPUTS,
  DEFAULT_REVERSE_INPUTS,
  DEFAULT_REVERSE_TIKTOK_INPUTS,
  DEFAULT_REVERSE_AMAZON_INPUTS,
  DEFAULT_REVERSE_EBAY_INPUTS,
  DEFAULT_REVERSE_SHOPIFY_INPUTS,
  DEFAULT_AMAZON_INPUTS,
  DEFAULT_EBAY_INPUTS,
  DEFAULT_SHOPIFY_INPUTS,
} from "@/lib/calculations";
import { WaterfallChart } from "./WaterfallChart";
import { BatchCsvAudit } from "./BatchCsvAudit";
import { ProUpgradeModal } from "./ProUpgradeModal";
import {
  EtsyEverbeeSponsorCard,
  EtsyThermalPrinterSponsorCard,
  TikTokKalodataSponsorCard,
  TikTokPrintifySponsorCard,
  AmazonHelium10SponsorCard,
  AmazonJungleScoutSponsorCard,
  EbayZikAnalyticsSponsorCard,
  ShopifyKlaviyoSponsorCard,
} from "./SponsorCards";
import { GoogleAdBanner } from "./GoogleAdBanner";
import { MarketplaceComparator } from "./MarketplaceComparator";
import { SellerFaqAccordion } from "./SellerFaqAccordion";
import { AFFILIATE_CONFIG } from "@/lib/affiliates";
import {
  SignInButton,
  SignUpButton,
  Show,
  UserButton,
} from "@clerk/nextjs";

// ═══════════════════════════════════════════════════════════════
//  STORE & NAVIGATION TYPES
// ═══════════════════════════════════════════════════════════════

export type StoreId = "hub" | "etsy" | "tiktok" | "amazon" | "ebay" | "shopify";
export type SubTabId = "calculator" | "reverse" | "audit";

interface StoreOption {
  id: StoreId;
  name: string;
  shortName: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  accentBorder: string;
  accentBg: string;
  description: string;
  keyFees: string[];
  isAvailable: boolean;
  comingSoonNote?: string;
}

const STORE_CONFIGS: StoreOption[] = [
  {
    id: "etsy",
    name: "Etsy Seller Suite",
    shortName: "Etsy",
    badge: "US 2026 Engine",
    badgeColor: "bg-orange-950 text-orange-400 border-orange-800/60",
    icon: <ShoppingBag className="w-5 h-5 text-orange-400" />,
    accentBorder: "border-orange-500/30 hover:border-orange-500/70",
    accentBg: "from-orange-950/20 via-zinc-900/60 to-zinc-950",
    description: "6.5% transaction fees, 3% + $0.25 payment processing, $0.20 listing renewals, offsite ads, and reverse target margin solver.",
    keyFees: [
      "6.5% Transaction Fee",
      "3% + $0.25 Processing",
      "$0.20 Listing Renewal",
      "Offsite Ads (12%/15%)",
      "What Should I Charge? Solver",
      "Batch CSV Audit",
    ],
    isAvailable: true,
  },
  {
    id: "tiktok",
    name: "TikTok Shop Suite",
    shortName: "TikTok Shop",
    badge: "2026 Commission",
    badgeColor: "bg-cyan-950 text-cyan-400 border-cyan-800/60",
    icon: <Store className="w-5 h-5 text-cyan-400" />,
    accentBorder: "border-cyan-500/30 hover:border-cyan-500/70",
    accentBg: "from-cyan-950/20 via-zinc-900/60 to-zinc-950",
    description: "TikTok commission tiers, flat $0.30/order, creator affiliate commission, sample buffer, and exact Break-Even ROAS solver for TikTok Ads.",
    keyFees: [
      "2026 Commission Split",
      "Flat $0.30/Order Fee",
      "Break-Even ROAS Solver",
      "Creator Affiliate Split",
      "Monthly Volume Projections",
      "Batch CSV Audit",
    ],
    isAvailable: true,
  },
  {
    id: "amazon",
    name: "Amazon FBA & FBM Suite",
    shortName: "Amazon",
    badge: "FBA & FBM 2026",
    badgeColor: "bg-amber-950 text-amber-400 border-amber-800/60",
    icon: <Package className="w-5 h-5 text-amber-400" />,
    accentBorder: "border-amber-500/30 hover:border-amber-500/70",
    accentBg: "from-amber-950/20 via-zinc-900/60 to-zinc-950",
    description: "FBA Pick & Pack size tiers, monthly storage & inbound buffers, category referral fees (8%-17%), and Break-Even ACoS % for Amazon PPC.",
    keyFees: [
      "Break-Even ACoS %",
      "Break-Even ROAS",
      "FBA Pick & Pack Size Tiers",
      "Referral Fees (8% - 17%)",
      "FBA vs FBM Comparison",
      "Batch CSV Audit",
    ],
    isAvailable: true,
  },
  {
    id: "ebay",
    name: "eBay Seller Suite",
    shortName: "eBay",
    badge: "13.25% FVF + Ads",
    badgeColor: "bg-blue-950 text-blue-400 border-blue-800/60",
    icon: <Tag className="w-5 h-5 text-blue-400" />,
    accentBorder: "border-blue-500/30 hover:border-blue-500/70",
    accentBg: "from-blue-950/20 via-zinc-900/60 to-zinc-950",
    description: "13.25% category Final Value Fees, $0.30 fixed per order, Promoted Listings Standard ad rates, and store subscription tiers.",
    keyFees: [
      "13.25% Final Value Fee",
      "$0.30 Fixed Order Fee",
      "Promoted Listings Standard",
      "Store Tier Subscriptions",
      "Return Dispute Clawback",
      "Batch CSV Audit",
    ],
    isAvailable: true,
  },
  {
    id: "shopify",
    name: "Shopify DTC Suite",
    shortName: "Shopify",
    badge: "DTC 2.9% + CAC",
    badgeColor: "bg-emerald-950 text-emerald-400 border-emerald-800/60",
    icon: <Layers className="w-5 h-5 text-emerald-400" />,
    accentBorder: "border-emerald-500/30 hover:border-emerald-500/70",
    accentBg: "from-emerald-950/20 via-zinc-900/60 to-zinc-950",
    description: "Tiered Shopify Payments (2.9% to 2.5% + 30¢), 3rd-party gateway penalties, monthly app tech stack overhead, and Meta/Google CAC Break-Even ROAS.",
    keyFees: [
      "Shopify Payments (2.9%+30¢)",
      "App Stack Tech Overhead",
      "Break-Even ROAS for Meta Ads",
      "3rd-Party Gateway Surcharge",
      "Unrefunded Fee Protection",
      "Batch CSV Audit",
    ],
    isAvailable: true,
  },
  {
    id: "hub" as StoreId,
    name: "Other Marketplaces",
    shortName: "More Channels",
    badge: "COMING SOON",
    badgeColor: "bg-purple-950 text-purple-400 border-purple-800/60",
    icon: <Store className="w-5 h-5 text-purple-400" />,
    accentBorder: "border-purple-500/30 hover:border-purple-500/50",
    accentBg: "from-purple-950/20 via-zinc-900/60 to-zinc-950",
    description: "Upcoming profit calculators, return models, and fee engines for emerging seller channels.",
    keyFees: [
      "Walmart WFS Fulfillment",
      "Mercari Fee Splits",
      "Poshmark Flat 20% Model",
      "WooCommerce Self-Hosted",
    ],
    isAvailable: false,
    comingSoonNote: "Walmart, Mercari, Poshmark & WooCommerce in 2026",
  },
];

// ═══════════════════════════════════════════════════════════════
//  AESTHETIC KPI CARD
// ═══════════════════════════════════════════════════════════════

interface KpiCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: React.ReactNode;
  negative?: boolean;
}

function KpiCard({ label, value, subValue, icon, negative }: KpiCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
        negative
          ? "border-rose-500/40 bg-gradient-to-br from-rose-950/40 via-zinc-900/60 to-zinc-950 shadow-lg shadow-rose-950/20"
          : "border-zinc-800/80 bg-gradient-to-br from-zinc-900/80 via-zinc-900/40 to-zinc-950/80 shadow-md hover:border-zinc-700/80"
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${
          negative ? "bg-rose-500/80" : "bg-emerald-500/80"
        }`}
      />
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider">
          {label}
        </span>
        <span
          className={`p-1.5 rounded-lg ${
            negative ? "bg-rose-950/60 text-rose-400" : "bg-zinc-800/60 text-zinc-300"
          }`}
        >
          {icon}
        </span>
      </div>
      <p
        className={`text-xl sm:text-2xl lg:text-3xl font-extrabold tabular-nums tracking-tight ${
          negative ? "text-rose-400" : "text-white"
        }`}
      >
        {value}
      </p>
      {subValue && (
        <p className="text-[11px] sm:text-xs text-zinc-500 mt-1 font-medium truncate">
          {subValue}
        </p>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TOUCH-OPTIMIZED INPUT FIELD WITH STEPPERS & PRESETS
// ═══════════════════════════════════════════════════════════════

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  showSlider?: boolean;
  presets?: number[];
  hint?: string;
}

function InputField({
  label,
  value,
  onChange,
  min = 0,
  max = 1000,
  step = 0.5,
  prefix = "$",
  suffix,
  showSlider = true,
  presets,
  hint,
}: InputFieldProps) {
  const handleStep = (delta: number) => {
    const next = Math.min(max, Math.max(min, Math.round((value + delta) * 100) / 100));
    onChange(next);
  };

  return (
    <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-3.5 sm:p-4 space-y-3 transition-colors hover:border-zinc-700/60">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div>
          <label className="text-xs sm:text-sm font-semibold text-zinc-200">
            {label}
          </label>
          {hint && <p className="text-[10px] text-zinc-500 mt-0.5">{hint}</p>}
        </div>

        {/* Stepper + Numeric Input Container */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-700/70 rounded-xl p-1 shadow-inner">
          <button
            type="button"
            onClick={() => handleStep(-step)}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-zinc-700 transition-colors cursor-pointer"
            aria-label="Decrease value"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center justify-center px-2 min-w-[75px] sm:min-w-[85px]">
            {prefix && (
              <span className="text-zinc-400 text-xs sm:text-sm font-medium mr-0.5 select-none">
                {prefix}
              </span>
            )}
            <input
              type="number"
              value={Number.isInteger(value) ? value : parseFloat(value.toFixed(2))}
              onFocus={(e) => {
                if (e.target.value === "0") {
                  e.target.select();
                }
              }}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || val === "-") {
                  onChange(0);
                  return;
                }
                const parsed = parseFloat(val);
                onChange(isNaN(parsed) ? 0 : parsed);
              }}
              min={min}
              max={max}
              step={step}
              className="w-full bg-transparent text-white font-bold text-xs sm:text-sm text-center focus:outline-none tabular-nums"
            />
            {suffix && (
              <span className="text-zinc-400 text-xs sm:text-sm font-medium ml-0.5 select-none">
                {suffix}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleStep(step)}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-zinc-700 transition-colors cursor-pointer"
            aria-label="Increase value"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {showSlider && (
        <div className="pt-1">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none"
          />
        </div>
      )}

      {presets && presets.length > 0 && (
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-zinc-500 font-medium uppercase mr-1">
            Quick:
          </span>
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onChange(preset)}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all shrink-0 ${
                value === preset
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-700"
              }`}
            >
              {prefix}
              {preset}
              {suffix}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  FEE BREAKDOWN TABLE COMPONENT
// ═══════════════════════════════════════════════════════════════

interface BreakdownRow {
  label: string;
  value: number;
  note?: string;
  isCost?: boolean;
}

interface FeeBreakdownTableProps {
  rows: BreakdownRow[];
  totalFees: number;
  totalCosts: number;
  netProfit: number;
}

function FeeBreakdownTable({
  rows,
  totalFees,
  totalCosts,
  netProfit,
}: FeeBreakdownTableProps) {
  const isNegative = netProfit < 0;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
      <div className="px-4 py-3 bg-zinc-950/60 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          Complete Fee &amp; Deduction Stack
        </h3>
        <span className="text-[11px] text-zinc-500 font-medium">Exact Decimals</span>
      </div>

      <div className="divide-y divide-zinc-800/40 text-xs sm:text-sm">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex justify-between items-center px-4 py-2.5 hover:bg-zinc-800/20 transition-colors"
          >
            <div>
              <span className="font-medium text-zinc-300">{row.label}</span>
              {row.note && (
                <span className="hidden sm:inline-block text-[11px] text-zinc-500 ml-2">
                  ({row.note})
                </span>
              )}
            </div>
            <span
              className={`font-semibold tabular-nums ${
                row.value === 0
                  ? "text-zinc-500"
                  : row.isCost
                  ? "text-orange-400"
                  : "text-rose-400"
              }`}
            >
              -${row.value.toFixed(2)}
            </span>
          </div>
        ))}

        <div className="flex justify-between items-center px-4 py-3 bg-zinc-950/30 font-semibold border-t border-zinc-800">
          <span className="text-zinc-400">Total Marketplace Fees</span>
          <span className={`font-bold tabular-nums ${totalFees === 0 ? "text-zinc-500" : "text-rose-400"}`}>
            -${totalFees.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between items-center px-4 py-3 bg-zinc-950/30 font-semibold">
          <span className="text-zinc-400">Total Fulfillment &amp; Product Costs</span>
          <span className={`font-bold tabular-nums ${totalCosts === 0 ? "text-zinc-500" : "text-orange-400"}`}>
            -${totalCosts.toFixed(2)}
          </span>
        </div>

        <div
          className={`flex justify-between items-center px-4 py-3.5 transition-colors ${
            isNegative
              ? "bg-rose-950/40 text-rose-300"
              : netProfit === 0 && totalFees === 0 && totalCosts === 0
              ? "bg-zinc-900 text-zinc-300"
              : "bg-emerald-950/40 text-emerald-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {isNegative ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2
                className={`w-4 h-4 shrink-0 ${
                  netProfit === 0 && totalFees === 0 && totalCosts === 0
                    ? "text-zinc-500"
                    : "text-emerald-400"
                }`}
              />
            )}
            <span className="font-extrabold uppercase tracking-wide">
              {isNegative
                ? "NET LOSS PER SALE"
                : netProfit === 0 && totalFees === 0 && totalCosts === 0
                ? "NET PROFIT PER SALE"
                : "TAKE-HOME NET PROFIT"}
            </span>
          </div>
          <span
            className={`text-lg sm:text-xl font-black tabular-nums ${
              isNegative
                ? "text-rose-400"
                : netProfit === 0 && totalFees === 0 && totalCosts === 0
                ? "text-zinc-300"
                : "text-emerald-400"
            }`}
          >
            {isNegative ? "-" : netProfit > 0 ? "+" : ""}${Math.abs(netProfit).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  RETURN & CLAWBACK LOSS COMPONENT
// ═══════════════════════════════════════════════════════════════

interface ReturnClawbackCardProps {
  clawbackAmount: number;
  platformName: string;
  explanation: string;
}

function ReturnClawbackCard({
  clawbackAmount,
  platformName,
  explanation,
}: ReturnClawbackCardProps) {
  const isLoss = clawbackAmount > 0;

  return (
    <div className="bg-zinc-950/70 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
      <div className="flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${
            isLoss
              ? "bg-rose-950/80 border-rose-800/60 text-rose-400"
              : "bg-zinc-900 border-zinc-800 text-zinc-500"
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-white">
              True Loss per Customer Return ({platformName})
            </h4>
            <span
              className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                isLoss
                  ? "bg-rose-950 text-rose-400 border-rose-800/60"
                  : "bg-zinc-900 text-zinc-500 border-zinc-800"
              }`}
            >
              {isLoss ? "Unrecoverable" : "$0 Loss"}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
            {explanation}
          </p>
        </div>
      </div>
      <div className="text-left sm:text-right sm:shrink-0 pl-12 sm:pl-0">
        <span
          className={`text-xl sm:text-2xl font-black tabular-nums ${
            isLoss ? "text-rose-400" : "text-zinc-500"
          }`}
        >
          -${clawbackAmount.toFixed(2)}
        </span>
        <span className="block text-[10px] text-zinc-500 font-medium">Out-of-Pocket / Unit</span>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  STORE HUB COMPONENT (FIRST PAGE STORE SELECTOR)
// ═══════════════════════════════════════════════════════════════

interface StoreHubProps {
  onSelectStore: (store: StoreId) => void;
  isPro: boolean;
  onOpenProModal: () => void;
}

function StoreHub({ onSelectStore, isPro, onOpenProModal }: StoreHubProps) {
  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Hero Welcome */}
      <div className="text-center max-w-4xl mx-auto space-y-3 sm:space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-sm">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Multi-Channel Profit Engine &bull; Updated for 2026 Fee Schedules</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Select Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Selling Marketplace
          </span>
        </h2>
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto">
          Audit multi-tiered referral fees, fulfillment overhead, ad break-even ROAS, and hidden deductions before listing a single product.
        </p>
      </div>

      {/* Grid of Store Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
        {STORE_CONFIGS.map((store, idx) => {
          const isLive = store.isAvailable;
          return (
            <div
              key={`${store.name}-${idx}`}
              className={`relative overflow-hidden rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                isLive
                  ? `bg-gradient-to-br ${store.accentBg} ${store.accentBorder} shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer group`
                  : `bg-gradient-to-br ${store.accentBg} ${store.accentBorder} shadow-lg`
              }`}
              onClick={() => {
                if (isLive) onSelectStore(store.id);
              }}
            >
              <div className="p-6 sm:p-7 space-y-5">
                {/* Header: Icon + Badge */}
                <div className="flex items-center justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-900/90 border border-zinc-700/60 flex items-center justify-center shadow-inner">
                    {store.icon}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${store.badgeColor}`}
                  >
                    {store.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">
                    {store.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {store.description}
                  </p>
                </div>

                {/* Feature Bullet Points */}
                <div className="pt-2 border-t border-zinc-800/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    {isLive ? "Included Tools:" : "Upcoming Integrations:"}
                  </span>
                  <div className="grid grid-cols-1 gap-1.5">
                    {store.keyFees.slice(0, 4).map((fee, fIdx) => (
                      <div
                        key={fIdx}
                        className="flex items-center gap-2 text-xs text-zinc-300"
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${isLive ? "text-emerald-400" : "text-purple-400"} shrink-0`} />
                        <span>{fee}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-6 sm:p-7 pt-0">
                {isLive ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStore(store.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-zinc-900 group-hover:bg-gradient-to-r group-hover:from-emerald-600 group-hover:to-teal-600 border border-zinc-700/80 group-hover:border-emerald-500/50 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <span>Launch {store.shortName} Suite</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <div className="w-full py-3 px-4 rounded-xl text-xs font-bold text-center text-purple-300 bg-purple-950/40 border border-purple-800/60 flex items-center justify-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>{store.comingSoonNote || "Coming Soon in 2026"}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Google AdSense Impression Slot (Above Marketplace Comparator) */}
      <GoogleAdBanner
        isPro={isPro}
        onOpenProModal={onOpenProModal}
        slotId={AFFILIATE_CONFIG.adsense.slots.comparatorBanner}
      />

      {/* Cross-Marketplace Profit Comparator Tool */}
      <MarketplaceComparator
        onSelectStore={(store) => onSelectStore(store)}
      />

      {/* Trust & Architecture Value Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/60">
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">100% Client-Side Privacy</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Your confidential supplier costs, margins, and sales volume never touch a database or remote server.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800/60 flex items-center justify-center text-cyan-400 shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Break-Even ROAS &amp; ACoS</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Exact advertising thresholds so you know the exact minimum return needed before spending on TikTok or Amazon Ads.
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/60 flex items-center justify-center text-amber-400 shrink-0">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-200">Batch CSV Catalog Auditor</h4>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Upload hundreds of SKUs at once, isolate unprofitable listings immediately, and export branded PDF audit summaries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ETSY TAB
// ═══════════════════════════════════════════════════════════════

function EtsyTab({ isPro, onOpenProModal }: { isPro: boolean; onOpenProModal: () => void }) {
  const [inputs, setInputs] = useState<EtsyInputs>(DEFAULT_ETSY_INPUTS);

  const result: EtsyResult = useMemo(() => calculateEtsyProfit(inputs), [inputs]);

  const update = <K extends keyof EtsyInputs>(key: K, value: EtsyInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isNegative = result.netProfit < 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KpiCard
          label="Gross Revenue"
          value={`$${result.grossRevenue.toFixed(2)}`}
          subValue={
            result.grossRevenue === 0
              ? "Price + Shipping"
              : `Price + Shipping ($${(inputs.sellingPrice + inputs.shippingCharged).toFixed(2)})`
          }
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          label="Total Hidden Fees"
          value={`$${result.totalFees.toFixed(2)}`}
          subValue={
            result.grossRevenue === 0
              ? "Awaiting item price"
              : `${((result.totalFees / (result.grossRevenue || 1)) * 100).toFixed(1)}% of revenue`
          }
          icon={<TrendingDown className="w-4 h-4" />}
          negative={result.totalFees > 0}
        />
        <KpiCard
          label="Net Profit"
          value={`${isNegative ? "-" : result.netProfit > 0 ? "+" : ""}$${Math.abs(result.netProfit).toFixed(2)}`}
          subValue={
            result.grossRevenue === 0 && result.netProfit === 0
              ? "Awaiting your price"
              : isNegative
              ? "LOSING MONEY"
              : "Take-home cash"
          }
          icon={
            isNegative ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )
          }
          negative={isNegative}
        />
        <KpiCard
          label="Net Margin"
          value={`${result.netMarginPercent.toFixed(1)}%`}
          subValue={
            result.grossRevenue === 0
              ? "0.0% net margin"
              : result.netMarginPercent >= 25
              ? "Strong Margin"
              : result.netMarginPercent >= 10
              ? "Healthy Margin"
              : "Thin / Risk"
          }
          icon={<Percent className="w-4 h-4" />}
          negative={isNegative}
        />
      </div>

      {/* EverBee Sponsor Card */}
      <EtsyEverbeeSponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Input Panel */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-orange-400" />
              Listing Parameters &amp; Costs
            </h3>
            <span className="text-[11px] text-zinc-500 font-medium">Etsy US 2026</span>
          </div>

          <InputField
            label="Monthly Sales Volume"
            value={inputs.monthlyVolume ?? 100}
            onChange={(v) => update("monthlyVolume", Math.max(1, Math.round(v)))}
            min={1}
            max={5000}
            step={10}
            prefix=""
            suffix=" orders"
            presets={[25, 50, 100, 250, 500]}
            hint="Estimated monthly orders for total revenue &amp; listing fees"
          />

          <InputField
            label="Item Selling Price"
            value={inputs.sellingPrice}
            onChange={(v) => update("sellingPrice", v)}
            max={300}
            step={1}
            presets={[15, 24, 35, 50, 75]}
            hint="Retail price listed on Etsy"
          />

          <InputField
            label="Cost of Goods (COGS)"
            value={inputs.cogs}
            onChange={(v) => update("cogs", v)}
            max={150}
            step={0.5}
            presets={[3, 5, 10, 15, 25]}
            hint="Raw material or wholesale cost"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Shipping to Buyer"
              value={inputs.shippingCharged}
              onChange={(v) => update("shippingCharged", v)}
              max={50}
              step={0.5}
              presets={[0, 4.99, 5.99, 8.99]}
              hint="Amount charged to customer"
            />
            <InputField
              label="Actual Shipping Cost"
              value={inputs.actualShippingCost}
              onChange={(v) => update("actualShippingCost", v)}
              max={50}
              step={0.5}
              presets={[3.5, 4.5, 6.0, 9.0]}
              hint="Actual postage cost you pay"
            />
          </div>

          <InputField
            label="Packaging Cost"
            value={inputs.packagingCost}
            onChange={(v) => update("packagingCost", v)}
            max={20}
            step={0.25}
            presets={[0.5, 1.0, 1.5, 2.5]}
            hint="Box, mailer, bubble wrap, thank-you cards"
          />

          <InputField
            label="Labor &amp; Misc Overhead"
            value={inputs.miscCost ?? 0}
            onChange={(v) => update("miscCost", v)}
            max={50}
            step={0.5}
            presets={[0, 2, 5, 10]}
            hint="Packaging labor, studio assistant, or overhead"
          />

          {/* Offsite Ads Selection */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-200">
                Offsite Ads Deduction
              </label>
              <span className="text-[10px] text-zinc-500">Capped at $100/fee</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {([0, 0.12, 0.15] as const).map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => update("offsiteAdsRate", rate)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    inputs.offsiteAdsRate === rate
                      ? "bg-orange-600 text-white shadow-md shadow-orange-950/40 border border-orange-500/40"
                      : "bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800"
                  }`}
                >
                  <div>{rate === 0 ? "0% (None)" : `${(rate * 100).toFixed(0)}%`}</div>
                  <div className="text-[9px] font-normal opacity-80 mt-0.5">
                    {rate === 0
                      ? "Organic"
                      : rate === 0.12
                      ? "Under $10k"
                      : "Mandatory"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Waterfall Chart & Visual Breakdown */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider">
                Profit Waterfall Breakdown
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isNegative
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : result.grossRevenue === 0
                    ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                }`}
              >
                {isNegative ? "BLEEDING MARGIN" : result.grossRevenue === 0 ? "AWAITING INPUT" : "PROFITABLE"}
              </span>
            </div>
            <WaterfallChart steps={result.waterfallSteps} />
          </div>

          {/* Fee Breakdown Table */}
          <FeeBreakdownTable
            rows={[
              { label: "Etsy Listing Fee", value: result.listingFee, note: "$0.20 per item" },
              {
                label: "Transaction Fee (6.5%)",
                value: result.transactionFee,
                note: "6.5% of Item + Shipping",
              },
              {
                label: "Payment Processing",
                value: result.paymentProcessingFee,
                note: "3.0% + $0.25",
              },
              {
                label: `Offsite Ads (${(inputs.offsiteAdsRate * 100).toFixed(0)}%)`,
                value: result.offsiteAdsFee,
                note: inputs.offsiteAdsRate > 0 ? "Applied to item price" : "None",
              },
              { label: "Cost of Goods (COGS)", value: inputs.cogs, isCost: true },
              {
                label: "Actual Shipping Cost",
                value: inputs.actualShippingCost,
                isCost: true,
              },
              { label: "Packaging Cost", value: inputs.packagingCost, isCost: true },
              ...(inputs.miscCost && inputs.miscCost > 0
                ? [{ label: "Labor & Misc Overhead", value: inputs.miscCost, isCost: true, note: "Time / helper pay" }]
                : []),
            ]}
            totalFees={result.totalFees}
            totalCosts={result.totalCosts}
            netProfit={result.netProfit}
          />
        </div>
      </div>

      {/* Monthly Business Projections Card */}
      <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-950 text-orange-400 border border-orange-800/60 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Monthly Business Projections
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-orange-950 text-orange-400 border border-orange-800/60">
                  {inputs.monthlyVolume || 100} Orders/Mo
                </span>
              </h4>
              <p className="text-[11px] text-zinc-400">
                Projected monthly revenue and take-home pay based on your sales volume.
              </p>
            </div>
          </div>

          {/* Quick Volume Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-zinc-500 font-medium whitespace-nowrap">Volume:</span>
            {[25, 50, 100, 250, 500].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => update("monthlyVolume", v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  inputs.monthlyVolume === v
                    ? "bg-orange-500 text-black shadow-xs font-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Revenue</span>
            <span className="text-base sm:text-lg font-black text-white tabular-nums">
              ${result.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Take-Home Profit</span>
            <span className={`text-base sm:text-lg font-black tabular-nums ${result.monthlyNetProfit > 0 ? "text-emerald-400" : result.monthlyNetProfit < 0 ? "text-rose-400" : "text-zinc-300"}`}>
              {result.monthlyNetProfit > 0 ? "+" : ""}${result.monthlyNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Etsy Fees Paid</span>
            <span className="text-base sm:text-lg font-bold text-zinc-300 tabular-nums">
              ${result.monthlyTotalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Return & Cancellation Loss Scenario */}
      <ReturnClawbackCard
        clawbackAmount={result.returnClawbackLoss}
        platformName="Etsy"
        explanation="Estimated unrecoverable cash loss if a buyer returns this item (lost carrier postage, non-refundable $0.20 listing fee, destroyed packaging, and ~20% restocking/damage loss)."
      />

      {/* Hardware Packing Sponsor */}
      <EtsyThermalPrinterSponsorCard isPro={isPro} />

      {/* Seller Traps & Real Answers FAQ Accordion */}
      <SellerFaqAccordion platform="etsy" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  TIKTOK TAB
// ═══════════════════════════════════════════════════════════════

function TikTokTab({ isPro, onOpenProModal }: { isPro: boolean; onOpenProModal: () => void }) {
  const [inputs, setInputs] = useState<TikTokInputs>(DEFAULT_TIKTOK_INPUTS);

  const result: TikTokResult = useMemo(
    () => calculateTikTokProfit(inputs),
    [inputs]
  );

  const update = <K extends keyof TikTokInputs>(key: K, value: TikTokInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isNegative = result.netProfit < 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <KpiCard
          label="Gross Revenue"
          value={`$${result.grossRevenue.toFixed(2)}`}
          subValue={result.grossRevenue === 0 ? "Item selling price" : "Retail selling price"}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          label="Total Hidden Fees"
          value={`$${result.totalFees.toFixed(2)}`}
          subValue={
            result.grossRevenue === 0
              ? "Awaiting item price"
              : `${((result.totalFees / (result.grossRevenue || 1)) * 100).toFixed(1)}% of price`
          }
          icon={<TrendingDown className="w-4 h-4" />}
          negative={result.totalFees > 0}
        />
        <KpiCard
          label="Net Profit"
          value={`${isNegative ? "-" : result.netProfit > 0 ? "+" : ""}$${Math.abs(result.netProfit).toFixed(2)}`}
          subValue={
            result.grossRevenue === 0 && result.netProfit === 0
              ? "Awaiting your price"
              : isNegative
              ? "BLEEDING PER SALE"
              : "Take-home cash"
          }
          icon={
            isNegative ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )
          }
          negative={isNegative}
        />
        <KpiCard
          label="Net Margin"
          value={`${result.netMarginPercent.toFixed(1)}%`}
          subValue={
            result.grossRevenue === 0
              ? "0.0% net margin"
              : result.netMarginPercent >= 20
              ? "Strong Margin"
              : result.netMarginPercent >= 8
              ? "Moderate"
              : "High Risk"
          }
          icon={<Percent className="w-4 h-4" />}
          negative={isNegative}
        />
        <KpiCard
          label="Break-Even ROAS"
          value={result.breakEvenRoasDisplay}
          subValue={
            result.grossRevenue === 0
              ? "Min target ROAS"
              : result.breakEvenRoas
              ? `Need ${result.breakEvenRoas.toFixed(2)}x on TikTok Ads`
              : "Losing $ before ad spend"
          }
          icon={<Target className="w-4 h-4" />}
          negative={result.grossRevenue > 0 && result.breakEvenRoas === null}
        />
      </div>

      {/* Viral Product Intelligence Tool (Hidden on Pro) */}
      <TikTokKalodataSponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Input Panel */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Store className="w-4 h-4 text-cyan-400" />
              TikTok Shop Fee Stack
            </h3>
            <span className="text-[11px] text-zinc-500 font-medium">US 2026 Engine</span>
          </div>

          <InputField
            label="Monthly Sales Volume"
            value={inputs.monthlyVolume ?? 250}
            onChange={(v) => update("monthlyVolume", Math.max(1, Math.round(v)))}
            min={1}
            max={10000}
            step={25}
            prefix=""
            suffix=" units"
            presets={[50, 100, 250, 500, 1000]}
            hint="Estimated monthly units sold for revenue &amp; profit totals"
          />

          <InputField
            label="Selling Price"
            value={inputs.sellingPrice}
            onChange={(v) => update("sellingPrice", v)}
            max={300}
            step={1}
            presets={[19, 29, 39, 49, 79]}
            hint="Customer purchase price"
          />

          <InputField
            label="Cost of Goods (COGS)"
            value={inputs.cogs}
            onChange={(v) => update("cogs", v)}
            max={150}
            step={0.5}
            presets={[4, 8, 12, 20]}
            hint="Product cost"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Seller Shipping Cost"
              value={inputs.shippingCost}
              onChange={(v) => update("shippingCost", v)}
              max={30}
              step={0.5}
              presets={[3.5, 5.0, 7.5]}
              hint="Fulfillment postage"
            />
            <InputField
              label="Packaging Cost"
              value={inputs.packagingCost}
              onChange={(v) => update("packagingCost", v)}
              max={15}
              step={0.25}
              presets={[0.5, 1.0, 1.5]}
              hint="Boxes and flyers"
            />
          </div>

          <InputField
            label="Labor &amp; Misc Overhead"
            value={inputs.miscCost ?? 0}
            onChange={(v) => update("miscCost", v)}
            max={50}
            step={0.5}
            presets={[0, 2, 5, 10]}
            hint="Order prep labor, helper wages, or unboxing gifts"
          />

          <InputField
            label="Creator Affiliate Commission"
            value={inputs.affiliateCommissionRate * 100}
            onChange={(v) => update("affiliateCommissionRate", v / 100)}
            min={0}
            max={50}
            step={1}
            prefix=""
            suffix="%"
            presets={[5, 10, 15, 20]}
            hint="Commission paid to TikTok creators per sale"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Ad Spend / CAC per Sale"
              value={inputs.adSpendPerSale}
              onChange={(v) => update("adSpendPerSale", v)}
              max={30}
              step={0.5}
              presets={[0, 2, 5, 8]}
              hint="Paid TikTok Ads CAC"
            />
            <InputField
              label="Return &amp; Damage Buffer"
              value={inputs.returnRate * 100}
              onChange={(v) => update("returnRate", v / 100)}
              min={0}
              max={25}
              step={0.5}
              prefix=""
              suffix="%"
              presets={[3, 5, 8]}
              hint="Expected % returned items"
            />
          </div>
        </div>

        {/* Waterfall Chart */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider">
                TikTok Profit Waterfall
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isNegative
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : result.grossRevenue === 0
                    ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                }`}
              >
                {isNegative ? "BLEEDING MARGIN" : result.grossRevenue === 0 ? "AWAITING INPUT" : "PROFITABLE"}
              </span>
            </div>
            <WaterfallChart steps={result.waterfallSteps} />
          </div>

          <FeeBreakdownTable
            rows={[
              {
                label: "Base Referral Fee (6%)",
                value: result.referralFee,
                note: "6.0% platform fee",
              },
              {
                label: `Creator Affiliate (${(inputs.affiliateCommissionRate * 100).toFixed(0)}%)`,
                value: result.affiliateCommission,
                note: "Influencer commission",
              },
              {
                label: "Payment Processing (2.9% + $0.30)",
                value: result.paymentProcessingFee,
                note: "Standard processing",
              },
              { label: "Ad Spend / CAC", value: result.adSpend, note: "Paid customer acquisition" },
              {
                label: `Return Buffer (${(inputs.returnRate * 100).toFixed(0)}%)`,
                value: result.returnLoss,
                note: "Return shrinkage reserve",
              },
              { label: "Cost of Goods (COGS)", value: inputs.cogs, isCost: true },
              { label: "Shipping Cost", value: inputs.shippingCost, isCost: true },
              { label: "Packaging Cost", value: inputs.packagingCost, isCost: true },
              ...(inputs.miscCost && inputs.miscCost > 0
                ? [{ label: "Labor & Misc Overhead", value: inputs.miscCost, isCost: true, note: "Time / helper pay" }]
                : []),
            ]}
            totalFees={result.totalFees}
            totalCosts={result.totalCosts}
            netProfit={result.netProfit}
          />
        </div>
      </div>

      {/* Monthly Business Projections Card */}
      <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Monthly Business Projections
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                  {inputs.monthlyVolume || 250} Orders/Mo
                </span>
              </h4>
              <p className="text-[11px] text-zinc-400">
                Projected monthly revenue, take-home profit, and minimum target ROAS for your ads.
              </p>
            </div>
          </div>

          {/* Quick Volume Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-zinc-500 font-medium whitespace-nowrap">Volume:</span>
            {[50, 100, 250, 500, 1000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => update("monthlyVolume", v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  inputs.monthlyVolume === v
                    ? "bg-cyan-500 text-black shadow-xs font-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Revenue</span>
            <span className="text-base sm:text-lg font-black text-white tabular-nums">
              ${result.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Net Profit</span>
            <span className={`text-base sm:text-lg font-black tabular-nums ${result.monthlyNetProfit > 0 ? "text-emerald-400" : result.monthlyNetProfit < 0 ? "text-rose-400" : "text-zinc-300"}`}>
              {result.monthlyNetProfit > 0 ? "+" : ""}${result.monthlyNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly TikTok Fees</span>
            <span className="text-base sm:text-lg font-bold text-zinc-300 tabular-nums">
              ${result.monthlyTotalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Break-Even ROAS</span>
            <span className={`text-base sm:text-lg font-black tabular-nums ${result.breakEvenRoas ? "text-cyan-400" : "text-zinc-400"}`}>
              {result.breakEvenRoasDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Return & Cancellation Loss Scenario */}
      <ReturnClawbackCard
        clawbackAmount={result.returnClawbackLoss}
        platformName="TikTok Shop"
        explanation="Estimated unrecoverable cash loss if a customer returns this item (unrefunded platform admin retention, lost outbound carrier shipping, destroyed packaging, and ~15% return inspection loss)."
      />

      {/* Zero-Inventory POD Supplier */}
      <TikTokPrintifySponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />

      {/* Seller Traps & Real Answers FAQ Accordion */}
      <SellerFaqAccordion platform="tiktok" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  AMAZON (FBA / FBM) TAB
// ═══════════════════════════════════════════════════════════════

function AmazonTab({ isPro, onOpenProModal }: { isPro: boolean; onOpenProModal: () => void }) {
  const [inputs, setInputs] = useState<AmazonInputs>(DEFAULT_AMAZON_INPUTS);

  const result: AmazonResult = useMemo(
    () => calculateAmazonProfit(inputs),
    [inputs]
  );

  const update = <K extends keyof AmazonInputs>(key: K, value: AmazonInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isNegative = result.netProfit < 0;
  const isFba = inputs.fulfillmentMode === "fba";

  return (
    <div className="space-y-6">
      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          label="Gross Revenue"
          value={`$${result.grossRevenue.toFixed(2)}`}
          subValue={result.grossRevenue === 0 ? "Item selling price" : isFba ? "FBA Retail Price" : "Price + Shipping"}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          label="Total Amazon Fees"
          value={`$${result.totalFees.toFixed(2)}`}
          subValue={
            result.grossRevenue === 0
              ? "Awaiting item price"
              : `${((result.totalFees / (result.grossRevenue || 1)) * 100).toFixed(1)}% of price`
          }
          icon={<TrendingDown className="w-4 h-4" />}
          negative={result.totalFees > 0}
        />
        <KpiCard
          label="Net Profit"
          value={`${isNegative ? "-" : result.netProfit > 0 ? "+" : ""}$${Math.abs(result.netProfit).toFixed(2)}`}
          subValue={
            result.grossRevenue === 0 && result.netProfit === 0
              ? "Awaiting your price"
              : isNegative
              ? "BLEEDING PER UNIT"
              : "Take-home cash"
          }
          icon={
            isNegative ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )
          }
          negative={isNegative}
        />
        <KpiCard
          label="Net Margin"
          value={`${result.netMarginPercent.toFixed(1)}%`}
          subValue={
            result.grossRevenue === 0
              ? "0.0% net margin"
              : result.netMarginPercent >= 25
              ? "Strong Margin"
              : result.netMarginPercent >= 12
              ? "Healthy Margin"
              : "Thin / At Risk"
          }
          icon={<Percent className="w-4 h-4" />}
          negative={isNegative}
        />
        <KpiCard
          label="Break-Even ACoS"
          value={result.breakEvenAcosDisplay}
          subValue={
            result.grossRevenue === 0
              ? "Target PPC ACoS"
              : result.breakEvenAcosPercent !== null
              ? `Keep PPC under ${result.breakEvenAcosPercent.toFixed(1)}%`
              : "Losing money before ads"
          }
          icon={<Target className="w-4 h-4" />}
          negative={result.grossRevenue > 0 && result.breakEvenAcosPercent === null}
        />
        <KpiCard
          label="Break-Even ROAS"
          value={result.breakEvenRoasDisplay}
          subValue={
            result.grossRevenue === 0
              ? "Target PPC ROAS"
              : result.breakEvenRoas !== null
              ? `Need ${result.breakEvenRoas.toFixed(2)}x on Amazon PPC`
              : "Losing money before ads"
          }
          icon={<Target className="w-4 h-4" />}
          negative={result.grossRevenue > 0 && result.breakEvenRoas === null}
        />
      </div>

      {/* Helium 10 Intelligence Sponsor Card */}
      <AmazonHelium10SponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Input Panel */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-400" />
              Amazon Fee Parameters
            </h3>
            <span className="text-[11px] text-zinc-500 font-medium">US 2026 Schedule</span>
          </div>

          {/* FBA vs FBM Toggle Switch */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
            <label className="text-xs font-semibold text-zinc-200">
              Fulfillment Program
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => update("fulfillmentMode", "fba")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isFba
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950/40 border border-amber-500/40"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <Box className="w-4 h-4" />
                <span>FBA (Amazon Ships)</span>
              </button>
              <button
                type="button"
                onClick={() => update("fulfillmentMode", "fbm")}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  !isFba
                    ? "bg-amber-600 text-white shadow-md shadow-amber-950/40 border border-amber-500/40"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                }`}
              >
                <Truck className="w-4 h-4" />
                <span>FBM (Seller Ships)</span>
              </button>
            </div>
          </div>

          <InputField
            label="Monthly Sales Volume"
            value={inputs.monthlyVolume ?? 250}
            onChange={(v) => update("monthlyVolume", Math.max(1, Math.round(v)))}
            min={1}
            max={10000}
            step={25}
            prefix=""
            suffix=" units"
            presets={[50, 100, 250, 500, 1000]}
            hint="Estimated monthly units sold for business totals"
          />

          <InputField
            label="Item Selling Price"
            value={inputs.sellingPrice}
            onChange={(v) => update("sellingPrice", v)}
            max={500}
            step={1}
            presets={[19.99, 29.99, 39.99, 49.99, 79.99]}
            hint="Customer retail price on Amazon"
          />

          <InputField
            label="Cost of Goods (COGS)"
            value={inputs.cogs}
            onChange={(v) => update("cogs", v)}
            max={200}
            step={0.5}
            presets={[3.5, 6.5, 12.0, 20.0]}
            hint="Landed manufacturer &amp; freight cost per unit"
          />

          {/* Amazon Category Referral Fee Selector */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-200">
                Category Referral Fee Rate
              </label>
              <span className="text-[11px] font-bold text-amber-400">
                {(inputs.referralFeeRate * 100).toFixed(0)}%
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "15% Standard", rate: 0.15, note: "Home/Beauty" },
                { label: "8% Electronics", rate: 0.08, note: "Under $100" },
                { label: "17% Apparel", rate: 0.17, note: "Clothing" },
                { label: "12% Auto/Tools", rate: 0.12, note: "Industrial" },
              ].map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => update("referralFeeRate", cat.rate)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    inputs.referralFeeRate === cat.rate
                      ? "bg-amber-600 text-white shadow-md shadow-amber-950/40 border border-amber-500/40"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  <div>{cat.label}</div>
                  <div className="text-[9px] font-normal opacity-80 mt-0.5">
                    {cat.note}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* FBA Specific Inputs */}
          {isFba ? (
            <>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-zinc-200">
                    FBA Pick &amp; Pack Size Tier
                  </label>
                  <span className="text-[11px] font-bold text-amber-400">
                    ${inputs.fbaFee.toFixed(2)} / unit
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Small Std (≤16 oz)", fee: 3.22 },
                    { label: "Large Std (≤16 oz)", fee: 3.86 },
                    { label: "Large Std (1-2 lb)", fee: 4.75 },
                    { label: "Large Std (2-3 lb)", fee: 5.40 },
                  ].map((tier) => (
                    <button
                      key={tier.label}
                      type="button"
                      onClick={() => update("fbaFee", tier.fee)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        inputs.fbaFee === tier.fee
                          ? "bg-amber-600 text-white shadow-md border border-amber-500/40"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      <div>{tier.label}</div>
                      <div className="text-[10px] font-normal opacity-80 mt-0.5">
                        ${tier.fee.toFixed(2)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <InputField
                label="Storage &amp; Inbound Placement Buffer"
                value={inputs.storageAndInboundFee}
                onChange={(v) => update("storageAndInboundFee", v)}
                max={5}
                step={0.05}
                presets={[0.35, 0.65, 1.25]}
                hint="Estimated monthly warehouse storage &amp; 2026 inbound placement fees"
              />

              {/* 2026 Inventory & Seasonal Surcharges (FBA) */}
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-200">
                    2026 Inventory &amp; Seasonal Surcharges
                  </label>
                  <span className="text-[10px] text-zinc-500">Official Schedule</span>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={inputs.isQ4StorageSurge ?? false}
                        onChange={(e) => update("isQ4StorageSurge", e.target.checked)}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-zinc-200">
                          Q4 Holiday Storage Surge
                        </span>
                        <span className="block text-[10px] text-zinc-400">
                          Oct–Dec peak warehouse rates (~$0.85/unit)
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">+$0.85</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={inputs.hasLowInventoryFee ?? false}
                        onChange={(e) => update("hasLowInventoryFee", e.target.checked)}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-zinc-200">
                          Low-Inventory-Level Fee
                        </span>
                        <span className="block text-[10px] text-zinc-400">
                          Stock &lt; 28 historical days of supply (~$0.45/unit)
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">+$0.45</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 cursor-pointer transition-colors">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={inputs.isHighReturnCategory ?? false}
                        onChange={(e) => update("isHighReturnCategory", e.target.checked)}
                        className="rounded border-zinc-700 text-amber-500 focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-zinc-200">
                          Apparel &amp; Shoes Returns Fee
                        </span>
                        <span className="block text-[10px] text-zinc-400">
                          High-return customer processing fee (~$1.85)
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400">+$1.85</span>
                  </label>
                </div>
              </div>
            </>
          ) : (
            /* FBM Specific Inputs */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InputField
                label="Shipping Charged to Buyer"
                value={inputs.shippingCharged}
                onChange={(v) => update("shippingCharged", v)}
                max={50}
                step={0.5}
                presets={[0, 4.99, 7.99]}
                hint="Charged to buyer ($0 if free shipping)"
              />
              <InputField
                label="Actual Postage Paid by Seller"
                value={inputs.actualShippingCost}
                onChange={(v) => update("actualShippingCost", v)}
                max={50}
                step={0.5}
                presets={[4.5, 5.5, 8.5]}
                hint="Actual commercial postage cost"
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Packaging / FNSKU Prep"
              value={inputs.packagingCost}
              onChange={(v) => update("packagingCost", v)}
              max={15}
              step={0.25}
              presets={[0.5, 0.75, 1.25]}
              hint="Polybag, barcode label, box"
            />
            <InputField
              label="Amazon PPC Ad Spend / CAC"
              value={inputs.adSpendPerSale}
              onChange={(v) => update("adSpendPerSale", v)}
              max={50}
              step={0.5}
              presets={[0, 2.5, 3.5, 6.0]}
              hint="Sponsored products spend per unit"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Return &amp; Damage Reserve"
              value={inputs.returnRate * 100}
              onChange={(v) => update("returnRate", v / 100)}
              min={0}
              max={25}
              step={0.5}
              prefix=""
              suffix="%"
              presets={[2, 3, 5, 8]}
              hint="Customer return rate reserve"
            />
            <InputField
              label="Labor &amp; Misc Overhead"
              value={inputs.miscCost ?? 0}
              onChange={(v) => update("miscCost", v)}
              max={50}
              step={0.5}
              presets={[0, 1.5, 3.0]}
              hint="Prep center fee or assistant pay"
            />
          </div>
        </div>

        {/* Waterfall Chart & Table */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider">
                Amazon Profit Waterfall
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isNegative
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : result.grossRevenue === 0
                    ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                }`}
              >
                {isNegative ? "BLEEDING MARGIN" : result.grossRevenue === 0 ? "AWAITING INPUT" : "PROFITABLE"}
              </span>
            </div>
            <WaterfallChart steps={result.waterfallSteps} />
          </div>

          <FeeBreakdownTable
            rows={[
              {
                label: `Referral Fee (${(inputs.referralFeeRate * 100).toFixed(0)}%)`,
                value: result.referralFee,
                note: "Amazon category fee",
              },
              ...(isFba
                ? [
                    {
                      label: "FBA Pick & Pack Fee",
                      value: result.fulfillmentFee,
                      note: "Weight/size handling",
                    },
                    {
                      label: "Storage & Inbound Placement",
                      value: result.storageAndInboundFee,
                      note: "Warehouse buffer",
                    },
                    ...(result.q4StorageSurgeFee > 0
                      ? [
                          {
                            label: "Q4 Holiday Storage Surge",
                            value: result.q4StorageSurgeFee,
                            note: "Peak warehouse rate",
                          },
                        ]
                      : []),
                    ...(result.lowInventoryFee > 0
                      ? [
                          {
                            label: "Low-Inventory-Level Fee",
                            value: result.lowInventoryFee,
                            note: "<28 days historical supply",
                          },
                        ]
                      : []),
                  ]
                : [
                    {
                      label: "Actual Shipping (FBM)",
                      value: inputs.actualShippingCost,
                      isCost: true,
                      note: "Seller postage",
                    },
                  ]),
              ...(result.returnsProcessingFee > 0
                ? [
                    {
                      label: "Returns Processing Fee",
                      value: result.returnsProcessingFee,
                      note: "Apparel & shoes category fee",
                    },
                  ]
                : []),
              { label: "Amazon PPC Ad Spend", value: result.adSpend, note: "Advertising CAC" },
              {
                label: `Return & Unsellable Reserve (${(inputs.returnRate * 100).toFixed(0)}%)`,
                value: result.returnLoss,
                note: "Damage shrinkage",
              },
              { label: "Cost of Goods (COGS)", value: inputs.cogs, isCost: true },
              { label: "Packaging & Labels", value: inputs.packagingCost, isCost: true },
              ...(inputs.miscCost && inputs.miscCost > 0
                ? [{ label: "Prep Center & Misc", value: inputs.miscCost, isCost: true }]
                : []),
            ]}
            totalFees={result.totalFees}
            totalCosts={result.totalCosts}
            netProfit={result.netProfit}
          />
        </div>
      </div>

      {/* Monthly Business Projections Card */}
      <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Monthly Business Projections
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/60">
                  {inputs.monthlyVolume || 250} Units/Mo
                </span>
              </h4>
              <p className="text-[11px] text-zinc-400">
                Projected monthly revenue, take-home profit, and maximum allowable PPC targets.
              </p>
            </div>
          </div>

          {/* Quick Volume Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-zinc-500 font-medium whitespace-nowrap">Volume:</span>
            {[50, 100, 250, 500, 1000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => update("monthlyVolume", v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  inputs.monthlyVolume === v
                    ? "bg-amber-500 text-black shadow-xs font-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Revenue</span>
            <span className="text-base sm:text-lg font-black text-white tabular-nums">
              ${result.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Net Profit</span>
            <span className={`text-base sm:text-lg font-black tabular-nums ${result.monthlyNetProfit > 0 ? "text-emerald-400" : result.monthlyNetProfit < 0 ? "text-rose-400" : "text-zinc-300"}`}>
              {result.monthlyNetProfit > 0 ? "+" : ""}${result.monthlyNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Amazon Fees</span>
            <span className="text-base sm:text-lg font-bold text-zinc-300 tabular-nums">
              ${result.monthlyTotalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Break-Even ACoS</span>
            <span className={`text-base sm:text-lg font-black tabular-nums ${result.breakEvenAcosPercent !== null ? "text-amber-400" : "text-zinc-400"}`}>
              {result.breakEvenAcosDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Return & Cancellation Loss Scenario */}
      <ReturnClawbackCard
        clawbackAmount={result.returnClawbackLoss}
        platformName="Amazon FBA"
        explanation="Estimated unrecoverable cash loss if an Amazon buyer returns this item (Amazon retains 20% referral holdback up to $5, keeps FBA Pick & Pack fee, charges returns processing for apparel/shoes, plus packaging & unfulfillable inventory shrinkage)."
      />

      {/* Jungle Scout Supplier & Sales Estimator */}
      <AmazonJungleScoutSponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />

      {/* Seller Traps & Real Answers FAQ Accordion */}
      <SellerFaqAccordion platform="amazon" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  EBAY CALCULATOR TAB
// ═══════════════════════════════════════════════════════════════

function EbayTab({ isPro, onOpenProModal }: { isPro: boolean; onOpenProModal: () => void }) {
  const [inputs, setInputs] = useState<EbayInputs>(DEFAULT_EBAY_INPUTS);

  const result: EbayResult = useMemo(
    () => calculateEbayProfit(inputs),
    [inputs]
  );

  const update = <K extends keyof EbayInputs>(key: K, value: EbayInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isNegative = result.netProfit < 0;

  return (
    <div className="space-y-6">
      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          label="Gross Revenue"
          value={`$${result.grossRevenue.toFixed(2)}`}
          subValue={result.grossRevenue === 0 ? "Item selling price" : "Price + Shipping"}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          label="Total eBay Fees"
          value={`$${result.totalFees.toFixed(2)}`}
          subValue={
            result.grossRevenue === 0
              ? "Awaiting item price"
              : `${((result.totalFees / (result.grossRevenue || 1)) * 100).toFixed(1)}% of price`
          }
          icon={<TrendingDown className="w-4 h-4" />}
          negative={result.totalFees > 0}
        />
        <KpiCard
          label="Net Profit"
          value={`${isNegative ? "-" : result.netProfit > 0 ? "+" : ""}$${Math.abs(result.netProfit).toFixed(2)}`}
          subValue={
            result.grossRevenue === 0 && result.netProfit === 0
              ? "Awaiting your price"
              : isNegative
              ? "BLEEDING PER UNIT"
              : "Take-home cash"
          }
          icon={
            isNegative ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )
          }
          negative={isNegative}
        />
        <KpiCard
          label="Net Margin"
          value={`${result.netMarginPercent.toFixed(1)}%`}
          subValue={
            result.grossRevenue === 0
              ? "0.0% net margin"
              : result.netMarginPercent >= 25
              ? "Strong Margin"
              : result.netMarginPercent >= 12
              ? "Healthy Margin"
              : "Thin / At Risk"
          }
          icon={<Percent className="w-4 h-4" />}
          negative={isNegative}
        />
        <KpiCard
          label="Break-Even ROAS"
          value={result.breakEvenRoasDisplay}
          subValue={
            result.grossRevenue === 0
              ? "Target Ad ROAS"
              : result.breakEvenRoas !== null
              ? "Min Promoted Ad Return"
              : "Losing money before ads"
          }
          icon={<Target className="w-4 h-4" />}
          negative={result.grossRevenue > 0 && result.breakEvenRoas === null}
        />
        <KpiCard
          label="Final Value Fee"
          value={`$${result.finalValueFee.toFixed(2)}`}
          subValue={`${(inputs.finalValueFeeRate * 100).toFixed(2)}% on total sale`}
          icon={<Tag className="w-4 h-4" />}
        />
      </div>

      {/* ZIK Analytics Sponsor Card */}
      <EbayZikAnalyticsSponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Input Panel */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4 text-blue-400" />
              eBay Fee Parameters
            </h3>
            <span className="text-[11px] text-zinc-500 font-medium">Standard Schedule</span>
          </div>

          <InputField
            label="Monthly Sales Volume"
            value={inputs.monthlyVolume ?? 250}
            onChange={(v) => update("monthlyVolume", Math.max(1, Math.round(v)))}
            min={1}
            max={10000}
            step={25}
            prefix=""
            suffix=" orders"
            presets={[50, 100, 250, 500, 1000]}
            hint="Estimated monthly units sold for business totals"
          />

          <InputField
            label="Item Selling Price"
            value={inputs.sellingPrice}
            onChange={(v) => update("sellingPrice", v)}
            max={500}
            step={1}
            presets={[19.99, 29.99, 39.99, 49.99, 79.99]}
            hint="Retail buy-it-now or winning auction bid"
          />

          <InputField
            label="Cost of Goods (COGS)"
            value={inputs.cogs}
            onChange={(v) => update("cogs", v)}
            max={200}
            step={0.5}
            presets={[3.5, 6.5, 12.0, 20.0]}
            hint="Inventory acquisition cost per unit"
          />

          {/* eBay Category FVF Selector */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-200">
                Final Value Fee (FVF) Category
              </label>
              <span className="text-[11px] font-bold text-blue-400">
                {(inputs.finalValueFeeRate * 100).toFixed(2)}% + 30¢
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "13.25% Standard", rate: 0.1325, note: "Most Items" },
                { label: "9.35% Guitars", rate: 0.0935, note: "Instruments" },
                { label: "15.0% Jewelry", rate: 0.15, note: "Watches" },
                { label: "12.35% Media", rate: 0.1235, note: "Books/Movies" },
              ].map((cat) => (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => update("finalValueFeeRate", cat.rate)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    inputs.finalValueFeeRate === cat.rate
                      ? "bg-blue-600 text-white shadow-md border border-blue-500/40"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  <div>{cat.label}</div>
                  <div className="text-[9px] font-normal opacity-80 mt-0.5">
                    {cat.note}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Shipping Charged to Buyer"
              value={inputs.shippingCharged}
              onChange={(v) => update("shippingCharged", v)}
              max={50}
              step={0.5}
              presets={[0, 4.99, 7.99]}
              hint="Amount buyer pays ($0 if Free Shipping)"
            />
            <InputField
              label="Actual Shipping Paid by Seller"
              value={inputs.actualShippingCost}
              onChange={(v) => update("actualShippingCost", v)}
              max={50}
              step={0.5}
              presets={[4.2, 5.5, 8.5]}
              hint="USPS Ground Advantage / UPS label cost"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Packaging &amp; Mailer"
              value={inputs.packagingCost}
              onChange={(v) => update("packagingCost", v)}
              max={15}
              step={0.25}
              presets={[0.5, 0.75, 1.25]}
              hint="Bubble mailer, tape, label paper"
            />
            <InputField
              label="Promoted Listings Standard Ad %"
              value={inputs.promotedListingRate * 100}
              onChange={(v) => update("promotedListingRate", v / 100)}
              min={0}
              max={25}
              step={0.5}
              prefix=""
              suffix="%"
              presets={[0, 2, 3, 5, 8]}
              hint="Optional cost-per-sale ad rate"
            />
          </div>

          {/* eBay Store Tier Selector */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-200">
                eBay Store Subscription
              </label>
              <span className="text-[11px] font-bold text-blue-400">
                ${inputs.storeSubscriptionMonthlyCost.toFixed(2)}/mo
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { label: "No Store ($0)", cost: 0, note: "250 Free Listings" },
                { label: "Starter ($4.95)", cost: 4.95, note: "Starter Shop" },
                { label: "Basic ($21.95)", cost: 21.95, note: "1,000 Listings" },
                { label: "Premium ($59.95)", cost: 59.95, note: "10,000 Listings" },
              ].map((tier) => (
                <button
                  key={tier.label}
                  type="button"
                  onClick={() => update("storeSubscriptionMonthlyCost", tier.cost)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    inputs.storeSubscriptionMonthlyCost === tier.cost
                      ? "bg-blue-600 text-white shadow-md border border-blue-500/40"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  <div>{tier.label}</div>
                  <div className="text-[9px] font-normal opacity-80 mt-0.5">
                    {tier.note}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Return &amp; Dispute Reserve"
              value={inputs.returnRate * 100}
              onChange={(v) => update("returnRate", v / 100)}
              min={0}
              max={20}
              step={0.5}
              prefix=""
              suffix="%"
              presets={[1, 3, 5]}
              hint="Buffer for remorse returns &amp; damage"
            />
            <InputField
              label="Labor &amp; Misc Overhead"
              value={inputs.miscCost ?? 0}
              onChange={(v) => update("miscCost", v)}
              max={50}
              step={0.5}
              presets={[0, 1.0, 2.5]}
              hint="Labor, listing helper, or storage"
            />
          </div>
        </div>

        {/* Waterfall Chart & Table */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider">
                eBay Profit Waterfall
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  result.grossRevenue === 0
                    ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    : isNegative
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                }`}
              >
                {result.grossRevenue === 0 ? "AWAITING INPUT" : isNegative ? "BLEEDING MARGIN" : "PROFITABLE"}
              </span>
            </div>
            <WaterfallChart steps={result.waterfallSteps} />
          </div>

          <FeeBreakdownTable
            rows={[
              {
                label: `Final Value Fee (${(inputs.finalValueFeeRate * 100).toFixed(2)}%)`,
                value: result.finalValueFee,
                note: "Applied to total sale (item + shipping)",
              },
              {
                label: "Order Per-Sale Fee",
                value: result.orderPerSaleFee,
                note: "Fixed $0.30 per completed order",
              },
              ...(result.promotedListingFee > 0
                ? [
                    {
                      label: `Promoted Listings (${(inputs.promotedListingRate * 100).toFixed(1)}%)`,
                      value: result.promotedListingFee,
                      note: "Cost-per-sale ad fee",
                    },
                  ]
                : []),
              ...(result.storeFeePerUnit > 0
                ? [
                    {
                      label: "Store Subscription",
                      value: result.storeFeePerUnit,
                      note: "Monthly store amortized",
                    },
                  ]
                : []),
              {
                label: `Return & Dispute Reserve (${(inputs.returnRate * 100).toFixed(0)}%)`,
                value: result.returnLoss,
                note: "Reserve for lost shipping & disputes",
              },
              { label: "Cost of Goods (COGS)", value: inputs.cogs, isCost: true },
              { label: "Outbound Shipping", value: inputs.actualShippingCost, isCost: true },
              { label: "Packaging & Mailers", value: inputs.packagingCost, isCost: true },
              ...(inputs.miscCost && inputs.miscCost > 0
                ? [{ label: "Labor & Overhead", value: inputs.miscCost, isCost: true }]
                : []),
            ]}
            totalFees={result.totalFees}
            totalCosts={result.totalCosts}
            netProfit={result.netProfit}
          />
        </div>
      </div>

      {/* Monthly Business Projections Card */}
      <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 text-blue-400 border border-blue-800/60 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Monthly eBay Business Projections
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-950 text-blue-400 border border-blue-800/60">
                  {inputs.monthlyVolume || 250} Orders/Mo
                </span>
              </h4>
              <p className="text-[11px] text-zinc-400">
                Projected monthly revenue, take-home profit, and Promoted Listings budget.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-zinc-500 font-medium whitespace-nowrap">Volume:</span>
            {[50, 100, 250, 500, 1000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => update("monthlyVolume", v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  inputs.monthlyVolume === v
                    ? "bg-blue-600 text-white shadow-xs font-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Gross Sales</span>
            <span className="text-base sm:text-lg font-black text-white tabular-nums">
              ${result.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Net Profit</span>
            <span className={`text-base sm:text-lg font-black tabular-nums ${result.monthlyNetProfit > 0 ? "text-emerald-400" : result.monthlyNetProfit < 0 ? "text-rose-400" : "text-zinc-300"}`}>
              {result.monthlyNetProfit > 0 ? "+" : ""}${result.monthlyNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly eBay Fees</span>
            <span className="text-base sm:text-lg font-bold text-zinc-300 tabular-nums">
              ${result.monthlyTotalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Break-Even ROAS</span>
            <span className={`text-base sm:text-lg font-black tabular-nums ${result.breakEvenRoas !== null ? "text-blue-400" : "text-zinc-400"}`}>
              {result.breakEvenRoasDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Return & Processing Clawback Scenario */}
      <ReturnClawbackCard
        clawbackAmount={result.returnClawbackLoss}
        platformName="eBay"
        explanation="Estimated unrecoverable cash loss if an eBay buyer requests a return (eBay retains the $0.30 per-order fee, seller loses shipping both ways on free return listings, lost packaging, and 15% estimated item restocking depreciation)."
      />

      {/* Seller Traps & Real Answers FAQ Accordion */}
      <SellerFaqAccordion platform="ebay" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHOPIFY DTC TAB
// ═══════════════════════════════════════════════════════════════

function ShopifyTab({ isPro, onOpenProModal }: { isPro: boolean; onOpenProModal: () => void }) {
  const [inputs, setInputs] = useState<ShopifyInputs>(DEFAULT_SHOPIFY_INPUTS);

  const result: ShopifyResult = useMemo(
    () => calculateShopifyProfit(inputs),
    [inputs]
  );

  const update = <K extends keyof ShopifyInputs>(key: K, value: ShopifyInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const isNegative = result.netProfit < 0;

  return (
    <div className="space-y-6">
      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          label="Gross Revenue"
          value={`$${result.grossRevenue.toFixed(2)}`}
          subValue={result.grossRevenue === 0 ? "Storefront retail price" : "Price + Shipping Charged"}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <KpiCard
          label="Total Fees & CAC"
          value={`$${result.totalFees.toFixed(2)}`}
          subValue={
            result.grossRevenue === 0
              ? "Awaiting item price"
              : `${((result.totalFees / (result.grossRevenue || 1)) * 100).toFixed(1)}% of revenue`
          }
          icon={<TrendingDown className="w-4 h-4" />}
          negative={result.totalFees > 0}
        />
        <KpiCard
          label="Net Profit"
          value={`${isNegative ? "-" : result.netProfit > 0 ? "+" : ""}$${Math.abs(result.netProfit).toFixed(2)}`}
          subValue={
            result.grossRevenue === 0 && result.netProfit === 0
              ? "Awaiting your price"
              : isNegative
              ? "BLEEDING PER UNIT"
              : "Take-home cash"
          }
          icon={
            isNegative ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <TrendingUp className="w-4 h-4" />
            )
          }
          negative={isNegative}
        />
        <KpiCard
          label="Net Margin"
          value={`${result.netMarginPercent.toFixed(1)}%`}
          subValue={
            result.grossRevenue === 0
              ? "0.0% net margin"
              : result.netMarginPercent >= 30
              ? "Strong DTC Margin"
              : result.netMarginPercent >= 15
              ? "Healthy Margin"
              : "Thin / At Risk"
          }
          icon={<Percent className="w-4 h-4" />}
          negative={isNegative}
        />
        <KpiCard
          label="Break-Even ROAS"
          value={result.breakEvenRoasDisplay}
          subValue={
            result.grossRevenue === 0
              ? "Target Meta/Google ROAS"
              : result.breakEvenRoas !== null
              ? `Keep Meta Ads > ${result.breakEvenRoas.toFixed(2)}x`
              : "Losing money before ads"
          }
          icon={<Target className="w-4 h-4" />}
          negative={result.grossRevenue > 0 && result.breakEvenRoas === null}
        />
        <KpiCard
          label="Max Allowable CAC"
          value={`$${result.maxAllowableCac.toFixed(2)}`}
          subValue={
            result.grossRevenue === 0
              ? "Max ad spend / customer"
              : result.maxAllowableCac > 0
              ? "Max ad spend / customer"
              : "Loss before advertising"
          }
          icon={<Layers className="w-4 h-4" />}
          negative={result.grossRevenue > 0 && result.maxAllowableCac <= 0}
        />
      </div>

      {/* Klaviyo Email/SMS Sponsor Card */}
      <ShopifyKlaviyoSponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Input Panel */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Shopify DTC Parameters
            </h3>
            <span className="text-[11px] text-zinc-500 font-medium">Shopify Payments</span>
          </div>

          {/* Plan Tier Selector */}
          <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-zinc-200">
                Shopify Plan Tier
              </label>
              <span className="text-[11px] font-bold text-emerald-400">
                {inputs.planTier === "basic"
                  ? "Basic ($39/mo, 2.9%+30¢)"
                  : inputs.planTier === "shopify"
                  ? "Shopify ($105/mo, 2.7%+30¢)"
                  : "Advanced ($399/mo, 2.5%+30¢)"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { tier: "basic" as const, label: "Basic ($39)", rate: "2.9% + 30¢" },
                { tier: "shopify" as const, label: "Shopify ($105)", rate: "2.7% + 30¢" },
                { tier: "advanced" as const, label: "Advanced ($399)", rate: "2.5% + 30¢" },
              ].map((p) => (
                <button
                  key={p.tier}
                  type="button"
                  onClick={() => update("planTier", p.tier)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                    inputs.planTier === p.tier
                      ? "bg-emerald-600 text-white shadow-md border border-emerald-500/40"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  <div>{p.label}</div>
                  <div className="text-[9px] font-normal opacity-80 mt-0.5">
                    {p.rate}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Third-Party Gateway Toggle */}
          <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/60 border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-colors">
            <div className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={inputs.isThirdPartyPaymentGateway ?? false}
                onChange={(e) => update("isThirdPartyPaymentGateway", e.target.checked)}
                className="rounded border-zinc-700 text-emerald-500 focus:ring-0 w-4 h-4 cursor-pointer"
              />
              <div>
                <span className="text-xs font-bold text-zinc-200">
                  Using External Payment Gateway
                </span>
                <span className="block text-[10px] text-zinc-400">
                  PayPal / Stripe / Auth.net surcharge (+2.0% Basic, +1.0% Shopify)
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-400">
              {inputs.planTier === "advanced" ? "+0.5%" : inputs.planTier === "shopify" ? "+1.0%" : "+2.0%"}
            </span>
          </label>

          <InputField
            label="Monthly Order Volume"
            value={inputs.monthlyVolume ?? 250}
            onChange={(v) => update("monthlyVolume", Math.max(1, Math.round(v)))}
            min={1}
            max={10000}
            step={25}
            prefix=""
            suffix=" orders"
            presets={[50, 100, 250, 500, 1000]}
            hint="Used to amortize monthly plan &amp; app subscription costs"
          />

          <InputField
            label="Item Selling Price"
            value={inputs.sellingPrice}
            onChange={(v) => update("sellingPrice", v)}
            max={500}
            step={1}
            presets={[24.0, 38.0, 49.0, 75.0, 120.0]}
            hint="Customer retail price on your storefront"
          />

          <InputField
            label="Cost of Goods (COGS)"
            value={inputs.cogs}
            onChange={(v) => update("cogs", v)}
            max={200}
            step={0.5}
            presets={[4.0, 9.0, 15.0, 25.0]}
            hint="Landed manufactured &amp; imported unit cost"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Shipping Charged to Buyer"
              value={inputs.shippingCharged}
              onChange={(v) => update("shippingCharged", v)}
              max={50}
              step={0.5}
              presets={[0, 4.99, 7.99]}
              hint="Shipping fee customer pays at checkout"
            />
            <InputField
              label="Actual Shipping Postage Paid"
              value={inputs.actualShippingCost}
              onChange={(v) => update("actualShippingCost", v)}
              max={50}
              step={0.5}
              presets={[4.5, 5.5, 8.5]}
              hint="Actual carrier label paid by merchant"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Meta / Google Ad CAC per Order"
              value={inputs.adSpendPerSale}
              onChange={(v) => update("adSpendPerSale", v)}
              max={100}
              step={1}
              presets={[0, 8, 12, 18, 25]}
              hint="Paid advertising cost to acquire 1 purchase"
            />
            <InputField
              label="Monthly Apps Tech Stack Cost"
              value={inputs.monthlyAppsCost}
              onChange={(v) => update("monthlyAppsCost", v)}
              max={1000}
              step={10}
              presets={[49, 89, 149, 299]}
              hint="Klaviyo, Loox, Recharge, PageFly stack"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <InputField
              label="Packaging &amp; Unboxing"
              value={inputs.packagingCost}
              onChange={(v) => update("packagingCost", v)}
              max={15}
              step={0.25}
              presets={[0.5, 0.85, 1.5, 2.5]}
              hint="Custom box, tissue paper, branded sticker"
            />
            <InputField
              label="Return &amp; Chargeback Rate"
              value={inputs.returnRate * 100}
              onChange={(v) => update("returnRate", v / 100)}
              min={0}
              max={25}
              step={0.5}
              prefix=""
              suffix="%"
              presets={[2, 4, 6, 10]}
              hint="Expected customer return percentage"
            />
          </div>

          <InputField
            label="Labor &amp; Misc Overhead"
            value={inputs.miscCost ?? 0}
            onChange={(v) => update("miscCost", v)}
            max={50}
            step={0.5}
            presets={[0, 1.5, 3.0]}
            hint="Fulfillment helper or 3PL pick/pack fee"
          />
        </div>

        {/* Waterfall Chart & Table */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider">
                Shopify Profit Waterfall
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  result.grossRevenue === 0
                    ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                    : isNegative
                    ? "bg-rose-950 text-rose-300 border border-rose-800"
                    : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                }`}
              >
                {result.grossRevenue === 0 ? "AWAITING INPUT" : isNegative ? "BLEEDING MARGIN" : "PROFITABLE"}
              </span>
            </div>
            <WaterfallChart steps={result.waterfallSteps} />
          </div>

          <FeeBreakdownTable
            rows={[
              {
                label: "Shopify Payments Fee",
                value: result.paymentProcessingFee,
                note: inputs.planTier === "advanced" ? "2.5% + 30¢" : inputs.planTier === "shopify" ? "2.7% + 30¢" : "2.9% + 30¢",
              },
              ...(result.thirdPartyGatewayFee > 0
                ? [
                    {
                      label: "3rd-Party Payment Surcharge",
                      value: result.thirdPartyGatewayFee,
                      note: "External gateway transaction fee",
                    },
                  ]
                : []),
              {
                label: "Plan Overhead (Amortized)",
                value: result.subscriptionPerUnit,
                note: `$${inputs.planTier === "advanced" ? 399 : inputs.planTier === "shopify" ? 105 : 39}/mo amortized`,
              },
              {
                label: "App Stack Overhead",
                value: result.appsPerUnit,
                note: `$${inputs.monthlyAppsCost}/mo amortized over volume`,
              },
              ...(result.adSpend > 0
                ? [
                    {
                      label: "Meta / Google Ad CAC",
                      value: result.adSpend,
                      note: "Customer acquisition cost",
                    },
                  ]
                : []),
              {
                label: `Return & Chargeback Reserve (${(inputs.returnRate * 100).toFixed(0)}%)`,
                value: result.returnLoss,
                note: "Unrefunded fees & return loss",
              },
              { label: "Cost of Goods (COGS)", value: inputs.cogs, isCost: true },
              { label: "Outbound Shipping", value: inputs.actualShippingCost, isCost: true },
              { label: "Packaging & Mailers", value: inputs.packagingCost, isCost: true },
              ...(inputs.miscCost && inputs.miscCost > 0
                ? [{ label: "Labor & Fulfillment Overhead", value: inputs.miscCost, isCost: true }]
                : []),
            ]}
            totalFees={result.totalFees}
            totalCosts={result.totalCosts}
            netProfit={result.netProfit}
          />
        </div>
      </div>

      {/* Monthly Business Projections Card */}
      <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Monthly DTC Business Projections
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                  {inputs.monthlyVolume || 250} Orders/Mo
                </span>
              </h4>
              <p className="text-[11px] text-zinc-400">
                Monthly GMV, blended net profit, tech app stack amortization, and ad spend.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[11px] text-zinc-500 font-medium whitespace-nowrap">Volume:</span>
            {[50, 100, 250, 500, 1000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => update("monthlyVolume", v)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  inputs.monthlyVolume === v
                    ? "bg-emerald-500 text-black shadow-xs font-black"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Gross Sales</span>
            <span className="text-base sm:text-lg font-black text-white tabular-nums">
              ${result.monthlyRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Monthly Net Profit</span>
            <span className={`text-base sm:text-lg font-black tabular-nums ${result.monthlyNetProfit > 0 ? "text-emerald-400" : result.monthlyNetProfit < 0 ? "text-rose-400" : "text-zinc-300"}`}>
              {result.monthlyNetProfit > 0 ? "+" : ""}${result.monthlyNetProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Processing &amp; Tech Stack</span>
            <span className="text-base sm:text-lg font-bold text-zinc-300 tabular-nums">
              ${result.monthlyTotalFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Break-Even ROAS</span>
            <span className={`text-base sm:text-lg font-black tabular-nums ${result.breakEvenRoas !== null ? "text-emerald-400" : "text-zinc-400"}`}>
              {result.breakEvenRoasDisplay}
            </span>
          </div>
        </div>
      </div>

      {/* Return & Processing Clawback Scenario */}
      <ReturnClawbackCard
        clawbackAmount={result.returnClawbackLoss}
        platformName="Shopify DTC"
        explanation="Estimated unrecoverable cash loss when a DTC customer returns an order (Shopify Payments NEVER refunds credit card interchange fees [2.9% + 30¢] upon customer refunds, plus merchant pays outbound & return shipping labels, lost packaging, and 15% restocking damage)."
      />

      {/* Seller Traps & Real Answers FAQ Accordion */}
      <SellerFaqAccordion platform="shopify" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  REVERSE CALCULATOR TAB
// ═══════════════════════════════════════════════════════════════

interface ReverseTabProps {
  platform: "etsy" | "tiktok" | "amazon" | "ebay" | "shopify";
  isPro: boolean;
  onOpenProModal: () => void;
}

function ReverseTab({ platform, isPro, onOpenProModal }: ReverseTabProps) {
  const [etsyInputs, setEtsyInputs] = useState<ReverseCalcInputs>(DEFAULT_REVERSE_INPUTS);
  const [tiktokInputs, setTiktokInputs] = useState<ReverseTikTokInputs>(DEFAULT_REVERSE_TIKTOK_INPUTS);
  const [amazonInputs, setAmazonInputs] = useState<ReverseAmazonInputs>(DEFAULT_REVERSE_AMAZON_INPUTS);
  const [ebayInputs, setEbayInputs] = useState<ReverseEbayInputs>(DEFAULT_REVERSE_EBAY_INPUTS);
  const [shopifyInputs, setShopifyInputs] = useState<ReverseShopifyInputs>(DEFAULT_REVERSE_SHOPIFY_INPUTS);

  const {
    name: platformName,
    badge,
    badgeColor,
    icon,
    targetMarginPercent,
    result,
    breakdownRows,
    clawbackExplanation,
  } = useMemo(() => {
    switch (platform) {
      case "tiktok": {
        const res = solveTikTokPriceForTargetMargin(tiktokInputs);
        const rows: BreakdownRow[] = [
          { label: "Referral Fee", value: res.breakdown.referralFee, note: "6.0%" },
          { label: "Payment Processing", value: res.breakdown.paymentProcessingFee, note: "2.9% + $0.30" },
          { label: "Creator Affiliate", value: res.breakdown.affiliateCommission, note: `${(tiktokInputs.affiliateCommissionRate * 100).toFixed(0)}%` },
          ...(tiktokInputs.adSpendPerSale > 0 ? [{ label: "Paid Ad Spend", value: res.breakdown.adSpend, note: "Per Sale" }] : []),
          { label: "COGS", value: tiktokInputs.cogs, isCost: true },
          { label: "Shipping Cost", value: tiktokInputs.shippingCost, isCost: true },
          { label: "Packaging", value: tiktokInputs.packagingCost, isCost: true },
          ...(tiktokInputs.miscCost ? [{ label: "Labor / Misc Overhead", value: tiktokInputs.miscCost, isCost: true }] : []),
        ];
        return {
          name: "TikTok Shop",
          badge: "US 2026 Engine",
          badgeColor: "bg-cyan-950 text-cyan-400 border-cyan-800/60",
          icon: <Store className="w-4 h-4 text-cyan-400" />,
          targetMarginPercent: tiktokInputs.targetMarginPercent,
          result: res,
          breakdownRows: rows,
          clawbackExplanation: "Estimated unrecoverable cash loss if a customer returns this item (unrefunded platform admin retention, lost outbound carrier shipping, destroyed packaging, and ~15% return inspection loss).",
        };
      }
      case "amazon": {
        const res = solveAmazonPriceForTargetMargin(amazonInputs);
        const rows: BreakdownRow[] = [
          { label: "Referral Fee", value: res.breakdown.referralFee, note: `${(amazonInputs.referralFeeRate * 100).toFixed(0)}%` },
          { label: "FBA Pick & Pack Fee", value: res.breakdown.fulfillmentFee, note: amazonInputs.fulfillmentMode === "fba" ? "FBA" : "FBM" },
          { label: "Storage & Inbound Placement", value: res.breakdown.storageAndInboundFee, note: "Monthly per unit" },
          { label: "Return & Damage Buffer", value: res.breakdown.returnLoss, note: "3.0%" },
          { label: "COGS", value: amazonInputs.cogs, isCost: true },
          ...(amazonInputs.fulfillmentMode === "fbm" ? [{ label: "Actual Postage", value: amazonInputs.actualShippingCost, isCost: true }] : []),
          { label: "Packaging", value: amazonInputs.packagingCost, isCost: true },
          ...(amazonInputs.miscCost ? [{ label: "Prep / Inbound Freight", value: amazonInputs.miscCost, isCost: true }] : []),
        ];
        return {
          name: "Amazon FBA",
          badge: "US 2026 Schedule",
          badgeColor: "bg-amber-950 text-amber-400 border-amber-800/60",
          icon: <Package className="w-4 h-4 text-amber-400" />,
          targetMarginPercent: amazonInputs.targetMarginPercent,
          result: res,
          breakdownRows: rows,
          clawbackExplanation: "Estimated unrecoverable cash loss if an Amazon buyer returns this item (Amazon retains 20% referral holdback up to $5, keeps FBA Pick & Pack fee, charges returns processing for apparel/shoes, plus packaging & unfulfillable inventory shrinkage).",
        };
      }
      case "ebay": {
        const res = solveEbayPriceForTargetMargin(ebayInputs);
        const rows: BreakdownRow[] = [
          { label: "Final Value Fee", value: res.breakdown.finalValueFee, note: `${(ebayInputs.finalValueFeeRate * 100).toFixed(2)}%` },
          { label: "Order Fixed Fee", value: res.breakdown.orderPerSaleFee, note: "$0.30 per order" },
          ...(ebayInputs.promotedListingRate > 0 ? [{ label: "Promoted Listings", value: res.breakdown.promotedListingFee, note: `${(ebayInputs.promotedListingRate * 100).toFixed(1)}%` }] : []),
          { label: "COGS", value: ebayInputs.cogs, isCost: true },
          { label: "Actual Postage", value: ebayInputs.actualShippingCost, isCost: true },
          { label: "Packaging", value: ebayInputs.packagingCost, isCost: true },
          ...(ebayInputs.miscCost ? [{ label: "Labor / Misc Overhead", value: ebayInputs.miscCost, isCost: true }] : []),
        ];
        return {
          name: "eBay",
          badge: "US 2026 Schedule",
          badgeColor: "bg-blue-950 text-blue-400 border-blue-800/60",
          icon: <Tag className="w-4 h-4 text-blue-400" />,
          targetMarginPercent: ebayInputs.targetMarginPercent,
          result: res,
          breakdownRows: rows,
          clawbackExplanation: "Estimated unrecoverable cash loss if an eBay buyer initiates a return or dispute (eBay refunds percentage FVF but retains the $0.30 fixed fee; seller pays original shipping + return shipping label on remorse/INAD claims, plus packaging and 15% restocking damage).",
        };
      }
      case "shopify": {
        const res = solveShopifyPriceForTargetMargin(shopifyInputs);
        const rows: BreakdownRow[] = [
          { label: "Shopify Payments Processing", value: res.breakdown.paymentProcessingFee, note: `${shopifyInputs.planTier.toUpperCase()} + $0.30` },
          ...(shopifyInputs.adSpendPerSale > 0 ? [{ label: "Target Ad Spend (CAC)", value: res.breakdown.adSpend, note: "Per Order" }] : []),
          { label: "Apps & Plan Overhead", value: res.breakdown.subscriptionPerUnit + res.breakdown.appsPerUnit, note: "Per Unit" },
          { label: "COGS", value: shopifyInputs.cogs, isCost: true },
          { label: "Actual Postage", value: shopifyInputs.actualShippingCost, isCost: true },
          { label: "Packaging", value: shopifyInputs.packagingCost, isCost: true },
          ...(shopifyInputs.miscCost ? [{ label: "Labor / Misc Overhead", value: shopifyInputs.miscCost, isCost: true }] : []),
        ];
        return {
          name: "Shopify DTC",
          badge: "Shopify Payments",
          badgeColor: "bg-emerald-950 text-emerald-400 border-emerald-800/60",
          icon: <Layers className="w-4 h-4 text-emerald-400" />,
          targetMarginPercent: shopifyInputs.targetMarginPercent,
          result: res,
          breakdownRows: rows,
          clawbackExplanation: "Estimated unrecoverable cash loss when a DTC customer returns an order (Shopify Payments NEVER refunds credit card interchange fees [2.9% + 30¢] upon customer refunds, plus merchant pays outbound & return shipping labels, lost packaging, and 15% restocking damage).",
        };
      }
      case "etsy":
      default: {
        const res = solveEtsyPriceForTargetMargin(etsyInputs);
        const rows: BreakdownRow[] = [
          { label: "Listing Fee", value: res.breakdown.listingFee, note: "$0.20 per item" },
          { label: "Transaction Fee", value: res.breakdown.transactionFee, note: "6.5%" },
          { label: "Payment Processing", value: res.breakdown.paymentProcessingFee, note: "3.0% + $0.25" },
          ...(etsyInputs.offsiteAdsRate > 0 ? [{ label: "Offsite Ads", value: res.breakdown.offsiteAdsFee, note: `${(etsyInputs.offsiteAdsRate * 100).toFixed(0)}%` }] : []),
          { label: "COGS", value: etsyInputs.cogs, isCost: true },
          { label: "Actual Shipping", value: etsyInputs.actualShippingCost, isCost: true },
          { label: "Packaging", value: etsyInputs.packagingCost, isCost: true },
          ...(etsyInputs.miscCost ? [{ label: "Labor / Misc Overhead", value: etsyInputs.miscCost, isCost: true }] : []),
        ];
        return {
          name: "Etsy",
          badge: "US 2026 Engine",
          badgeColor: "bg-orange-950 text-orange-400 border-orange-800/60",
          icon: <ShoppingBag className="w-4 h-4 text-orange-400" />,
          targetMarginPercent: etsyInputs.targetMarginPercent,
          result: res,
          breakdownRows: rows,
          clawbackExplanation: "Estimated unrecoverable cash loss if a buyer returns this item (lost carrier postage, non-refundable $0.20 listing fee, destroyed packaging, and ~20% restocking/damage loss).",
        };
      }
    }
  }, [platform, etsyInputs, tiktokInputs, amazonInputs, ebayInputs, shopifyInputs]);

  const isImpossible = !isFinite(result.requiredSellingPrice);

  return (
    <div className="space-y-6">
      {/* Result Hero Card */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 text-center transition-all shadow-2xl ${
          isImpossible
            ? "border-rose-500/50 bg-gradient-to-b from-rose-950/40 via-zinc-900 to-zinc-950"
            : "border-emerald-500/50 bg-gradient-to-b from-emerald-950/40 via-zinc-900 to-zinc-950"
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isImpossible ? "bg-rose-500" : "bg-emerald-500"
          }`}
        />

        {isImpossible ? (
          <div className="max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 mx-auto flex items-center justify-center border border-rose-800">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Target Margin Unachievable</h3>
            <p className="text-xs text-zinc-400">
              After {platformName} marketplace fees and production costs, this margin percentage cannot mathematically be reached. Try lowering your target margin.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-w-lg mx-auto">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800/80">
              {icon}
              <span>Recommended Retail Price ({platformName})</span>
            </div>
            <div className="text-4xl sm:text-6xl font-black text-white tracking-tight tabular-nums">
              ${result.requiredSellingPrice.toFixed(2)}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-zinc-300">
              <span className="flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Target Margin: {targetMarginPercent}%
              </span>
              <span className="text-zinc-600">&bull;</span>
              <span>
                Net Profit:{" "}
                <strong className={result.expectedProfit > 0 ? "text-emerald-400" : "text-zinc-400"}>
                  {result.expectedProfit > 0 ? "+" : ""}${result.expectedProfit.toFixed(2)}
                </strong>{" "}
                per sale
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Input Panel */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              Target Goals &amp; Cost Inputs
            </h3>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeColor}`}>
              {badge}
            </span>
          </div>

          {/* 1. ETSY INPUT CONTROLS */}
          {platform === "etsy" && (
            <>
              <InputField
                label="Desired Net Margin %"
                value={etsyInputs.targetMarginPercent}
                onChange={(v) => setEtsyInputs((p) => ({ ...p, targetMarginPercent: v }))}
                min={1}
                max={85}
                step={1}
                prefix=""
                suffix="%"
                presets={[15, 25, 35, 50]}
                hint="The exact take-home percentage you want to lock in"
              />
              <InputField
                label="Cost of Goods (COGS)"
                value={etsyInputs.cogs}
                onChange={(v) => setEtsyInputs((p) => ({ ...p, cogs: v }))}
                max={150}
                step={0.5}
                presets={[3, 5, 10, 15]}
                hint="Material or wholesale supplier cost"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Shipping Charged"
                  value={etsyInputs.shippingCharged}
                  onChange={(v) => setEtsyInputs((p) => ({ ...p, shippingCharged: v }))}
                  max={50}
                  step={0.5}
                  presets={[0, 4.99, 5.99]}
                  hint="Paid by buyer"
                />
                <InputField
                  label="Actual Shipping Cost"
                  value={etsyInputs.actualShippingCost}
                  onChange={(v) => setEtsyInputs((p) => ({ ...p, actualShippingCost: v }))}
                  max={50}
                  step={0.5}
                  presets={[3.5, 4.5, 6.0]}
                  hint="Postage you pay"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Packaging Cost"
                  value={etsyInputs.packagingCost}
                  onChange={(v) => setEtsyInputs((p) => ({ ...p, packagingCost: v }))}
                  max={15}
                  step={0.25}
                  presets={[0.5, 1.0, 1.5]}
                  hint="Materials &amp; mailers"
                />
                <InputField
                  label="Labor &amp; Misc Overhead"
                  value={etsyInputs.miscCost ?? 0}
                  onChange={(v) => setEtsyInputs((p) => ({ ...p, miscCost: v }))}
                  max={50}
                  step={0.5}
                  presets={[0, 5, 10, 20]}
                  hint="Labor &amp; overhead buffer"
                />
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
                <label className="text-xs font-semibold text-zinc-200">
                  Etsy Offsite Ads Rate Assumption
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([0, 0.12, 0.15] as const).map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setEtsyInputs((p) => ({ ...p, offsiteAdsRate: rate }))}
                      className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${
                        etsyInputs.offsiteAdsRate === rate
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      {rate === 0 ? "0% (None)" : `${(rate * 100).toFixed(0)}%`}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 2. TIKTOK SHOP INPUT CONTROLS */}
          {platform === "tiktok" && (
            <>
              <InputField
                label="Desired Net Margin %"
                value={tiktokInputs.targetMarginPercent}
                onChange={(v) => setTiktokInputs((p) => ({ ...p, targetMarginPercent: v }))}
                min={1}
                max={85}
                step={1}
                prefix=""
                suffix="%"
                presets={[15, 25, 35, 50]}
                hint="Target take-home profit margin"
              />
              <InputField
                label="Cost of Goods (COGS)"
                value={tiktokInputs.cogs}
                onChange={(v) => setTiktokInputs((p) => ({ ...p, cogs: v }))}
                max={150}
                step={0.5}
                presets={[3, 5, 10, 15]}
                hint="Product manufacturing / wholesale cost"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Shipping Cost (Seller pays)"
                  value={tiktokInputs.shippingCost}
                  onChange={(v) => setTiktokInputs((p) => ({ ...p, shippingCost: v }))}
                  max={50}
                  step={0.5}
                  presets={[3.5, 4.5, 6.0]}
                  hint="Carrier postage on TikTok Shop"
                />
                <InputField
                  label="Packaging Cost"
                  value={tiktokInputs.packagingCost}
                  onChange={(v) => setTiktokInputs((p) => ({ ...p, packagingCost: v }))}
                  max={15}
                  step={0.25}
                  presets={[0.5, 1.0, 1.5]}
                  hint="Mailers &amp; poly bags"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Creator Affiliate Commission %"
                  value={round2(tiktokInputs.affiliateCommissionRate * 100)}
                  onChange={(v) => setTiktokInputs((p) => ({ ...p, affiliateCommissionRate: v / 100 }))}
                  min={0}
                  max={50}
                  step={1}
                  prefix=""
                  suffix="%"
                  presets={[0, 10, 15, 20]}
                  hint="TikTok creator commission rate"
                />
                <InputField
                  label="Paid Ad Spend / CAC ($)"
                  value={tiktokInputs.adSpendPerSale}
                  onChange={(v) => setTiktokInputs((p) => ({ ...p, adSpendPerSale: v }))}
                  max={50}
                  step={0.5}
                  presets={[0, 3, 5, 10]}
                  hint="Target TikTok Ads CAC (optional)"
                />
              </div>
            </>
          )}

          {/* 3. AMAZON FBA INPUT CONTROLS */}
          {platform === "amazon" && (
            <>
              <InputField
                label="Desired Net Margin %"
                value={amazonInputs.targetMarginPercent}
                onChange={(v) => setAmazonInputs((p) => ({ ...p, targetMarginPercent: v }))}
                min={1}
                max={85}
                step={1}
                prefix=""
                suffix="%"
                presets={[15, 25, 35, 50]}
                hint="Target take-home profit margin"
              />
              <InputField
                label="Product Landed Cost (COGS)"
                value={amazonInputs.cogs}
                onChange={(v) => setAmazonInputs((p) => ({ ...p, cogs: v }))}
                max={150}
                step={0.5}
                presets={[4, 7, 12, 20]}
                hint="Supplier FOB + sea freight per unit"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Amazon Referral Fee Rate %"
                  value={round2(amazonInputs.referralFeeRate * 100)}
                  onChange={(v) => setAmazonInputs((p) => ({ ...p, referralFeeRate: v / 100 }))}
                  min={6}
                  max={45}
                  step={1}
                  prefix=""
                  suffix="%"
                  presets={[8, 12, 15, 17]}
                  hint="15% standard category rate"
                />
                <InputField
                  label="FBA Pick &amp; Pack Fee"
                  value={amazonInputs.fbaFee}
                  onChange={(v) => setAmazonInputs((p) => ({ ...p, fbaFee: v }))}
                  max={25}
                  step={0.1}
                  presets={[3.22, 3.86, 4.75, 5.5]}
                  hint="$3.86 standard 12oz size tier"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Storage &amp; Inbound Placement"
                  value={amazonInputs.storageAndInboundFee}
                  onChange={(v) => setAmazonInputs((p) => ({ ...p, storageAndInboundFee: v }))}
                  max={10}
                  step={0.05}
                  presets={[0.25, 0.35, 0.65, 1.0]}
                  hint="Monthly storage &amp; placement fee"
                />
                <InputField
                  label="Amazon PPC Ad Spend ($)"
                  value={amazonInputs.adSpendPerSale}
                  onChange={(v) => setAmazonInputs((p) => ({ ...p, adSpendPerSale: v }))}
                  max={50}
                  step={0.5}
                  presets={[0, 3, 5, 8]}
                  hint="Sponsored Products spend / unit"
                />
              </div>
            </>
          )}

          {/* 4. EBAY INPUT CONTROLS */}
          {platform === "ebay" && (
            <>
              <InputField
                label="Desired Net Margin %"
                value={ebayInputs.targetMarginPercent}
                onChange={(v) => setEbayInputs((p) => ({ ...p, targetMarginPercent: v }))}
                min={1}
                max={85}
                step={1}
                prefix=""
                suffix="%"
                presets={[15, 25, 35, 50]}
                hint="Target take-home profit margin"
              />
              <InputField
                label="Cost of Goods (COGS)"
                value={ebayInputs.cogs}
                onChange={(v) => setEbayInputs((p) => ({ ...p, cogs: v }))}
                max={150}
                step={0.5}
                presets={[3, 7, 12, 20]}
                hint="Item purchase / sourcing cost"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Shipping Charged"
                  value={ebayInputs.shippingCharged}
                  onChange={(v) => setEbayInputs((p) => ({ ...p, shippingCharged: v }))}
                  max={50}
                  step={0.5}
                  presets={[0, 4.99, 5.99]}
                  hint="Buyer pays"
                />
                <InputField
                  label="Actual Postage Cost"
                  value={ebayInputs.actualShippingCost}
                  onChange={(v) => setEbayInputs((p) => ({ ...p, actualShippingCost: v }))}
                  max={50}
                  step={0.5}
                  presets={[3.5, 5.0, 7.5]}
                  hint="Postage you pay"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Category FVF Fee Rate %"
                  value={round2(ebayInputs.finalValueFeeRate * 100)}
                  onChange={(v) => setEbayInputs((p) => ({ ...p, finalValueFeeRate: v / 100 }))}
                  min={3}
                  max={20}
                  step={0.25}
                  prefix=""
                  suffix="%"
                  presets={[9.35, 12.35, 13.25, 15]}
                  hint="13.25% standard eBay FVF"
                />
                <InputField
                  label="Promoted Listings Standard %"
                  value={round2(ebayInputs.promotedListingRate * 100)}
                  onChange={(v) => setEbayInputs((p) => ({ ...p, promotedListingRate: v / 100 }))}
                  min={0}
                  max={25}
                  step={1}
                  prefix=""
                  suffix="%"
                  presets={[0, 2, 5, 8]}
                  hint="eBay ad rate (default 2%)"
                />
              </div>
            </>
          )}

          {/* 5. SHOPIFY DTC INPUT CONTROLS */}
          {platform === "shopify" && (
            <>
              <InputField
                label="Desired Net Margin %"
                value={shopifyInputs.targetMarginPercent}
                onChange={(v) => setShopifyInputs((p) => ({ ...p, targetMarginPercent: v }))}
                min={1}
                max={85}
                step={1}
                prefix=""
                suffix="%"
                presets={[15, 25, 35, 50]}
                hint="Target take-home profit margin"
              />
              <InputField
                label="Cost of Goods (COGS)"
                value={shopifyInputs.cogs}
                onChange={(v) => setShopifyInputs((p) => ({ ...p, cogs: v }))}
                max={150}
                step={0.5}
                presets={[5, 10, 18, 30]}
                hint="Manufacturing or supplier cost"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <InputField
                  label="Shipping Charged"
                  value={shopifyInputs.shippingCharged}
                  onChange={(v) => setShopifyInputs((p) => ({ ...p, shippingCharged: v }))}
                  max={50}
                  step={0.5}
                  presets={[0, 4.99, 5.99]}
                  hint="Buyer pays"
                />
                <InputField
                  label="Actual Shipping Postage"
                  value={shopifyInputs.actualShippingCost}
                  onChange={(v) => setShopifyInputs((p) => ({ ...p, actualShippingCost: v }))}
                  max={50}
                  step={0.5}
                  presets={[4.0, 5.5, 8.0]}
                  hint="Commercial carrier postage"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3.5 space-y-2">
                  <label className="text-xs font-semibold text-zinc-200">Shopify Plan</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(["basic", "shopify", "advanced"] as const).map((tier) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => setShopifyInputs((p) => ({ ...p, planTier: tier }))}
                        className={`py-2 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer ${
                          shopifyInputs.planTier === tier
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                        }`}
                      >
                        {tier}
                      </button>
                    ))}
                  </div>
                </div>
                <InputField
                  label="Target Paid CAC / Ad Spend ($)"
                  value={shopifyInputs.adSpendPerSale}
                  onChange={(v) => setShopifyInputs((p) => ({ ...p, adSpendPerSale: v }))}
                  max={75}
                  step={1}
                  presets={[0, 8, 15, 25]}
                  hint="Meta / Google Ads acquisition cost"
                />
              </div>
            </>
          )}
        </div>

        {/* Solved Waterfall & Table */}
        {!isImpossible && (
          <div className="space-y-6">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider">
                  Projected Profit at ${result.requiredSellingPrice.toFixed(2)}
                </h3>
                <span className="text-xs font-bold text-emerald-400">
                  Target: {targetMarginPercent}%
                </span>
              </div>
              <WaterfallChart steps={result.breakdown.waterfallSteps} />
            </div>

            <FeeBreakdownTable
              rows={breakdownRows}
              totalFees={result.breakdown.totalFees}
              totalCosts={result.breakdown.totalCosts}
              netProfit={result.breakdown.netProfit}
            />
          </div>
        )}
      </div>

      {/* Return & Dispute Loss Scenario */}
      <ReturnClawbackCard
        clawbackAmount={result.breakdown.returnClawbackLoss}
        platformName={platformName}
        explanation={clawbackExplanation}
      />

      {/* Platform-Tailored Sponsor Cards */}
      {platform === "etsy" && (
        <EtsyEverbeeSponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />
      )}
      {platform === "tiktok" && (
        <TikTokKalodataSponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />
      )}
      {platform === "amazon" && (
        <AmazonHelium10SponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />
      )}
      {platform === "ebay" && (
        <EbayZikAnalyticsSponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />
      )}
      {platform === "shopify" && (
        <ShopifyKlaviyoSponsorCard isPro={isPro} onOpenProModal={onOpenProModal} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN DASHBOARD COMPONENT WITH STORE SELECTOR ARCHITECTURE
// ═══════════════════════════════════════════════════════════════

export interface CalculatorDashboardProps {
  initialStore?: StoreId;
  initialSubTab?: SubTabId;
  forceStore?: StoreId;
  children?: React.ReactNode;
}

export default function CalculatorDashboard({
  initialStore = "hub",
  initialSubTab = "calculator",
  forceStore,
  children,
}: CalculatorDashboardProps = {}) {
  const [activeStore, setActiveStore] = useState<StoreId>(forceStore || initialStore);
  const [activeSubTab, setActiveSubTab] = useState<SubTabId>(initialSubTab);
  const [isStoreMenuOpen, setIsStoreMenuOpen] = useState<boolean>(false);
  // Launch Special: Pro features are 100% unlocked for all sellers through Dec 1, 2026!
  const [isPro, setIsPro] = useState<boolean>(true);
  const [isProModalOpen, setIsProModalOpen] = useState<boolean>(false);

  // Sync with localStorage for seamless navigation & pro status
  useEffect(() => {
    if (forceStore) {
      setActiveStore(forceStore);
      return;
    }

    const savedStore = localStorage.getItem("feespotter_active_store") as StoreId;
    if (savedStore && ["etsy", "tiktok", "amazon", "ebay", "shopify"].includes(savedStore)) {
      setActiveStore(savedStore);
    }
  }, [forceStore]);

  const handleSelectStore = (store: StoreId) => {
    setActiveStore(store);
    setActiveSubTab("calculator");
    setIsStoreMenuOpen(false);
    if (store !== "hub") {
      localStorage.setItem("feespotter_active_store", store);
    } else {
      localStorage.removeItem("feespotter_active_store");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSetPro = (val: boolean) => {
    setIsPro(val);
    localStorage.setItem("feespotter_is_pro", String(val));
  };

  const currentStoreConfig = useMemo(() => {
    return STORE_CONFIGS.find((s) => s.id === activeStore) || STORE_CONFIGS[0];
  }, [activeStore]);

  return (
    <div className="min-h-dvh bg-[#09090b] text-white flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-teal-600/5 rounded-full blur-[100px]" />
      </div>

      {/* Floating Glass Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/85 border-b border-zinc-800/80 transition-all">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3 sm:py-3.5 flex items-center justify-between gap-3">
          {/* Logo & Store Switcher */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => handleSelectStore("hub")}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
              title="Return to Marketplace Selector Hub"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    FeeSpotter
                  </span>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-full">
                    2026 Engine
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 hidden sm:block">
                  Multi-Marketplace Profit Auditor
                </p>
              </div>
            </button>

            {/* In-Header Store Switcher Pill (When inside a store) */}
            {activeStore !== "hub" && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsStoreMenuOpen(!isStoreMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
                  aria-label="Switch Marketplace"
                >
                  <span className="shrink-0">{currentStoreConfig.icon}</span>
                  <span className="font-extrabold">{currentStoreConfig.shortName}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-0.5" />
                </button>

                {/* Dropdown Menu */}
                {isStoreMenuOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Switch Marketplace
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectStore("hub")}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors cursor-pointer text-left"
                    >
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>All Marketplaces Hub</span>
                    </button>
                    <div className="h-px bg-zinc-800/80 my-1" />
                    <button
                      type="button"
                      onClick={() => handleSelectStore("etsy")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                        activeStore === "etsy"
                          ? "bg-orange-950/60 text-orange-300 border border-orange-800/60"
                          : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 text-orange-400" />
                      <span>Etsy Seller Suite</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectStore("tiktok")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                        activeStore === "tiktok"
                          ? "bg-cyan-950/60 text-cyan-300 border border-cyan-800/60"
                          : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      <Store className="w-4 h-4 text-cyan-400" />
                      <span>TikTok Shop Suite</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectStore("amazon")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                        activeStore === "amazon"
                          ? "bg-amber-950/60 text-amber-300 border border-amber-800/60"
                          : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      <Package className="w-4 h-4 text-amber-400" />
                      <span>Amazon FBA &amp; FBM Suite</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectStore("ebay")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                        activeStore === "ebay"
                          ? "bg-blue-950/60 text-blue-300 border border-blue-800/60"
                          : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      <Tag className="w-4 h-4 text-blue-400" />
                      <span>eBay Seller Suite</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectStore("shopify")}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer text-left ${
                        activeStore === "shopify"
                          ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/60"
                          : "text-zinc-300 hover:text-white hover:bg-zinc-900"
                      }`}
                    >
                      <Layers className="w-4 h-4 text-emerald-400" />
                      <span>Shopify DTC Suite</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Launch Special & Pro Status */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 text-emerald-300 border border-emerald-700/60 font-bold text-xs shadow-xs">
              <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Launch Special: Free Pro Unlocked</span>
              <span className="sm:hidden">Pro Free</span>
              <span className="px-1.5 py-0.5 bg-emerald-800/70 text-[10px] text-emerald-100 rounded-md font-extrabold uppercase tracking-wide">
                Thru Dec 1
              </span>
            </div>

            {/* Clerk Authentication Controls */}
            <div className="flex items-center gap-2 pl-2 border-l border-zinc-800/80 ml-1">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/70 transition-all cursor-pointer"
                  >
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    type="button"
                    className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-950 bg-white hover:bg-zinc-200 shadow-sm transition-all cursor-pointer"
                  >
                    Sign Up
                  </button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-xl ring-2 ring-emerald-500/30",
                    },
                  }}
                />
              </Show>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 flex-1 w-full space-y-6 sm:space-y-8">
        {/* VIEW 1: STORE SELECTOR HUB */}
        {activeStore === "hub" ? (
          <StoreHub
            onSelectStore={handleSelectStore}
            isPro={isPro}
            onOpenProModal={() => setIsProModalOpen(true)}
          />
        ) : (
          /* VIEW 2: DEDICATED STORE WORKSPACE */
          <div className="space-y-6">
            {/* Store Header & Sub-Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectStore("hub")}
                  className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
                  title="Back to All Marketplaces"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {currentStoreConfig.name}
                    </h2>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${currentStoreConfig.badgeColor}`}
                    >
                      {currentStoreConfig.badge}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {currentStoreConfig.description}
                  </p>
                </div>
              </div>

              {/* Sub-Tab Navigation for Selected Store */}
              <div className="flex items-center gap-1 p-1 bg-zinc-900/90 border border-zinc-800 rounded-xl overflow-x-auto no-scrollbar shadow-inner self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("calculator")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSubTab === "calculator"
                      ? "bg-zinc-800 text-white shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Fee Calculator</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab("reverse")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSubTab === "reverse"
                      ? "bg-zinc-800 text-white shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Price Solver</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSubTab("audit")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeSubTab === "audit"
                      ? "bg-zinc-800 text-white shadow-xs"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Batch CSV Audit</span>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      isPro
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                        : "bg-amber-950 text-amber-400 border border-amber-800/60"
                    }`}
                  >
                    {isPro ? "PRO" : "FREE PREVIEW"}
                  </span>
                </button>
              </div>
            </div>

            {/* Active SubTab Component Display */}
            {activeSubTab === "calculator" && (
              <>
                {activeStore === "etsy" && (
                  <EtsyTab
                    isPro={isPro}
                    onOpenProModal={() => setIsProModalOpen(true)}
                  />
                )}
                {activeStore === "tiktok" && (
                  <TikTokTab
                    isPro={isPro}
                    onOpenProModal={() => setIsProModalOpen(true)}
                  />
                )}
                {activeStore === "amazon" && (
                  <AmazonTab
                    isPro={isPro}
                    onOpenProModal={() => setIsProModalOpen(true)}
                  />
                )}
                {activeStore === "ebay" && (
                  <EbayTab
                    isPro={isPro}
                    onOpenProModal={() => setIsProModalOpen(true)}
                  />
                )}
                {activeStore === "shopify" && (
                  <ShopifyTab
                    isPro={isPro}
                    onOpenProModal={() => setIsProModalOpen(true)}
                  />
                )}
              </>
            )}

            {activeSubTab === "reverse" && (
              <ReverseTab
                platform={activeStore}
                isPro={isPro}
                onOpenProModal={() => setIsProModalOpen(true)}
              />
            )}

            {activeSubTab === "audit" && (
              <BatchCsvAudit
                isPro={isPro}
                onOpenProModal={() => setIsProModalOpen(true)}
                initialPlatform={activeStore}
              />
            )}
          </div>
        )}

        {/* Responsive Google AdSense CPM Banner (Hidden on Pro) */}
        <GoogleAdBanner
          isPro={isPro}
          onOpenProModal={() => setIsProModalOpen(true)}
          className="mt-8"
        />

        {/* Dedicated Page SEO Content or Custom Children */}
        {children}
      </main>

      {/* Pro Upgrade Modal ($5/mo or $50/yr) */}
      <ProUpgradeModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
        onUpgradeSuccess={() => handleSetPro(true)}
      />

      {/* Global Footer with SEO & Legal Links */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950/80 py-10 mt-16 text-xs text-zinc-400">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-800/70 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 text-white font-bold text-base">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span>FeeSpotter</span>
              </div>
              <p className="text-zinc-500 text-xs mt-1">
                Deterministic Marketplace Profit Engine &amp; Batch Catalog Auditor
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-400 font-medium">
              <Link href="/about" className="hover:text-emerald-400 transition-colors">
                About FeeSpotter
              </Link>
              <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/contact" className="hover:text-emerald-400 transition-colors">
                Contact &amp; Support
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-zinc-500">
            <span className="font-semibold text-zinc-400">Marketplace Calculators:</span>
            <Link href="/etsy-fee-calculator" className="hover:text-zinc-300 transition-colors">
              Etsy Fee Calculator
            </Link>
            <span>&bull;</span>
            <Link href="/tiktok-shop-fee-calculator" className="hover:text-zinc-300 transition-colors">
              TikTok Shop Fee Calculator
            </Link>
            <span>&bull;</span>
            <Link href="/amazon-fba-fee-calculator" className="hover:text-zinc-300 transition-colors">
              Amazon FBA Calculator
            </Link>
            <span>&bull;</span>
            <Link href="/ebay-fee-calculator" className="hover:text-zinc-300 transition-colors">
              eBay Fee Calculator
            </Link>
            <span>&bull;</span>
            <Link href="/shopify-fee-calculator" className="hover:text-zinc-300 transition-colors">
              Shopify Fee Calculator
            </Link>
          </div>

          <p className="text-[11px] text-zinc-600 text-center">
            &copy; 2026 FeeSpotter. All rights reserved. Calculations are deterministic financial estimates based on official 2026 marketplace fee schedules and do not constitute formal tax or investment advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
