import type { Metadata } from "next";
import Link from "next/link";
import {
  DollarSign,
  ArrowLeft,
  ShoppingBag,
  Store,
  Package,
  Layers,
  HelpCircle,
  Home,
} from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist on FeeSpotter.",
};

export default function NotFound() {
  const quickLinks = [
    {
      name: "Etsy Fee Calculator",
      href: "/etsy-fee-calculator",
      icon: ShoppingBag,
      color: "text-orange-400 bg-orange-950/60 border-orange-800/60 hover:border-orange-500",
    },
    {
      name: "TikTok Shop Calculator",
      href: "/tiktok-shop-fee-calculator",
      icon: Store,
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-800/60 hover:border-cyan-500",
    },
    {
      name: "Amazon FBA Calculator",
      href: "/amazon-fba-fee-calculator",
      icon: Package,
      color: "text-amber-400 bg-amber-950/60 border-amber-800/60 hover:border-amber-500",
    },
    {
      name: "eBay Fee Calculator",
      href: "/ebay-fee-calculator",
      icon: Store,
      color: "text-blue-400 bg-blue-950/60 border-blue-800/60 hover:border-blue-500",
    },
    {
      name: "Shopify DTC Calculator",
      href: "/shopify-fee-calculator",
      icon: Layers,
      color: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60 hover:border-emerald-500",
    },
  ];

  return (
    <div className="min-h-dvh bg-[#09090b] text-white flex flex-col selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
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
            <span>Return Home</span>
          </Link>
        </div>
      </header>

      {/* Main 404 Body */}
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center flex flex-col items-center justify-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/80 border border-rose-800/60 text-rose-400 text-xs font-bold tracking-wide uppercase">
          <HelpCircle className="w-4 h-4" />
          Error 404 &bull; Page Missing
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Lost in the Fee Stack?
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">
            The page, calculation route, or resource you were looking for doesn&apos;t exist or was relocated. Jump back into our live fee calculators below:
          </p>
        </div>

        {/* Quick Launch Buttons */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all hover:scale-[1.01] ${link.color}`}
              >
                <div className="p-2 rounded-xl bg-zinc-900/90 border border-white/5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{link.name}</div>
                  <div className="text-[11px] text-zinc-400">2026 Live Fee Engine</div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40"
          >
            <Home className="w-4 h-4" />
            <span>Go to All Calculators</span>
          </Link>
        </div>
      </main>

      {/* Shared Site Footer */}
      <SiteFooter />
    </div>
  );
}
