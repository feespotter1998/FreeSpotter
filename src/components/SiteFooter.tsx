import React from "react";
import Link from "next/link";
import { DollarSign } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 py-10 mt-auto text-xs text-zinc-500">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-zinc-900">
          <div className="text-center md:text-left">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="font-black text-white text-base group-hover:text-emerald-400 transition-colors">
                FeeSpotter
              </span>
            </Link>
            <p className="text-zinc-500 text-xs mt-1">
              Deterministic Marketplace Profit Engine &amp; Batch Catalog Auditor
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-zinc-400 font-medium">
            <Link href="/about" className="hover:text-emerald-400 transition-colors">
              About FeeSpotter
            </Link>
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-emerald-400 transition-colors">
              Contact &amp; Support
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] text-zinc-500">
          <span className="font-semibold text-zinc-400">Marketplace Calculators:</span>
          <Link href="/etsy-fee-calculator" className="hover:text-zinc-300 transition-colors">
            Etsy Fee Calculator
          </Link>
          <span>&bull;</span>
          <Link href="/tiktok-shop-fee-calculator" className="hover:text-zinc-300 transition-colors">
            TikTok Shop Fee Calculator
          </Link>
          <span>&bull;</span>
          <Link href="/amazon-fba-fee-calculator" className="hover:text-zinc-300 transition-colors">
            Amazon FBA Calculator
          </Link>
          <span>&bull;</span>
          <Link href="/ebay-fee-calculator" className="hover:text-zinc-300 transition-colors">
            eBay Fee Calculator
          </Link>
          <span>&bull;</span>
          <Link href="/shopify-fee-calculator" className="hover:text-zinc-300 transition-colors">
            Shopify Fee Calculator
          </Link>
        </div>

        <p className="text-[11px] text-zinc-500 text-center max-w-3xl mx-auto leading-relaxed">
          <strong>FTC Affiliate Disclosure:</strong> FeeSpotter may receive affiliate commissions from featured software tools and hardware partners at no additional cost to you. We only recommend tools that provide measurable value to marketplace sellers. All trademarks, logos, and brand names are the property of their respective owners (Etsy, TikTok, Amazon, eBay, Shopify).
        </p>

        <p className="text-zinc-600 text-[11px] text-center">
          &copy; 2026 FeeSpotter. All rights reserved. Not affiliated with, endorsed by, or sponsored by Etsy, Inc., ByteDance Ltd., Amazon.com, Inc., eBay Inc., or Shopify Inc.
        </p>
      </div>
    </footer>
  );
}
