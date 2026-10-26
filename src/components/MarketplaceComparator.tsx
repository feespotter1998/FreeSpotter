"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Store,
  Package,
  Crown,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import {
  type MarketplaceCompareInputs,
  type MarketplaceCompareResult,
  compareAllMarketplaces,
} from "@/lib/calculations";
import { STORE_URLS } from "./CalculatorDashboard";

interface MarketplaceComparatorProps {
  onSelectStore: (store: "etsy" | "tiktok" | "amazon" | "ebay" | "shopify") => void;
}

interface ComparatorInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (val: number) => void;
}

function ComparatorInput({ id, label, value, onChange }: ComparatorInputProps) {
  const [localText, setLocalText] = useState<string | null>(null);

  const displayVal =
    localText !== null
      ? localText
      : Number.isInteger(value)
      ? String(value)
      : value.toFixed(2);

  return (
    <div>
      <label
        htmlFor={id}
        className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5"
      >
        {label}
      </label>
      <div className="flex items-center bg-zinc-950 border border-zinc-700/70 rounded-xl px-3 py-2 focus-within:border-emerald-500 transition-colors">
        <span className="text-zinc-500 font-bold mr-1 text-sm">$</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={displayVal}
          onFocus={(e) => {
            setLocalText(String(value));
            e.target.select();
          }}
          onChange={(e) => {
            const raw = e.target.value;
            setLocalText(raw);
            const parsed = parseFloat(raw);
            if (!isNaN(parsed) && parsed >= 0) {
              onChange(Math.round(parsed * 100) / 100);
            }
          }}
          onBlur={() => {
            if (localText !== null) {
              const parsed = parseFloat(localText);
              const valid = isNaN(parsed) || parsed < 0 ? 0 : Math.round(parsed * 100) / 100;
              onChange(valid);
              setLocalText(null);
            }
          }}
          className="w-full bg-transparent text-white font-black text-sm focus:outline-none"
        />
      </div>
    </div>
  );
}

