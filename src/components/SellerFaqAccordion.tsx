"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  AlertTriangle,
  Info,
  DollarSign,
  TrendingDown,
  ShoppingBag,
  Store,
  Package,
} from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  tag: string;
  tagColor: string;
}

const FAQS_BY_PLATFORM: Record<
  "etsy" | "tiktok" | "amazon" | "ebay" | "shopify",
  FaqItem[]
> = {
  etsy: [
    {
      question: "Why was my Etsy bank payout lower than my total sales?",
      answer:
        "Etsy operates on a continuous running statement balance ledger rather than issuing payments order-by-order. When customer funds arrive, Etsy immediately docks your accumulated listing fees ($0.20 per item), 4-month auto-renewals, Offsite Ads charges, and Etsy shipping labels directly from your balance before releasing deposits. If you list 50 items and make 1 sale, that sale's revenue first pays off your listing fee backlog.",
      tag: "Running Ledger",
      tagColor: "bg-orange-950 text-orange-400 border-orange-800/60",
    },
    {
      question: "Does Etsy take the 6.5% transaction fee on shipping and sales tax?",
      answer:
        "Yes on shipping, but not on sales tax. Etsy charges the 6.5% transaction fee on the full order amount (Item Price + Shipping Charged to Buyer) specifically to prevent sellers from listing items for $1 with $50 shipping to evade commission. On state sales tax, Etsy calculates and remits it directly to state authorities. However, credit card payment processing (3.0% + $0.25) applies to the total charged amount on the customer's card.",
      tag: "Fee Formula",
      tagColor: "bg-orange-950 text-orange-400 border-orange-800/60",
    },
    {
      question: "How do Etsy Offsite Ads really work and can I turn them off?",
      answer:
        "If your shop's trailing 365-day gross sales are under $10,000, Etsy takes a 15% cut on any sale driven by Google or Facebook ads, and you CAN opt out in Shop Settings > Offsite Ads. If your shop has ever crossed $10,000 in any 365-day period, Offsite Ads drop to 12% and become permanently mandatory. Note: the fee is capped at $100 per transaction and uses a 30-day click attribution window.",
      tag: "Offsite Ads",
      tagColor: "bg-orange-950 text-orange-400 border-orange-800/60",
    },
    {
      question: "What happens to fees if a buyer requests a refund or cancellation?",
      answer:
        "When you issue a full refund through Etsy, Etsy credits back the 6.5% transaction fee and processing fee to your account. However, the $0.20 listing fee is non-refundable. You also lose the packaging materials and the actual postage paid if the carrier label was already printed and scanned.",
      tag: "Refund Clawback",
      tagColor: "bg-orange-950 text-orange-400 border-orange-800/60",
    },
    {
      question: "Should I offer 'Free Shipping over $35'?",
      answer:
        "Only if you incorporate the shipping cost into your retail item price! Offering free shipping without adjusting your prices means you eat the $4–$6 commercial postage entirely out of your profit margin. Use our 'What Should I Charge?' solver to calculate the exact retail price needed to cover free shipping while maintaining your desired take-home margin.",
      tag: "Pricing Strategy",
      tagColor: "bg-orange-950 text-orange-400 border-orange-800/60",
    },
  ],
  tiktok: [
    {
      question: "What is Break-Even ROAS and why is it crucial for TikTok Ads?",
      answer:
        "Break-Even ROAS is the absolute minimum Return on Ad Spend you need just to avoid losing money on TikTok Ads. The formula is: Selling Price ÷ (Selling Price - All Non-Ad Costs & Fees). If your break-even ROAS is 3.2x, an ad campaign reporting 2.5x ROAS in TikTok Ads Manager is actively losing money on every single sale, regardless of high GMV numbers.",
      tag: "Ad Metrics",
      tagColor: "bg-cyan-950 text-cyan-400 border-cyan-800/60",
    },
    {
      question: "What is the TikTok Settlement Reserve and when do I get paid?",
      answer:
        "TikTok Shop places seller revenues into a rolling Settlement Reserve (typically 10 to 14 days after carrier delivery confirmation, or longer for newly registered shops) to guard against customer chargebacks and returns. This makes early bank deposits look deceptively small until your shop builds a clean delivery track record.",
      tag: "Cash Flow Hold",
      tagColor: "bg-cyan-950 text-cyan-400 border-cyan-800/60",
    },
    {
      question: "Why did TikTok charge me retroactive shipping fees weeks later?",
      answer:
        "Carriers (USPS, UPS, FedEx) scan parcel weights and dimensions with automated conveyor scales. If your box is even 1 ounce heavier or 0.5 inches larger than what was entered on your listing, TikTok automatically docks the dimensional weight difference directly from your settlement statement weeks later. Always enter rounded-up box dimensions to protect your margins.",
      tag: "Carrier Clawback",
      tagColor: "bg-cyan-950 text-cyan-400 border-cyan-800/60",
    },
    {
      question: "Who pays for TikTok 'Free Shipping' vouchers and platform discounts?",
      answer:
        "Platform-subsidized vouchers (green badges funded by TikTok) are reimbursed to the seller, meaning TikTok absorbs the discount or reimburses shipping. However, seller-funded promotions or flash sales come 100% out of your pocket. Always verify in Promotions Manager whether an offer is 'TikTok-Funded' before participating.",
      tag: "Promotions",
      tagColor: "bg-cyan-950 text-cyan-400 border-cyan-800/60",
    },
    {
      question: "How do creator affiliate samples affect my bottom line?",
      answer:
        "Sending free samples to TikTok creators costs your landed COGS + shipping postage + packaging. If you send 20 samples ($15 each in total cost = $300) and only 2 creators post videos generating 10 sales, your sample customer acquisition cost was $30 per order! Always factor creator sample allowances into your unit economics.",
      tag: "Creator Affiliate",
      tagColor: "bg-cyan-950 text-cyan-400 border-cyan-800/60",
    },
  ],
  amazon: [
    {
      question: "What is Break-Even ACoS % and how do I set my Amazon PPC target?",
      answer:
        "Break-Even ACoS (Advertising Cost of Sales) is your net profit margin before ad spend: (Net Margin Before Ads ÷ Selling Price) × 100. If your margin before ads is 32%, your Break-Even ACoS is exactly 32%. If your Sponsored Products campaign ACoS is 38%, you are paying Amazon more in ad spend than you earn in gross profit.",
      tag: "Amazon PPC",
      tagColor: "bg-amber-950 text-amber-400 border-amber-800/60",
    },
    {
      question: "What are the 2026 Inbound Placement Fees and how do I reduce them?",
      answer:
        "Amazon charges an Inbound Placement Service Fee ($0.21 to $0.68+ per unit) when you send inventory to a single fulfillment center because Amazon has to redistribute your cartons across the country. You can reduce or eliminate this fee by choosing 'Amazon-Optimized Split Shipments' (sending to multiple regional centers) or routing bulk pallets via AWD (Amazon Warehousing and Distribution).",
      tag: "FBA 2026 Fee",
      tagColor: "bg-amber-950 text-amber-400 border-amber-800/60",
    },
    {
      question: "What is the Low-Inventory-Level Fee and how do I avoid it?",
      answer:
        "Amazon charges a Low-Inventory-Level Fee ($0.32 to $0.89 per unit) on standard-size products if your inventory level consistently falls below 28 historical days of supply relative to your sales velocity. To avoid it, maintain at least 4–6 weeks of inventory buffer or switch to FBM when inventory is running low.",
      tag: "Inventory Risk",
      tagColor: "bg-amber-950 text-amber-400 border-amber-800/60",
    },
    {
      question: "How do customer returns affect Amazon fees?",
      answer:
        "When an Amazon customer returns an item, Amazon refunds the category referral fee minus a 20% Refund Administration Fee (capped at $5.00). However, Amazon retains the original FBA Pick & Pack fee, and on apparel/shoes categories, charges a Returns Processing Fee ($1.85+). If the item is marked customer damaged, you also absorb the lost COGS.",
      tag: "Return Policy",
      tagColor: "bg-amber-950 text-amber-400 border-amber-800/60",
    },
    {
      question: "When is FBM (Merchant Fulfilled) more profitable than FBA?",
      answer:
        "FBM is typically more profitable for heavy or oversized products (where FBA fees jump to $10–$25+ per unit), slow-moving SKUs with high storage duration, or during Q4 holiday storage surges (Oct–Dec) when Amazon nearly quadruples monthly warehouse storage rates from $0.87 to $2.40 per cubic foot.",
      tag: "FBA vs FBM",
      tagColor: "bg-amber-950 text-amber-400 border-amber-800/60",
    },
  ],
  ebay: [
    {
      question: "Does eBay really charge the 13.25% Final Value Fee on shipping and sales tax?",
      answer:
        "Yes. eBay charges the category Final Value Fee (typically 13.25%) on the total amount of the sale—including the item price, shipping charged to the buyer, and state sales tax collected. This is eBay's most infamous fee shock for new sellers. For example, if you sell an item for $20 with $10 shipping and the buyer pays $2.50 in sales tax, eBay assesses the 13.25% fee on the full $32.50 order total ($4.31 fee) plus the $0.30 per-order fee.",
      tag: "Tax & Shipping FVF",
      tagColor: "bg-blue-950 text-blue-400 border-blue-800/60",
    },
    {
      question: "How does Promoted Listings Standard work and when do I pay?",
      answer:
        "Promoted Listings Standard operates on a cost-per-sale model with a 30-day attribution window. You choose an ad rate (e.g. 5%), and eBay only charges that fee if a buyer clicks your sponsored ad and purchases your item within 30 days. Crucially: the ad rate is applied to the TOTAL sale price (item price + shipping + sales tax), not just the item price!",
      tag: "Promoted Listings",
      tagColor: "bg-blue-950 text-blue-400 border-blue-800/60",
    },
    {
      question: "What happens to eBay fees when a buyer returns an item?",
      answer:
        "If you issue a full refund to a buyer, eBay credits back your 13.25% Final Value Fee, BUT eBay retains the fixed $0.30 per-order fee. Furthermore, if you offer free returns or the buyer opens an 'Item Not as Described' (INAD) claim, you must pay for both the original outbound postage and the return label postage, plus absorb any packaging or restocking damage.",
      tag: "Returns & Disputes",
      tagColor: "bg-blue-950 text-blue-400 border-blue-800/60",
    },
    {
      question: "Is an eBay Store Subscription ($4.95 - $59.95/mo) worth it?",
      answer:
        "An eBay Store subscription makes sense once your monthly listing volume exceeds 250 items (saving you $0.35 per listing insertion fee) or when you sell in categories where store subscribers receive discounted Final Value Fee rates (e.g., tech and musical instruments drop from ~13.25% to ~8.7%–9%). For casual sellers with under 250 listings, the free starter tier is usually best.",
      tag: "Store Subscriptions",
      tagColor: "bg-blue-950 text-blue-400 border-blue-800/60",
    },
    {
      question: "What is eBay's International Fee and Currency Conversion Fee?",
      answer:
        "If a buyer is registered outside the US or uses a non-US credit card, eBay tacks on an extra 1.65% International Fee on the total order amount. If eBay converts currency for payouts, an additional 3.0% currency conversion charge applies. If you ship internationally, ensure your shipping markup or pricing accounts for this 1.65% cut.",
      tag: "Cross-Border Fees",
      tagColor: "bg-blue-950 text-blue-400 border-blue-800/60",
    },
  ],
  shopify: [
    {
      question: "Why does Shopify keep credit card processing fees (2.9% + 30¢) on customer returns?",
      answer:
        "Like most payment processors, Shopify Payments does NOT refund credit card interchange processing fees when you refund a customer. If a customer buys a $100 jacket and later returns it, you refund the customer $100, but Shopify still charges you the non-refundable $3.20 processing fee, plus you eat the outbound and return shipping costs. High return rates can quickly destroy DTC margins.",
      tag: "Unrefunded Fees",
      tagColor: "bg-emerald-950 text-emerald-400 border-emerald-800/60",
    },
    {
      question: "What is the 3rd-Party Payment Gateway Surcharge and how do I avoid it?",
      answer:
        "If you use an external payment gateway like PayPal Express, Stripe, or Authorize.net instead of Shopify Payments, Shopify penalizes you with an additional transaction surcharge: +2.0% on Basic ($39/mo), +1.0% on Shopify ($105/mo), and +0.5% on Advanced ($399/mo). To avoid this extra fee, enable Shopify Payments as your primary processor.",
      tag: "Gateway Surcharge",
      tagColor: "bg-emerald-950 text-emerald-400 border-emerald-800/60",
    },
    {
      question: "What is Break-Even ROAS and how do Meta/Google ad costs impact DTC margins?",
      answer:
        "Unlike marketplaces with built-in buyer traffic, Shopify stores have zero organic traffic on day one. You must buy every visitor through Meta, TikTok, or Google Ads. Break-Even ROAS is: Selling Price ÷ (Selling Price - Landed COGS - Shipping - App Overhead - Payment Fees). If your break-even ROAS is 2.8x, any ad campaign running under 2.8x is burning cash on every order.",
      tag: "DTC Blended ROAS",
      tagColor: "bg-emerald-950 text-emerald-400 border-emerald-800/60",
    },
    {
      question: "How do monthly Shopify app subscriptions (Klaviyo, Loox, PageFly) affect unit economics?",
      answer:
        "Most DTC stores run 5–10 apps averaging $100–$300/month. If your app stack costs $150/month and you only ship 100 orders a month, that's $1.50 per unit in hidden tech overhead before you even pay for COGS or shipping! Our calculator amortizes your monthly app stack into per-order unit economics.",
      tag: "App Stack Overhead",
      tagColor: "bg-emerald-950 text-emerald-400 border-emerald-800/60",
    },
    {
      question: "When should I upgrade from Shopify Basic ($39) to the Shopify ($105) or Advanced ($399) plan?",
      answer:
        "The upgrade decision is pure math based on credit card fee rate savings. Basic charges 2.9% + 30¢, while the Shopify plan charges 2.7% + 30¢ (a 0.2% savings for an extra $66/month). You break even on upgrading to the $105 plan once your monthly gross revenue exceeds $33,000. Upgrading to Advanced (2.5%) breaks even once monthly revenue crosses $147,000.",
      tag: "Plan Optimization",
      tagColor: "bg-emerald-950 text-emerald-400 border-emerald-800/60",
    },
  ],
};

