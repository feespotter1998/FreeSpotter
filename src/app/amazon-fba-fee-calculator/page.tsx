import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";

export const metadata: Metadata = {
  title: "Amazon FBA Fee Calculator 2026: Exact FBA Fees & Net Profit | FeeSpotter",
  description:
    "Compute Amazon FBA profit margins factoring in the 15% category referral fee, FBA Pick & Pack weight tiers, Inbound Placement fees, and return clawbacks. Free 2026 auditor.",
  alternates: {
    canonical: "https://feespotter.com/amazon-fba-fee-calculator",
  },
  openGraph: {
    title: "Amazon FBA Fee Calculator 2026: Exact Fees & Net Profit",
    description: "Determine exact referral fees, FBA Pick & Pack size tiers, and Inbound Placement surcharges.",
    url: "https://feespotter.com/amazon-fba-fee-calculator",
    siteName: "FeeSpotter",
    type: "website",
  },
};

export default function AmazonCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="amazon" forceStore="amazon">
      <MarketplaceSeoContent store="amazon" />
    </CalculatorDashboard>
  );
}
