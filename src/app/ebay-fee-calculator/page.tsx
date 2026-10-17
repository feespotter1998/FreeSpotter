import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";

export const metadata: Metadata = {
  title: "eBay Fee Calculator 2026: Final Value Fees & Net Profit | FeeSpotter",
  description:
    "Calculate exact eBay seller profit after the 13.25% + $0.30 Final Value Fee, optional Store Subscriptions, and Promoted Listings Standard ad spend.",
  alternates: {
    canonical: "https://feespotter.com/ebay-fee-calculator",
  },
  openGraph: {
    title: "eBay Fee Calculator 2026: Final Value Fees & Net Profit",
    description: "Accurately compute eBay final value fees, store tier discounts, and Promoted Listings ROAS.",
    url: "https://feespotter.com/ebay-fee-calculator",
    siteName: "FeeSpotter",
    type: "website",
  },
};

export default function EbayCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="ebay" forceStore="ebay">
      <MarketplaceSeoContent store="ebay" />
    </CalculatorDashboard>
  );
}