interface SellerFaqAccordionProps {
  platform: "etsy" | "tiktok" | "amazon" | "ebay" | "shopify";
}

export function SellerFaqAccordion({ platform }: SellerFaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const faqs = FAQS_BY_PLATFORM[platform] || FAQS_BY_PLATFORM.etsy;

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  const getPlatformHeader = () => {
    switch (platform) {
      case "etsy":
        return {
          title: "Etsy Fee Traps & Real Seller FAQs",
          icon: <ShoppingBag className="w-5 h-5 text-orange-400" />,
          accent: "text-orange-400",
        };
      case "tiktok":
        return {
          title: "TikTok Shop Traps & Real Seller FAQs",
          icon: <Store className="w-5 h-5 text-cyan-400" />,
          accent: "text-cyan-400",
        };
      case "amazon":
        return {
          title: "Amazon FBA Fee Traps & Real Seller FAQs",
          icon: <Package className="w-5 h-5 text-amber-400" />,
          accent: "text-amber-400",
        };
      case "ebay":
        return {
          title: "eBay Fee Traps & Real Seller FAQs",
          icon: <Store className="w-5 h-5 text-blue-400" />,
          accent: "text-blue-400",
        };
      case "shopify":
        return {
          title: "Shopify DTC Fee Traps & Real Seller FAQs",
          icon: <ShoppingBag className="w-5 h-5 text-emerald-400" />,
          accent: "text-emerald-400",
        };
    }
  };

  const header = getPlatformHeader();

  return (
    <div className="bg-zinc-950/60 border border-zinc-800/90 rounded-3xl p-5 sm:p-7 space-y-4 shadow-xl">
      <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/80">
        <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-700/80 flex items-center justify-center shrink-0">
          {header.icon}
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
            {header.title}
          </h3>
          <p className="text-xs text-zinc-400">
            Plain-English mathematical answers to the most common fee confusions from top seller communities.
          </p>
        </div>
      </div>

      <div className="divide-y divide-zinc-800/60">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={idx} className="py-3.5 first:pt-1 last:pb-1">
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between gap-3 text-left group cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${faq.tagColor}`}
                  >
                    {faq.tag}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 group-hover:text-white transition-transform shrink-0 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="mt-2.5 pt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed pl-1 sm:pl-2 bg-zinc-900/40 rounded-xl p-3 border border-zinc-800/50">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
