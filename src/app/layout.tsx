import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { getSiteUrl } from "@/lib/siteUrl";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Marketplace Fee & Profit Calculator 2026 | FeeSpotter",
    template: "%s | FeeSpotter",
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
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FeeSpotter — Marketplace Fee & Profit Calculator 2026",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketplace Fee & Profit Calculator 2026 | FeeSpotter",
    description:
      "Calculate exact seller fees and true net profit on Etsy, TikTok Shop, Amazon FBA, eBay, and Shopify. Free reverse price solvers and break-even ROAS tools.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/icon.png", sizes: "512x512", type: "image/png" }],
  },
};

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" type="image/png" href="/icon.png" sizes="512x512" />
        <link rel="shortcut icon" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/icon.png" />
        {adsenseClientId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#f4f4f5]">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
