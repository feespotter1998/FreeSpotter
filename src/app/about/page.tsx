import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  ShieldCheck,
  Zap,
  Target,
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About FeeSpotter — Why We Built the Multi-Marketplace Profit Auditor",
  description:
    "FeeSpotter was created to give Etsy, TikTok Shop, Amazon, eBay, and Shopify sellers a 100% deterministic, ad-free calculator to expose hidden fees and protect real net profit.",
  alternates: {
    canonical: "https://feespotter.com/about",
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-[#09090b] text-white flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Ambient background glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
      </div>

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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 space-y-12">
        <div className="space-y-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Our Mission &amp; Architectural Standard
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Stop Guessing Margins. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Spot Every Single Hidden Fee.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Marketplace platforms make billions in transaction fees, processing surcharges, and ad penalties. We built FeeSpotter so sellers finally know their exact bottom line before shipping an order.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-950/70 border border-zinc-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/60 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">100% Deterministic Math</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              No fuzzy AI hallucinations or rough estimates. Every marketplace formula is engineered with pure mathematical precision verified against official 2026 fee rate cards.
            </p>
          </div>

          <div className="bg-zinc-950/70 border border-zinc-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-950 text-teal-400 border border-teal-800/60 flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Reverse Target Pricing</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Instead of guessing a selling price and hoping for a profit, our reverse solvers tell you the exact minimum dollar price required to guarantee a healthy net margin.
            </p>
          </div>

          <div className="bg-zinc-950/70 border border-zinc-800 rounded-3xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/60 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white">Privacy &amp; Zero Bloat</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              We never sell your store catalog data, customer information, or sales figures. Your spreadsheet audits process entirely in your client browser for total data privacy.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-6 sm:p-8 space-y-4 text-zinc-300 text-sm leading-relaxed">
          <h2 className="text-xl font-bold text-white">Why FeeSpotter Was Created</h2>
          <p>
            In modern e-commerce, top-line revenue is vanity, and net bank deposits are sanity. Sellers regularly generate tens of thousands of dollars in gross merchandise volume (GMV) on platforms like TikTok Shop and Etsy, only to discover at tax season that their actual margins were negative.
          </p>
          <p>
            Between Etsy's 6.5% transaction fee on shipping, TikTok's creator affiliate splits, Amazon's Inbound Placement surcharges, eBay's final value fees on sales tax, and Shopify's third-party gateway penalties, managing spreadsheets became an exhausting daily chore.
          </p>
          <p>
            FeeSpotter replaces cumbersome spreadsheets with a unified, high-speed profit engine. Whether evaluating a single product or auditing an entire 500-SKU catalog via CSV, FeeSpotter gives you immediate financial clarity in seconds.
          </p>
        </div>

        {/* Call to action */}
        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/60 transition-all hover:scale-105"
          >
            <span>Start Auditing Your Margins Free</span>
            <TrendingUp className="w-4 h-4" />
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
            &copy; 2026 FeeSpotter. All trademarks belong to their respective marketplace owners.
          </p>
        </div>
      </footer>
    </div>
  );
}
