import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  Mail,
  MessageSquare,
  HelpCircle,
  ArrowLeft,
  Clock,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Support — FeeSpotter",
  description:
    "Have questions about marketplace fee calculations, feature requests, or partnership inquiries? Contact the FeeSpotter engineering team.",
  alternates: {
    canonical: "https://feespotter.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-[#09090b] text-white flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-zinc-950/85 border-b border-zinc-800/80">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-950/40 group-hover:scale-105 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
              FeeSpotter
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700/80 hover:border-zinc-500 text-xs font-bold text-zinc-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Calculators</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 space-y-10">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-bold">
            <MessageSquare className="w-4 h-4" />
            Direct Support &amp; Seller Community
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How Can We Help You?
          </h1>
          <p className="text-sm text-zinc-400 max-w-xl mx-auto">
            Got an unlisted fee structure, a bug report, or a feature suggestion for our 2026 fee engines? We respond to all seller inquiries within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Direct Email Card */}
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white">Email Our Team</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For custom marketplace inquiries, enterprise catalog audits, bug reports, or affiliate partnership requests.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Primary Support Inbox:
              </span>
              <a
                href="mailto:support@feespotter.com"
                className="block text-emerald-400 font-mono font-bold text-base hover:underline"
              >
                support@feespotter.com
              </a>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Typical response time: Under 24 hours</span>
              </div>
            </div>
          </div>

          {/* Quick FAQ & Help Card */}
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-white">Looking for Immediate Answers?</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We maintain in-depth fee breakdown guides and FAQs for each platform:
            </p>

            <ul className="space-y-2 text-xs text-zinc-300 pt-2">
              <li>
                <Link href="/etsy-fee-calculator" className="text-emerald-400 hover:underline">
                  &bull; Etsy 6.5% transaction &amp; Offsite Ads guide
                </Link>
              </li>
              <li>
                <Link href="/tiktok-shop-fee-calculator" className="text-emerald-400 hover:underline">
                  &bull; TikTok Shop Break-Even ROAS formula
                </Link>
              </li>
              <li>
                <Link href="/amazon-fba-fee-calculator" className="text-emerald-400 hover:underline">
                  &bull; Amazon FBA Inbound Placement &amp; Pick &amp; Pack schedules
                </Link>
              </li>
              <li>
                <Link href="/ebay-fee-calculator" className="text-emerald-400 hover:underline">
                  &bull; eBay 13.25% Final Value Fee &amp; Promoted Listings
                </Link>
              </li>
              <li>
                <Link href="/shopify-fee-calculator" className="text-emerald-400 hover:underline">
                  &bull; Shopify DTC credit card rates &amp; app stack costs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Community & Feedback Banner */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Launch Special Notice</span>
            </div>
            <p className="text-sm font-semibold text-white">
              Pro Mode is completely free for all sellers through December 1, 2026!
            </p>
            <p className="text-xs text-zinc-400">
              Enjoy unlimited catalog audits, PDF exports, and price solvers with zero paywall.
            </p>
          </div>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition-all active:scale-95 shadow-md shadow-emerald-950/50"
          >
            Launch Calculator
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-semibold text-zinc-400">
            FeeSpotter &bull; Independent Marketplace Profit Auditor
          </p>
          <p className="text-zinc-600 text-[11px]">
            &copy; 2026 FeeSpotter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
