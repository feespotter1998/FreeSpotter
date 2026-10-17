import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";

export const metadata: Metadata = {
  title: "TikTok Shop Fee Calculator 2026: Real Profit & Break-Even ROAS | FeeSpotter",
  description:
    "Calculate exact TikTok Shop profit after the 6.0% referral fee, 2.9% + $0.30 processing, creator affiliate commissions, and ad spend. Includes Break-Even ROAS calculator.",
  alternates: {
    canonical: "https://feespotter.com/tiktok-shop-fee-calculator",
  },
  openGraph: {
    title: "TikTok Shop Fee Calculator 2026: Real Profit & Break-Even ROAS",
    description: "Accurately compute TikTok referral commission, creator affiliates, and ad spend margins.",
    url: "https://feespotter.com/tiktok-shop-fee-calculator",
    siteName: "FeeSpotter",
    type: "website",
  },
};

export default function TikTokCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="tiktok" forceStore="tiktok">
      <MarketplaceSeoContent store="tiktok" />
    </CalculatorDashboard>
  );
}
