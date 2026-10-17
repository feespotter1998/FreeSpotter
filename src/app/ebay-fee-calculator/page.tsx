import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";
import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "eBay Fee Calculator 2026: Seller Fees & Profit",
  description:
    "Calculate exact eBay seller profit after the 13.60% Final Value Fee, tiered per-order fees, Promoted Listings, and store discounts. Free 2026 margin auditor.",
  alternates: {
    canonical: `${siteUrl}/ebay-fee-calculator`,
  },
  openGraph: {
    title: "eBay Fee Calculator 2026: Final Value Fees & Net Profit",
    description: "Accurately compute eBay final value fees, store tier discounts, and Promoted Listings ROAS.",
    url: `${siteUrl}/ebay-fee-calculator`,
    siteName: "FeeSpotter",
    images: [`${siteUrl}/og-image.png`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "eBay Fee Calculator 2026: Seller Fees & Profit",
    description: "Calculate exact eBay seller profit after the 13.60% Final Value Fee, per-order fees, and Promoted Listings.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function EbayCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="ebay" forceStore="ebay">
      <MarketplaceSeoContent store="ebay" />
    </CalculatorDashboard>
  );
}
