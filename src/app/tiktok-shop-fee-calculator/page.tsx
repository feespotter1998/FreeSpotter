import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";
import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "TikTok Shop Fee & Profit Calculator (2026)",
  description:
    "Calculate exact TikTok Shop net profits after the 6% referral fee, creator affiliate commissions, returns, and ad spend. Includes free Break-Even ROAS solver.",
  alternates: {
    canonical: `${siteUrl}/tiktok-shop-fee-calculator`,
  },
  openGraph: {
    title: "TikTok Shop Fee & Profit Calculator 2026 | FeeSpotter",
    description: "Accurately compute TikTok referral commission, creator affiliates, and ad spend margins.",
    url: `${siteUrl}/tiktok-shop-fee-calculator`,
    siteName: "FeeSpotter",
    images: [`${siteUrl}/og-image.png`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TikTok Shop Fee & Profit Calculator (2026)",
    description: "Calculate exact TikTok Shop net profits after the 6% referral fee, creator affiliate commissions, returns, and ad spend.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function TikTokCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="tiktok" forceStore="tiktok">
      <MarketplaceSeoContent store="tiktok" />
    </CalculatorDashboard>
  );
}
