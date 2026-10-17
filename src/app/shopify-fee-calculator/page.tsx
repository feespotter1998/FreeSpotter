import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";
import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Shopify Fee Calculator 2026: Profit & ROAS",
  description:
    "Calculate real Shopify profit after payment processing rates (2.9% to 2.15% + 30¢), 3rd-party gateway fees, app subscriptions, and paid ad acquisition costs.",
  alternates: {
    canonical: `${siteUrl}/shopify-fee-calculator`,
  },
  openGraph: {
    title: "Shopify Fee Calculator 2026: True DTC Net Profit & ROAS Solver",
    description: "Determine exact payment gateway rates, monthly app stack expenses, and Break-Even ROAS.",
    url: `${siteUrl}/shopify-fee-calculator`,
    siteName: "FeeSpotter",
    images: [`${siteUrl}/og-image.png`],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopify Fee Calculator 2026: Profit & ROAS",
    description: "Calculate real Shopify profit after payment processing rates, 3rd-party gateway fees, and paid ad acquisition costs.",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function ShopifyCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="shopify" forceStore="shopify">
      <MarketplaceSeoContent store="shopify" />
    </CalculatorDashboard>
  );
}
