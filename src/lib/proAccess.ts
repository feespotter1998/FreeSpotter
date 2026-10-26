"use client";

import { useSyncExternalStore } from "react";
import { useUser } from "@clerk/nextjs";

// Timestamp for 2026-12-01T23:59:59Z in milliseconds
export const PROMO_CUTOFF_TIMESTAMP = 1796169599000;

const emptySubscribe = () => () => {};

/**
 * Checks if the promo window is active.
 * Uses a stable fallback for SSR prerendering to avoid Next.js prerender timing warnings.
 */
export function isPromoWindowActive(): boolean {
  if (typeof window === "undefined") {
    return true;
  }
  return Date.now() <= PROMO_CUTOFF_TIMESTAMP;
}

export type ProReason =
  | "anonymous"
  | "paid_subscriber"
  | "revoked_or_cancelled"
  | "free_promo_until_dec_1"
  | "promo_expired_must_pay";

export interface ProStatus {
  isPro: boolean;
  isSignedIn: boolean;
  isPromoActive: boolean;
  isExpiredPromoUser: boolean;
  reason: ProReason;
}

/**
 * Centralized hook to manage Pro entitlement & Launch Promo access.
 *
 * Rules:
 * 1. Anonymous visitors are NEVER Pro (they see ads & blurred CSV rows).
 * 2. If user.publicMetadata?.isPro === true -> always Pro (paid subscriber or admin override).
 * 3. If user.publicMetadata?.isPro === false -> revoked/cancelled, not Pro.
 * 4. If signed in during Promo Window (before/on Dec 1, 2026) -> automatically Pro.
 * 5. After Dec 1, 2026 -> all free promo users expire and must pay to regain Pro.
 */
export function useProStatus(): ProStatus {
  const { isLoaded, isSignedIn, user } = useUser();

  // Stable client-side evaluation of promo active status
  const promoActive = useSyncExternalStore(
    emptySubscribe,
    () => Date.now() <= PROMO_CUTOFF_TIMESTAMP,
    () => true
  );

  // 1. Not loaded or not signed in
  if (!isLoaded || !isSignedIn || !user) {
    return {
      isPro: false,
      isSignedIn: false,
      isPromoActive: promoActive,
      isExpiredPromoUser: false,
      reason: "anonymous",
    };
  }

  // 2. Paid / Admin Override in Clerk publicMetadata
  const publicMetadata = user.publicMetadata as { isPro?: boolean } | undefined;
  if (publicMetadata?.isPro === true) {
    return {
      isPro: true,
      isSignedIn: true,
      isPromoActive: promoActive,
      isExpiredPromoUser: false,
      reason: "paid_subscriber",
    };
  }

  if (publicMetadata?.isPro === false) {
    return {
      isPro: false,
      isSignedIn: true,
      isPromoActive: promoActive,
      isExpiredPromoUser: true,
      reason: "revoked_or_cancelled",
    };
  }

  // 3. Free Promo Window (Before/On Dec 1, 2026)
  if (promoActive) {
    return {
      isPro: true,
      isSignedIn: true,
      isPromoActive: true,
      isExpiredPromoUser: false,
      reason: "free_promo_until_dec_1",
    };
  }

  // 4. After Dec 1, 2026 -> Promo expired, user must subscribe
  return {
    isPro: false,
    isSignedIn: true,
    isPromoActive: false,
    isExpiredPromoUser: true,
    reason: "promo_expired_must_pay",
  };
}
