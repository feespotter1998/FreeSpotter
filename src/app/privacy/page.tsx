import type { Metadata } from "next";
import Link from "next/link";
import { DollarSign, ShieldCheck, ArrowLeft } from "lucide-react";

import { getSiteUrl } from "@/lib/siteUrl";
import { SiteFooter } from "@/components/SiteFooter";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "FeeSpotter's Privacy Policy explains our commitment to data transparency, in-browser catalog processing, cookie policies, and affiliate disclosures.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
};

export default function PrivacyPage() {
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 flex-1 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Privacy &amp; Data Transparency
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500">
            Last Updated: October 17, 2026 &bull; Effective Immediately
          </p>
        </div>

        <div className="space-y-6 text-sm text-zinc-300 leading-relaxed bg-zinc-950/60 border border-zinc-800/80 rounded-3xl p-6 sm:p-8">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">1. Introduction &amp; Core Commitment</h2>
            <p>
              FeeSpotter (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) provides high-speed financial calculators, reverse margin solvers, and catalog audit tools for e-commerce sellers. We believe your store financial data, SKU pricing, and catalog spreadsheets belong strictly to you.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">2. In-Browser Client-Side Processing</h2>
            <p>
              Our batch catalog auditor and individual calculator functions execute entirely on your device via client-side JavaScript. When you upload a CSV spreadsheet or evaluate pricing, your data is never uploaded, stored, or analyzed on remote servers. All calculations occur inside your web browser.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">3. Information We Collect</h2>
            <p>
              When you optionally create an account or sign in using Clerk Authentication, we store basic profile identifiers (your email address, user display name, and authentication token) necessary to maintain your login session and Pro membership status. We do not store credit card numbers; payment processing is handled through PCI-compliant Merchant of Record platforms (such as Lemon Squeezy).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">4. Cookies &amp; Local Storage</h2>
            <p>
              We utilize local storage on your device solely to remember your preferred calculator inputs, active marketplace view, and UI preferences across sessions. We may utilize standard session cookies to preserve your signed-in state.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">5. Advertising &amp; Third-Party Services</h2>
            <p>
              FeeSpotter displays non-intrusive contextual banner advertisements via Google AdSense. Google AdSense and third-party advertising vendors may use cookies to serve ads based on your prior visits to this website or other internet sites. You may opt out of personalized advertising by visiting Google Ad Settings (www.aboutads.info).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">6. Affiliate Disclosure</h2>
            <p>
              FeeSpotter participates in select partner and affiliate programs (including EverBee, Kalodata, and Amazon Associates). Some links on this site may be affiliate links. If you click a sponsor card and choose to purchase a subscription or product, FeeSpotter may receive an affiliate commission at no additional cost to you. We strive to highlight reputable, battle-tested tools and services commonly utilized by marketplace sellers to maximize profitability.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">7. Data Protection Rights (GDPR &amp; CCPA)</h2>
            <p>
              You have the right to request access to, correction of, or deletion of any personal account data associated with your user profile. To exercise these rights or request complete profile deletion, please reach out via our contact page or at support@feespotter.com.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-white">8. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect modifications in our features or legal obligations. The revised version will always be accessible on this page with an updated revision date.
            </p>
          </section>
        </div>
      </main>

      {/* Shared Site Footer */}
      <SiteFooter />
    </div>
  );
}
