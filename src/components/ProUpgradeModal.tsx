"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  Sparkles,
  ShieldCheck,
  X,
  FileSpreadsheet,
  FileText,
  Zap,
  Lock,
} from "lucide-react";

export type BillingCycle = "monthly" | "annual";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  bleedingCount?: number;
  totalSkus?: number;
}

export function ProUpgradeModal({
  isOpen,
  onClose,
  onUpgradeSuccess,
  bleedingCount,
  totalSkus,
}: ProUpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const [isProcessing, setIsProcessing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleUpgrade = () => {
    setIsProcessing(true);
    // In production, this redirects to Stripe Checkout:
    // window.location.href = `/api/checkout?plan=${billingCycle}`;
    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeSuccess();
      onClose();
    }, 800);
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto overscroll-contain transition-all duration-200"
      aria-modal="true"
      role="dialog"
      aria-labelledby="pro-modal-title"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden my-auto"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full bg-zinc-900/60 hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
            <Sparkles className="w-3.5 h-3.5" />
            FeeSpotter Pro
          </div>

          <h2
            id="pro-modal-title"
            className="text-2xl sm:text-3xl font-black text-white tracking-tight"
          >
            Stop Losing Money on Hidden Marketplace Fees
          </h2>

          <p className="text-xs sm:text-sm text-zinc-400">
            {bleedingCount && bleedingCount > 0 ? (
              <span className="text-rose-400 font-semibold">
                You have {bleedingCount} cash-bleeding SKUs in this catalog.{" "}
              </span>
            ) : null}
            Unlock your full inventory audit, reveal every money-losing product, and export executive PDF reports.
          </p>
        </div>

        {/* Billing Cycle Switcher */}
        <div className="mt-5 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-zinc-800 text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            Monthly ($5/mo)
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("annual")}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              billingCycle === "annual"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <span>Annual ($50/yr)</span>
            <span
              className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                billingCycle === "annual"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-950 text-emerald-400"
              }`}
            >
              Save 17%
            </span>
          </button>
        </div>

        {/* Pricing Summary */}
        <div className="mt-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-baseline justify-between">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white tabular-nums">
              {billingCycle === "annual" ? "$50" : "$5"}
              <span className="text-xs sm:text-sm font-normal text-zinc-400">
                {billingCycle === "annual" ? " / year" : " / month"}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              {billingCycle === "annual"
                ? "Billed annually ($4.16/mo effective). Cancel anytime."
                : "Billed monthly. No lock-in, cancel with 1 click."}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" /> Instant Access
            </span>
          </div>
        </div>

        {/* Feature List */}
        <div className="mt-5 space-y-2.5 text-xs sm:text-sm">
          <div className="flex items-start gap-2.5 text-zinc-300">
            <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>
              <strong className="text-white">Unblur All SKUs in Batch Audits:</strong> View full calculations for unlimited catalog listings.
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-zinc-300">
            <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>
              <strong className="text-white">Official Executive PDF Reports:</strong> Unlimited vector report downloads for your accountants and records.
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-zinc-300">
            <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>
              <strong className="text-white">100% Ad-Free Experience:</strong> Clean, distraction-free environment without any sponsor banners.
            </span>
          </div>

          <div className="flex items-start gap-2.5 text-zinc-300">
            <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span>
              <strong className="text-white">2026 Marketplace Engine:</strong> Automatic real-time updates whenever Etsy or TikTok changes fee schedules.
            </span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <div className="mt-6 space-y-2">
          <button
            onClick={handleUpgrade}
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 animate-spin" /> Unlocking FeeSpotter Pro...
              </span>
            ) : (
              <span>
                Upgrade to Pro Now ({billingCycle === "annual" ? "$50/year" : "$5/month"})
              </span>
            )}
          </button>

          <p className="text-center text-[11px] text-zinc-500">
            Encrypted 256-bit secure checkout. 1-click cancellation anytime in your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProUpgradeModal;
