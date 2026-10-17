"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { WaterfallStep } from "@/lib/calculations";

interface WaterfallChartProps {
  steps: WaterfallStep[];
}

// Colors for different step types
const COLORS = {
  revenue: "#10b981", // emerald-500
  fee: "#f43f5e",     // rose-500
  cost: "#f97316",    // orange-500
  profit_positive: "#10b981",
  profit_negative: "#ef4444",
};

interface ChartDataPoint {
  name: string;
  shortName: string;
  spacer: number;
  bar: number;
  actualValue: number;
  cumulative: number;
  type: WaterfallStep["type"];
}

// Mobile-friendly label shortener
function getShortLabel(name: string): string {
  if (name.includes("Gross Revenue")) return "Revenue";
  if (name.includes("Listing")) return "Listing";
  if (name.includes("Transaction")) return "Trans. 6.5%";
  if (name.includes("Payment")) return "Payment";
  if (name.includes("Offsite")) return "Offsite Ads";
  if (name.includes("COGS")) return "COGS";
  if (name.includes("Shipping Cost") || name.includes("Actual Shipping")) return "Shipping";
  if (name.includes("Packaging")) return "Packaging";
  if (name.includes("Referral")) return "Ref. 6%";
  if (name.includes("Affiliate")) return "Affiliate";
  if (name.includes("Ad Spend")) return "Ad Spend";
  if (name.includes("Return")) return "Returns";
  if (name.includes("Net Profit")) return "Net Profit";
  return name;
}

function buildChartData(steps: WaterfallStep[]): ChartDataPoint[] {
  return steps.map((step, i) => {
    const shortName = getShortLabel(step.name);

    if (step.type === "revenue") {
      return {
        name: step.name,
        shortName,
        spacer: 0,
        bar: step.value,
        actualValue: step.value,
        cumulative: step.cumulative,
        type: step.type,
      };
    }

    if (step.type === "profit") {
      const profitValue = step.value;
      return {
        name: step.name,
        shortName,
        spacer: profitValue < 0 ? profitValue : 0,
        bar: Math.abs(profitValue),
        actualValue: profitValue,
        cumulative: step.cumulative,
        type: step.type,
      };
    }

    // Fee or cost: bar hangs from previous cumulative
    const prevCumulative = steps[i - 1]?.cumulative ?? 0;
    const barHeight = Math.abs(step.value);
    const barStart = prevCumulative - barHeight;

    return {
      name: step.name,
      shortName,
      spacer: Math.max(barStart, 0),
      bar: barHeight,
      actualValue: step.value,
      cumulative: step.cumulative,
      type: step.type,
    };
  });
}

function getBarColor(point: ChartDataPoint): string {
  if (point.type === "profit") {
    return point.actualValue >= 0
      ? COLORS.profit_positive
      : COLORS.profit_negative;
  }
  return COLORS[point.type] || COLORS.fee;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartDataPoint;
  }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const isNeg = data.actualValue < 0;

  return (
    <div className="bg-zinc-950/95 border border-zinc-700/80 backdrop-blur-md rounded-xl p-3 shadow-2xl min-w-[150px]">
      <p className="text-xs font-semibold text-zinc-400 mb-1">{data.name}</p>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] text-zinc-500 uppercase font-medium">Impact</span>
        <span
          className={`text-sm font-bold tabular-nums ${
            isNeg ? "text-rose-400" : "text-emerald-400"
          }`}
        >
          {isNeg ? "-" : "+"}${Math.abs(data.actualValue).toFixed(2)}
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-3 mt-1 pt-1 border-t border-zinc-800">
        <span className="text-[11px] text-zinc-500 uppercase font-medium">Balance</span>
        <span className="text-xs font-semibold text-zinc-300 tabular-nums">
          ${data.cumulative.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

export function WaterfallChart({ steps }: WaterfallChartProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const data = useMemo(() => buildChartData(steps), [steps]);

  if (!mounted) {
    return (
      <div className="w-full h-64 sm:h-80 flex items-center justify-center bg-zinc-900/30 rounded-xl border border-zinc-800/40 animate-pulse">
        <span className="text-xs text-zinc-500 font-medium">Rendering Profit Waterfall...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-64 sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 15,
            right: isMobile ? 8 : 15,
            left: isMobile ? -18 : 0,
            bottom: isMobile ? 35 : 45,
          }}
        >
          <XAxis
            dataKey={isMobile ? "shortName" : "name"}
            tick={{ fill: "#a1a1aa", fontSize: isMobile ? 9 : 11 }}
            angle={isMobile ? -35 : -30}
            textAnchor="end"
            interval={0}
            axisLine={{ stroke: "#27272a" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#71717a", fontSize: isMobile ? 9 : 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${v}`}
            width={isMobile ? 38 : 50}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
          />
          <ReferenceLine y={0} stroke="#3f3f46" strokeDasharray="3 3" />
          {/* Invisible spacer bar */}
          <Bar dataKey="spacer" stackId="stack" fill="transparent" />
          {/* Visible value bar */}
          <Bar dataKey="bar" stackId="stack" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WaterfallChart;
