"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  Sparkles,
  ShieldCheck,
  X,
  Zap,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { isPromoWindowActive } from "@/lib/proAccess";

export type BillingCycle = "monthly" | "annual";

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess?: () => void;
  bleedingCount?: number;
  isSignedIn?: boolean;
  isExpiredPromoUser?: boolean;
}

export function ProUpgradeModal({
  isOpen,
  onClose,
  bleedingCount,
  isSignedIn = false,
  isExpiredPromoUser = false,
}: ProUpgradeModalProps) {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("annual");
  const [isProcessing, setIsProcessing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const promoActive = isPromoWindowActive();

  // If promo is active and user successfully signs in, auto-close the modal
  useEffect(() => {
    if (isOpen && isSignedIn && promoActive) {
      onClose();
    }
  }, [isOpen, isSignedIn, promoActive, onClose]);

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

  const handlePaidCheckout = () => {
    setIsProcessing(true);
    const checkoutUrl =
      billingCycle === "annual"
        ? process.env.NEXT_PUBLIC_STRIPE_ANNUAL_URL
        : process.env.NEXT_PUBLIC_STRIPE_MONTHLY_URL;

    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      setIsProcessing(false);
      alert(
        "Stripe checkout URL is not configured yet. Please configure NEXT_PUBLIC_STRIPE_MONTHLY_URL or NEXT_PUBLIC_STRIPE_ANNUAL_URL in your environment."
      );
    }
  };

  // Determine whether to display View A (Email capture free promo) or View B (Paid checkout)
  const isEmailCaptureMode = promoActive && !isSignedIn;

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

        {/* VIEW A: Email Capture Lead Trap (Promo Active & Not Signed In) */}
        {isEmailCaptureMode ? (
          <div className="space-y-5">
            {/* Header */}
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                <Sparkles className="w-3.5 h-3.5" />
                Launch Special &bull; Free Pro Until Dec 1
              </div>

              <h2
                id="pro-modal-title"
                className="text-2xl sm:text-3xl font-black text-white tracking-tight"
              >
                Enter Your Email to Unlock FeeSpotter Pro (Free)
              </h2>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {bleedingCount && bleedingCount > 0 ? (
                  <span className="text-rose-400 font-semibold block mb-1">
                    Your audit flagged {bleedingCount} cash-bleeding SKUs.{" "}
                  </span>
                ) : null}
                Create a free account with Google or email to unlock <strong>100% Ad-Free Pro Mode</strong>, <strong>Unblurred Batch CSV Audits</strong>, and <strong>Executive PDF Reports</strong> completely free through <strong>December 1, 2026</strong>. No credit card required.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-2.5 text-xs sm:text-sm pt-2">
              <div className="flex items-start gap-2.5 text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  <strong className="text-white">Unblur All SKUs in Batch Audits:</strong> View calculations on unlimited catalog listings.
                </span>
              </div>

              <div className="flex items-start gap-2.5 text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  <strong className="text-white">Executive PDF Reports:</strong> Download high-res profit audits for your accountant.
                </span>
              </div>

              <div className="flex items-start gap-2.5 text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  <strong className="text-white">100% Ad-Free Experience:</strong> Clean, distraction-free environment without any ads or sponsor banners.
                </span>
              </div>

              <div className="flex items-start gap-2.5 text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  <strong className="text-white">2026 Marketplace Engine:</strong> Up-to-date fee stacks for Etsy, TikTok, Amazon, eBay &amp; Shopify.
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 space-y-3">
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="w-full py-3.5 px-6 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span>Continue with Email or Google — Unlock Free Pro</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>

              <div className="text-center">
                <SignInButton mode="modal">
                  <button
                    type="button"
                    className="text-xs font-semibold text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer underline underline-offset-4"
                  >
                    Already registered? Sign in to activate Pro
                  </button>
                </SignInButton>
              </div>

              <p className="text-center text-[11px] text-zinc-500 pt-1">
                Zero credit card needed today. Optional $5/mo after Dec 1 if you choose to continue.
              </p>
            </div>
          </div>
        ) : (
          /* VIEW B: Paid Subscription Mode (Expired or Post-Dec 1) */
          <div className="space-y-5">
            {/* Expired Promo Banner if applicable */}
            {isExpiredPromoUser && (
              <div className="p-3 rounded-2xl bg-amber-950/70 border border-amber-800/80 flex items-start gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  The Free Launch Promo ended on December 1. Upgrade for $5/mo to restore Ad-Free Pro, unblurred CSV audits, and PDF exports.
                </span>
              </div>
            )}

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
                Unlock your full catalog audit, reveal every money-losing SKU, and export executive PDF reports.
              </p>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="p-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center gap-1">
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
            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex items-baseline justify-between">
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
            <div className="space-y-2.5 text-xs sm:text-sm">
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
                  <strong className="text-white">Official Executive PDF Reports:</strong> Unlimited vector report downloads for your records.
                </span>
              </div>

              <div className="flex items-start gap-2.5 text-zinc-300">
                <div className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span>
                  <strong className="text-white">100% Ad-Free Experience:</strong> Clean, focused auditing workflow without sponsor banners or ads.
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handlePaidCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 px-6 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-950/60 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 animate-spin" /> Connecting to checkout...
                  </span>
                ) : (
                  <span>
                    Upgrade to Pro Now ({billingCycle === "annual" ? "$50/year" : "$5/month"})
                  </span>
                )}
              </button>

              <p className="text-center text-[11px] text-zinc-500">
                Encrypted 256-bit secure checkout. 1-click cancellation anytime in your account.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProUpgradeModal;
