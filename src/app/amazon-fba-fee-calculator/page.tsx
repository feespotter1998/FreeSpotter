import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";
import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Amazon FBA Fee Calculator 2026: Profit & Fees",
  description:
    "Compute Amazon FBA margins after the 15% referral fee, FBA Pick & Pack size tiers, Inbound Placement, and storage fees. Free FBA vs FBM profit comparison tool.",
  alternates: {
    canonical: `${siteUrl}/amazon-fba-fee-calculator`,
  },
  openGraph: {
    title: "Amazon FBA Fee Calculator 2026: Exact Fees & Net Profit",
    description: "Determine exact referral fees, FBA Pick & Pack size tiers, and Inbound Placement surcharges.",
    url: `${siteUrl}/amazon-fba-fee-calculator`,
    siteName: "FeeSpotter",
    images: [`${siteUrl}/og-image.png`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazon FBA Fee Calculator 2026: Profit & Fees",
    description: "Compute Amazon FBA margins after category referral fees, FBA size tiers, Inbound Placement, and storage fees.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function AmazonCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="amazon" forceStore="amazon">
      <MarketplaceSeoContent store="amazon" />
    </CalculatorDashboard>
  );
}
