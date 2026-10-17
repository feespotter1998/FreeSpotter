import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";
import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Etsy Fee Calculator 2026: Calculate Net Profit",
  description:
    "Calculate exact Etsy seller fees, 6.5% transaction cut, $0.20 listing renewal, payment processing, and offsite ads. Free 2026 profit and reverse price solver.",
  alternates: {
    canonical: `${siteUrl}/etsy-fee-calculator`,
  },
  openGraph: {
    title: "Etsy Fee Calculator 2026: Real Profit & Margin Solver",
    description: "Accurately compute Etsy transaction fees, payment processing, listing renewals, and offsite ads.",
    url: `${siteUrl}/etsy-fee-calculator`,
    siteName: "FeeSpotter",
    images: [`${siteUrl}/og-image.png`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Etsy Fee Calculator 2026: Calculate Net Profit",
    description: "Calculate exact Etsy seller fees, 6.5% transaction cut, listing renewal, payment processing, and offsite ads.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function EtsyCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="etsy" forceStore="etsy">
      <MarketplaceSeoContent store="etsy" />
    </CalculatorDashboard>
  );
}
