import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import MarketplaceSeoContent from "@/components/MarketplaceSeoContent";

export const metadata: Metadata = {
  title: "Etsy Fee Calculator 2026: See Your Real Net Profit Per Sale | FeeSpotter",
  description:
    "Calculate your exact net profit on Etsy after the 6.5% transaction fee, 3% + $0.25 payment processing, $0.20 listing renewal, and offsite ads. Free 2026 calculator & reverse price solver.",
  alternates: {
    canonical: "https://feespotter.com/etsy-fee-calculator",
  },
  openGraph: {
    title: "Etsy Fee Calculator 2026: Real Profit & Margin Solver",
    description: "Accurately compute Etsy transaction fees, payment processing, listing renewals, and offsite ads.",
    url: "https://feespotter.com/etsy-fee-calculator",
    siteName: "FeeSpotter",
    type: "website",
  },
};

export default function EtsyCalculatorPage() {
  return (
    <CalculatorDashboard initialStore="etsy" forceStore="etsy">
      <MarketplaceSeoContent store="etsy" />
    </CalculatorDashboard>
  );
}