export function MarketplaceComparator({
  onSelectStore,
}: MarketplaceComparatorProps) {
  const [inputs, setInputs] = useState<MarketplaceCompareInputs>({
    sellingPrice: 29.99,
    cogs: 6.5,
    actualShippingCost: 4.5,
    packagingCost: 0.75,
    miscCost: 0,
  });

  const comparison: MarketplaceCompareResult = useMemo(
    () => compareAllMarketplaces(inputs),
    [inputs]
  );

  const isCleared = inputs.sellingPrice === 0 && inputs.cogs === 0 && inputs.actualShippingCost === 0;

  const update = <K extends keyof MarketplaceCompareInputs>(
    key: K,
    val: MarketplaceCompareInputs[K]
  ) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  };

  const getPlatformIcon = (
    platform: "etsy" | "tiktok" | "amazon" | "ebay" | "shopify"
  ) => {
    switch (platform) {
      case "etsy":
        return <ShoppingBag className="w-5 h-5 text-orange-400" />;
      case "tiktok":
        return <Store className="w-5 h-5 text-cyan-400" />;
      case "amazon":
        return <Package className="w-5 h-5 text-amber-400" />;
      case "ebay":
        return <Store className="w-5 h-5 text-blue-400" />;
      case "shopify":
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getPlatformColors = (
    platform: "etsy" | "tiktok" | "amazon" | "ebay" | "shopify",
    isBest: boolean
  ) => {
    if (isBest) {
      return {
        border: "border-emerald-500/60 shadow-lg shadow-emerald-950/40",
        badge: "bg-emerald-950 text-emerald-300 border-emerald-800/80",
        cardBg: "from-emerald-950/30 via-zinc-900/80 to-zinc-950",
        btn: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/50",
      };
    }
    switch (platform) {
      case "etsy":
        return {
          border: "border-zinc-800 hover:border-orange-500/40",
          badge: "bg-orange-950/60 text-orange-400 border-orange-800/40",
          cardBg: "from-zinc-900/60 via-zinc-900/40 to-zinc-950",
          btn: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
        };
      case "tiktok":
        return {
          border: "border-zinc-800 hover:border-cyan-500/40",
          badge: "bg-cyan-950/60 text-cyan-400 border-cyan-800/40",
          cardBg: "from-zinc-900/60 via-zinc-900/40 to-zinc-950",
          btn: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
        };
      case "amazon":
        return {
          border: "border-zinc-800 hover:border-amber-500/40",
          badge: "bg-amber-950/60 text-amber-400 border-amber-800/40",
          cardBg: "from-zinc-900/60 via-zinc-900/40 to-zinc-950",
          btn: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
        };
      case "ebay":
        return {
          border: "border-zinc-800 hover:border-blue-500/40",
          badge: "bg-blue-950/60 text-blue-400 border-blue-800/40",
          cardBg: "from-zinc-900/60 via-zinc-900/40 to-zinc-950",
          btn: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
        };
      case "shopify":
        return {
          border: "border-zinc-800 hover:border-emerald-500/40",
          badge: "bg-emerald-950/60 text-emerald-400 border-emerald-800/40",
          cardBg: "from-zinc-900/60 via-zinc-900/40 to-zinc-950",
          btn: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200",
        };
    }
  };

  return (
    <div className="bg-zinc-950/60 border border-zinc-800/90 rounded-3xl p-5 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800/60 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>5-Store Interactive Profit Matchup</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Where Should I Sell This Product?
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Plug in your unit pricing to instantly compare real take-home cash and fee deductions across Etsy, TikTok Shop, Amazon FBA, eBay, and Shopify side-by-side.
          </p>
        </div>

        {/* Highlight Banner of Spread */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-zinc-900 to-zinc-950 border border-emerald-800/60 rounded-2xl p-3.5 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-900/80 border border-emerald-700/60 flex items-center justify-center text-amber-400 shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Optimal Marketplace
            </div>
            <div className="text-sm font-extrabold text-white">
              {comparison.bestPlatform.name} yields{" "}
              <span className="text-emerald-400">
                +${comparison.profitSpread.toFixed(2)}
              </span>{" "}
              more/sale
            </div>
          </div>
        </div>
      </div>

      {/* Quick Input Bar */}
      <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Unit Parameters
          </span>
          {isCleared ? (
            <button
              type="button"
              onClick={() =>
                setInputs({
                  sellingPrice: 29.99,
                  cogs: 6.5,
                  actualShippingCost: 4.5,
                  packagingCost: 0.75,
                  miscCost: 0,
                })
              }
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-emerald-950/70 border border-zinc-700/80 hover:border-emerald-500/50 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Load Sample</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() =>
                setInputs({
                  sellingPrice: 0,
                  cogs: 0,
                  actualShippingCost: 0,
                  packagingCost: 0,
                  miscCost: 0,
                })
              }
              className="animate-clear-glow-2s inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-900 hover:bg-rose-950/70 border border-zinc-700/80 hover:border-rose-500/50 text-[11px] font-bold text-zinc-200 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <ComparatorInput
            id="comp-selling-price"
            label="Selling Price"
            value={inputs.sellingPrice}
            onChange={(val) => update("sellingPrice", val)}
          />
          <ComparatorInput
            id="comp-cogs"
            label="Product Cost (COGS)"
            value={inputs.cogs}
            onChange={(val) => update("cogs", val)}
          />
          <ComparatorInput
            id="comp-shipping"
            label="Postage / Shipping Cost"
            value={inputs.actualShippingCost}
            onChange={(val) => update("actualShippingCost", val)}
          />
          <ComparatorInput
            id="comp-packaging"
            label="Packaging / Labels"
            value={inputs.packagingCost}
            onChange={(val) => update("packagingCost", val)}
          />
        </div>
    </div>

      {/* 5 Ranked Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-5">
        {comparison.ranked.map((item) => {
          const styles = getPlatformColors(item.platform, item.isBest);
          const isNegative = item.netProfit < 0;

          return (
            <div
              key={item.platform}
              className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between bg-gradient-to-br ${styles.cardBg} ${styles.border}`}
            >
              {/* Best Platform Glow Badge */}
              {item.isBest && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-teal-500 text-black text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-bl-xl shadow-md flex items-center gap-1">
                  <Crown className="w-3 h-3 fill-black" />
                  <span>#1 Highest Margin</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Platform Header */}
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shrink-0">
                    {getPlatformIcon(item.platform)}
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
                      {item.name}
                      <span className="text-[10px] font-bold text-zinc-400">
                        (#{item.rank})
                      </span>
                    </h4>
                    <span className="text-[10px] text-zinc-400">
                      {item.platform === "etsy"
                        ? "Merchant Ships"
                        : item.platform === "tiktok"
                        ? "Social Commerce"
                        : item.platform === "amazon"
                        ? "Amazon FBA"
                        : item.platform === "ebay"
                        ? "Global Marketplace"
                        : "Own Brand DTC"}
                    </span>
                  </div>
                </div>

                {/* Net Profit Big KPI */}
                <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-3.5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                    Take-Home Net Profit
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-2xl sm:text-3xl font-black tabular-nums tracking-tight ${
                        isNegative ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {isNegative ? "-" : "+"}${Math.abs(item.netProfit).toFixed(2)}
                    </span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md border ${
                        item.netMarginPercent >= 20
                          ? "bg-emerald-950 text-emerald-300 border-emerald-800/60"
                          : "bg-zinc-900 text-zinc-300 border-zinc-800"
                      }`}
                    >
                      {item.netMarginPercent.toFixed(1)}% margin
                    </span>
                  </div>
                </div>

                {/* Breakdown Stats */}
                <div className="space-y-2 text-xs border-t border-zinc-800/80 pt-3">
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>Marketplace Fee Total:</span>
                    <span className="font-bold text-rose-400 tabular-nums">
                      -${item.totalFees.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-400">
                    <span>COGS &amp; Shipping Cost:</span>
                    <span className="font-bold text-orange-400 tabular-nums">
                      -${item.totalCosts.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-zinc-300 pt-1 border-t border-zinc-800/50">
                    <span className="font-medium">{item.breakEvenMetricName}:</span>
                    <span className="font-black text-white tabular-nums">
                      {item.breakEvenMetricValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-2">
                <Link
                  href={STORE_URLS[item.platform]}
                  onClick={() => onSelectStore(item.platform)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] ${styles.btn}`}
                >
                  <span>Open {item.name} Calculator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
