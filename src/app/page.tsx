import type { Metadata } from "next";
import CalculatorDashboard from "@/components/CalculatorDashboard";
import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: {
    absolute: "Marketplace Fee & Profit Calculator 2026 | FeeSpotter",
  },
  description:
    "Calculate exact seller fees and true net profit on Etsy, TikTok Shop, Amazon FBA, eBay, and Shopify. Free reverse price solvers and break-even ROAS tools.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Marketplace Fee & Profit Calculator 2026 | FeeSpotter",
    description:
      "Calculate exact seller fees and true net profit on Etsy, TikTok Shop, Amazon FBA, eBay, and Shopify. Free reverse price solvers and break-even ROAS tools.",
    url: siteUrl,
    siteName: "FeeSpotter",
    images: [`${siteUrl}/og-image.png`],
    type: "website",
  },
};

const homeSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "FeeSpotter — Multi-Channel Marketplace Profit Engine",
      "url": siteUrl,
      "description":
        "Calculate exact seller fees and true net profit on Etsy, TikTok Shop, Amazon FBA, eBay, and Shopify. Free reverse price solvers and break-even ROAS tools.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
    },
    {
      "@type": "Organization",
      "name": "FeeSpotter",
      "url": siteUrl,
      "logo": `${siteUrl}/icon.png`,
      "description":
        "FeeSpotter provides deterministic, real-time fee and profit calculators for online sellers across major e-commerce platforms.",
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <CalculatorDashboard />
    </>
  );
}
