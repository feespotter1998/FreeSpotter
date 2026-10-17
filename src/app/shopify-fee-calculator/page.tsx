import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";

export const metadata: Metadata = {
  title: "Shopify Fee Calculator 2026: True DTC Net Profit & ROAS Solver | FeeSpotter",
  description:
    "Calculate true Shopify profit after plan transaction rates (2.9% to 2.5% + 30¢), monthly app subscriptions, payment gateways, and Meta/TikTok Ad CAC.",
  alternates: {
    canonical: "https://feespotter.com/shopify-fee-calculator",
  },
  openGraph: {
    title: "Shopify Fee Calculator 2026: True DTC Net Profit & ROAS Solver",
    description: "Determine exact payment gateway rates, monthly app stack expenses, and Break-Even ROAS.",
    url: "https://feespotter.com/shopify-fee-calculator",
    siteName: "FeeSpotter",
    type: "website",
  },
};

export default function ShopifyCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="shopify" forceStore="shopify">
      <MarketplaceSeoContent store="shopify" />
    </CalculatorDashboard>
  );
}
