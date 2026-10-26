"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  BookOpen,
  TrendingUp,
  Calculator,
  ArrowRight,
} from "lucide-react";
import type { StoreId } from "./CalculatorDashboard";
import { STORE_URLS } from "./CalculatorDashboard";
import { getSiteUrl } from "@/lib/siteUrl";

interface FaqItem {
  question: string;
  answer: string;
}

interface MarketplaceSeoData {
  title: string;
  tagline: string;
  officialSource: {
    name: string;
    url: string;
    note: string;
  };
  lastVerifiedDate: string;
  explanation: {
    heading: string;
    paragraphs: string[];
    formulaSummary: string[];
  };
  howToGuide: {
    heading: string;
    steps: { number: string; title: string; detail: string }[];
  };
  faqs: FaqItem[];
}

export const MARKETPLACE_SEO_DATA: Record<Exclude<StoreId, "hub">, MarketplaceSeoData> = {
  etsy: {
    title: "Etsy Seller Fee Structure & Profit Mechanics (2026)",
    tagline: "Break down Etsy's multi-layered fee stack and protect your handmade and vintage margins.",
    officialSource: {
      name: "Etsy Seller Handbook — Fees & Payments Policy",
      url: "https://www.etsy.com/legal/fees/",
      note: "Official Etsy US Schedule",
    },
    lastVerifiedDate: "October 2026",
    explanation: {
      heading: "How Etsy Calculates Seller Fees in 2026",
      paragraphs: [
        "Selling on Etsy is deceptively simple until payouts arrive. Etsy operates a multi-tiered fee system where charges are deducted at different stages of the sale. When an item sells, Etsy takes a 6.5% transaction fee not only on the item price, but also on any shipping charged and optional gift wrapping.",
        "On top of the transaction fee, Etsy assesses a payment processing fee (in the US: 3.0% + $0.25) across the entire order total, including sales tax collected from the buyer. Furthermore, every item listed incurs a $0.20 listing fee that automatically renews every 4 months or every time an additional quantity is purchased.",
        "For shops reaching over $10,000 in trailing 12-month sales, Etsy mandates participation in Offsite Ads at a 12% fee on attributed sales (capped at $100 per transaction). Sellers doing under $10,000 pay 15% and can opt out. When layered together, typical Etsy fees consume 11% to 26% of your gross transaction revenue before packaging and COGS are accounted for.",
      ],
      formulaSummary: [
        "Listing Renewal: $0.20 flat per unit sold",
        "Transaction Fee: 6.5% × (Item Price + Shipping Charged)",
        "Payment Processing: 3.0% × (Total Charged) + $0.25",
        "Offsite Ads (if applicable): 12% or 15% of (Item Price + Shipping Charged) (Max $100 cap)",
        "Net Profit = Item Price + Shipping Charged − Listing Fee − Transaction Fee − Processing Fee − Offsite Ads − COGS − Actual Shipping Cost − Packaging",
      ],
    },
    howToGuide: {
      heading: "How to Accurately Calculate Your Etsy Profit in 4 Steps",
      steps: [
        {
          number: "1",
          title: "Sum Total Gross Buyer Revenue",
          detail: "Add your item list price plus the exact shipping fee you charge the buyer.",
        },
        {
          number: "2",
          title: "Deduct Baseline Marketplace Fees",
          detail: "Subtract $0.20 listing fee, 6.5% transaction fee, and 3.0% + $0.25 payment processing.",
        },
        {
          number: "3",
          title: "Include Marketing & Production COGS",
          detail: "Factor in Offsite Ads (if applicable), raw materials / print-on-demand production costs, and your true postage label expense.",
        },
        {
          number: "4",
          title: "Solve for Target Net Margin",
          detail: "Aim for at least 30% to 45% net margin to account for customer returns, damaged shipments, and shop overhead.",
        },
      ],
    },
    faqs: [
      {
        question: "How much does Etsy actually take per sale in 2026?",
        answer:
          "On average, Etsy takes between 9.5% and 12% of your total order value for organic sales (6.5% transaction fee + 3% + $0.25 payment processing + $0.20 listing renewal). If the sale comes through an Etsy Offsite Ad, Etsy takes an additional 12% or 15%, bringing total platform fees up to 24% to 27%.",
      },
      {
        question: "Does Etsy charge transaction fees on shipping fees charged to buyers?",
        answer:
          "Yes. Etsy charges the 6.5% transaction fee on the combined total of the item selling price and the shipping amount you charge the buyer. Offering 'free shipping' by rolling shipping into the item price does not lower your percentage transaction fee.",
      },
      {
        question: "How does the $0.20 listing fee renewal work?",
        answer:
          "Each listing costs $0.20 to publish for 4 months. If you list a product with a quantity of 10, you are charged $0.20 upfront. Each time a unit sells, the listing automatically renews and incurs another $0.20 charge.",
      },
      {
        question: "What is the Offsite Ads $100 fee cap?",
        answer:
          "Etsy caps the maximum Offsite Ads fee at $100 per single order, regardless of how expensive the order is. For example, on an $800 sale with a 15% rate ($120 calculated), Etsy only charges $100.",
      },
      {
        question: "How do I calculate what price I need to charge to make 35% profit on Etsy?",
        answer:
          "Use FeeSpotter's built-in 'What Should I Charge?' Price Solver tab. It calculates the exact retail price required to cover all multi-tiered fees, listing renewals, actual postage, and your target margin percentage.",
      },
      {
        question: "Why was my Etsy bank payout lower than my total sales?",
        answer:
          "Etsy operates on a continuous running statement balance ledger rather than issuing payments order-by-order. When customer funds arrive, Etsy immediately docks your accumulated listing fees ($0.20 per item), 4-month auto-renewals, Offsite Ads charges, and Etsy shipping labels directly from your balance before releasing deposits.",
      },
      {
        question: "How do Etsy Offsite Ads really work and can I turn them off?",
        answer:
          "If your shop's trailing 365-day gross sales are under $10,000, Etsy takes a 15% cut on any sale driven by Google or Facebook ads, and you can opt out in Shop Settings > Offsite Ads. If your shop has ever crossed $10,000 in any 365-day period, Offsite Ads drop to 12% and become permanently mandatory. Note: the fee is capped at $100 per transaction.",
      },
      {
        question: "What happens to Etsy fees if a buyer requests a refund or cancellation?",
        answer:
          "When you issue a full refund through Etsy, Etsy credits back the 6.5% transaction fee and processing fee to your account. However, the $0.20 listing fee is non-refundable. You also absorb the cost of packaging materials and outbound shipping postage if the carrier label was already scanned.",
      },
      {
        question: "Should I offer 'Free Shipping over $35' on Etsy?",
        answer:
          "Only if you incorporate the shipping cost into your retail item price! Offering free shipping without adjusting your prices means you eat the $4–$6 commercial postage entirely out of your profit margin. Use FeeSpotter's reverse solver to compute the exact price needed to protect your profit.",
      },
    ],
  },

  tiktok: {
    title: "TikTok Shop Seller Fees, Creator Affiliates & ROAS Engine (2026)",
    tagline: "Calculate exact net profit, creator commissions, and Break-Even ROAS on viral TikTok Shop listings.",
    officialSource: {
      name: "TikTok Shop US Academy — Fee Policy",
      url: "https://seller-us.tiktok.com/",
      note: "Official TikTok Shop US Schedule",
    },
    lastVerifiedDate: "October 2026",
    explanation: {
      heading: "Understanding TikTok Shop's 2026 Fee Structure",
      paragraphs: [
        "TikTok Shop has transitioned from an introductory subsidy model to a mature e-commerce marketplace structure. In 2026, TikTok charges a standard 6.0% base referral fee per sale across most physical merchandise categories in the US, which encompasses all marketplace commission and payment processing (with fine jewelry at 5.0% and eligible new sellers at a promotional 3.0%).",
        "However, the true financial driver on TikTok Shop is creator affiliate commissions and paid video ad spend. Most successful viral products pay 10% to 20% commission to TikTok creators who create shoppable video content. Sellers also run Spark Ads or Shop Ads directly to video listings.",
        "Without calculating Break-Even ROAS, sellers frequently achieve high GMV numbers while losing money on every single package shipped due to return clawbacks and ad spend fatigue.",
      ],
      formulaSummary: [
        "Base Marketplace Commission: 6.0% × Selling Price (inclusive of transaction processing)",
        "Creator Affiliate Commission: Seller-configured % (e.g. 15%) × Selling Price",
        "Ad Spend / CAC: Fixed dollar spend per order",
        "Refund Administration Fee: 20% of referral fee upon customer returns (capped at $5/SKU)",
        "Break-Even ROAS = Selling Price ÷ (Selling Price − COGS − Shipping − Packaging − TikTok Commission − Creator Affiliate Fee)",
      ],
    },
    howToGuide: {
      heading: "How to Compute TikTok Shop Profits & Break-Even ROAS",
      steps: [
        {
          number: "1",
          title: "Determine TikTok Baseline Fees",
          detail: "Calculate the 6.0% marketplace referral fee (which covers transaction processing).",
        },
        {
          number: "2",
          title: "Add Creator Affiliate Commissions",
          detail: "Factor in the percentage you offer TikTok creators (e.g., 10%, 15%, or 20%) who promote your product in shoppable videos.",
        },
        {
          number: "3",
          title: "Calculate Break-Even ROAS",
          detail: "Compute the minimum return on ad spend you must hit in TikTok Ads Manager so you never burn cash on paid video campaigns.",
        },
        {
          number: "4",
          title: "Simulate Return Rates",
          detail: "Include a 3% to 7% return buffer to account for impulsive impulse purchases and package refusal.",
        },
      ],
    },
    faqs: [
      {
        question: "What is the standard TikTok Shop referral fee in 2026?",
        answer:
          "TikTok Shop charges a standard 6.0% base marketplace referral fee on qualified transactions, which encompasses all platform and payment processing (fine jewelry is 5.0%, and new seller introductory rates sit at 3.0%).",
      },
      {
        question: "What is Break-Even ROAS and why does it matter on TikTok Shop?",
        answer:
          "Break-Even ROAS (Return on Ad Spend) is the exact multiplier your TikTok Ads Manager campaigns must achieve just to make $0 profit. If your Break-Even ROAS is 2.5x, you need $2.50 in sales for every $1.00 spent on ads. Anything below 2.5x means you are losing money on every sale.",
      },
      {
        question: "How do creator affiliate commissions affect my profit?",
        answer:
          "Creator commissions are deducted directly from your payout on orders generated through an affiliate's tagged video or livestream. If you set a 15% commission, TikTok automatically transfers 15% of the purchase price to the creator upon order completion.",
      },
      {
        question: "Does TikTok refund fees when a customer returns an item?",
        answer:
          "When a full return is approved, TikTok refunds their 6.0% referral fee. However, return shipping logistics and packaging losses are absorbed by the seller, making high return rates dangerous for thin-margin SKUs.",
      },
      {
        question: "Can I use FeeSpotter to solve for my minimum TikTok price?",
        answer:
          "Yes! Switch to the 'What Should I Charge?' tab to solve for the exact selling price needed to hit your target profit margin after creator fees, ads, and TikTok commission.",
      },
      {
        question: "What is the TikTok Settlement Reserve and when do I get paid?",
        answer:
          "TikTok Shop places seller revenues into a rolling Settlement Reserve (typically 10 to 14 days after carrier delivery confirmation, or longer for newly registered shops) to guard against customer chargebacks and returns. This makes early bank deposits look deceptively small until your shop builds a clean delivery track record.",
      },
      {
        question: "Why did TikTok charge me retroactive shipping fees weeks later?",
        answer:
          "Carriers (USPS, UPS, FedEx) scan parcel weights and dimensions with automated conveyor scales. If your box is even 1 ounce heavier or 0.5 inches larger than what was entered on your listing, TikTok automatically docks the dimensional weight difference directly from your settlement statement weeks later. Always enter rounded-up box dimensions to protect your margins.",
      },
      {
        question: "Who pays for TikTok 'Free Shipping' vouchers and platform discounts?",
        answer:
          "Platform-subsidized vouchers (green badges funded by TikTok) are reimbursed to the seller, meaning TikTok absorbs the discount or reimburses shipping. However, seller-funded promotions or flash sales come 100% out of your pocket. Always verify in Promotions Manager whether an offer is 'TikTok-Funded' before participating.",
      },
      {
        question: "How do creator affiliate samples affect my bottom line?",
        answer:
          "Sending free samples to TikTok creators costs your landed COGS + shipping postage + packaging. If you send 20 samples ($15 each in total cost = $300) and only 2 creators post videos generating 10 sales, your sample customer acquisition cost was $30 per order! Always factor creator sample allowances into your unit economics.",
      },
    ],
  },

  amazon: {
    title: "Amazon FBA & FBM Seller Fee Engine (2026)",
    tagline: "Calculate exact referral fees, FBA Pick & Pack tiers, Inbound Placement surcharges, and aged inventory costs.",
    officialSource: {
      name: "Amazon Seller Central — FBA Fulfillment Fee Schedules",
      url: "https://sellercentral.amazon.com/help/hub/reference/external/G201112650",
      note: "Official Amazon US Fee Schedules",
    },
    lastVerifiedDate: "October 2026",
    explanation: {
      heading: "The Complex Amazon FBA Fee Matrix in 2026",
      paragraphs: [
        "Amazon represents the largest e-commerce sales volume in the Western world, but its fee structure is the most granular and layered. Every sale incurs a category-specific Referral Fee (typically 15% with an $0.30 minimum), alongside closing fees on media categories.",
        "For Fulfillment by Amazon (FBA), sellers are billed Pick & Pack fulfillment fees based on dimensional weight and size tier (Small Standard, Large Standard, and Oversize). Amazon updates these rate cards annually each January/February and adds a mandatory Peak Fulfillment Surcharge during Q4 (mid-October to mid-January).",
        "In recent years, Amazon introduced 'behavioral micro-fees': the Inbound Placement Service Fee (averaging $0.21–$0.34/unit for minimal split shipments) and Low-Inventory-Level Fees when available stock drops below 28 days of historical sales. Tracking these fees is vital to preventing negative settlement disbursements.",
      ],
      formulaSummary: [
        "Referral Fee: 15% of Selling Price (Category variable, $0.30 min)",
        "FBA Pick & Pack: $3.22 to $7.50+ based on size tier & dimensional weight",
        "Inbound Placement Fee: ~$0.27/unit (if using minimal inbound splits)",
        "Q4 Peak Fulfillment Surcharge: +$0.20 to +$0.95/unit (Oct 15 - Jan 14)",
        "Net Deposit = Selling Price − Referral Fee − FBA Fulfillment − Inbound Placement − COGS − Shipping to FBA Hub",
      ],
    },
    howToGuide: {
      heading: "How to Calculate Real Amazon FBA Net Profit",
      steps: [
        {
          number: "1",
          title: "Identify Category Referral Percentage",
          detail: "Most categories are 15%, but consumer electronics is 8%, and low-cost apparel under $15 is 5%.",
        },
        {
          number: "2",
          title: "Select Exact FBA Size & Weight Tier",
          detail: "Calculate dimensional weight (L × W × H ÷ 139) vs actual weight and select Small Standard, Large Standard, or Oversize.",
        },
        {
          number: "3",
          title: "Include Inbound Placement & Freight",
          detail: "Factor in shipping pallet/carton costs to Amazon fulfillment centers plus the Inbound Placement Fee (~$0.27/unit).",
        },
        {
          number: "4",
          title: "Account for Category Return Rate",
          detail: "Factor in return processing fees and non-resellable disposal rates to protect your net cash flow.",
        },
      ],
    },
    faqs: [
      {
        question: "What percentage does Amazon take per sale?",
        answer:
          "Amazon charges a Referral Fee that averages 15% across most retail categories (Home, Kitchen, Toys, Beauty). Lower rates exist for Electronics (8%), while low-cost apparel has tiered rates of 5% (<$15) and 10% ($15–$20).",
      },
      {
        question: "How much are Amazon FBA fulfillment fees in 2026?",
        answer:
          "FBA Pick & Pack fees start at approximately $3.22 for Small Standard items (under 4 oz) and scale to $3.80–$5.50+ for Large Standard items (under 1–3 lbs). Oversize items start around $9.73+. In Q4 (Oct 15 – Jan 14), Amazon slaps an extra seasonal peak surcharge of $0.20 to $0.95+ per unit.",
      },
      {
        question: "What is the Amazon Inbound Placement Service fee?",
        answer:
          "Introduced in 2024, Amazon charges ~$0.21 to $0.34+ per unit if you send inventory to a single receiving center (Minimal Split) so Amazon can distribute it across the country. If you split your shipment across 4+ warehouses yourself, the fee drops to $0.",
      },
      {
        question: "What is the Low-Inventory-Level fee?",
        answer:
          "If your inventory drops below 28 days of historical supply relative to sales, Amazon charges a penalty fee per unit sold (typically $0.30 to $1.11). Keeping consistent restock schedules eliminates this fee completely.",
      },
      {
        question: "Can I audit my entire Amazon catalog with a CSV?",
        answer:
          "Yes! Use FeeSpotter's 'Catalog Audit' tab to upload your active Amazon inventory report. It instantly flags unprofitable ASINs and cash-bleeding products across your catalog.",
      },
      {
        question: "What is Break-Even ACoS % and how do I set my Amazon PPC target?",
        answer:
          "Break-Even ACoS (Advertising Cost of Sales) is your net profit margin before ad spend: (Net Margin Before Ads ÷ Selling Price) × 100. If your margin before ads is 32%, your Break-Even ACoS is exactly 32%. If your Sponsored Products campaign ACoS is 38%, you are paying Amazon more in ad spend than you earn in gross profit.",
      },
      {
        question: "How do customer returns affect Amazon FBA fees?",
        answer:
          "When an Amazon customer returns an item, Amazon refunds the category referral fee minus a 20% Refund Administration Fee (capped at $5.00). However, Amazon retains the original FBA Pick & Pack fee, and on apparel/shoes categories, charges a Returns Processing Fee ($1.85+). If the item is marked customer damaged, you also absorb the lost COGS.",
      },
      {
        question: "When is FBM (Merchant Fulfilled) more profitable than FBA?",
        answer:
          "FBM is typically more profitable for heavy or oversized products (where FBA fees jump to $10–$25+ per unit), slow-moving SKUs with high storage duration, or during Q4 holiday storage surges (Oct–Dec) when Amazon nearly quadruples monthly warehouse storage rates from $0.87 to $2.40 per cubic foot.",
      },
    ],
  },

  ebay: {
    title: "eBay Seller Fee & Promoted Listings Auditor (2026)",
    tagline: "Compute exact eBay Final Value Fees, store tier subscription savings, and Promoted Listings ROAS.",
    officialSource: {
      name: "eBay Customer Service — Selling Fees",
      url: "https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822",
      note: "Official eBay US Selling Fee Policy",
    },
    lastVerifiedDate: "October 2026",
    explanation: {
      heading: "Mastering eBay's Final Value Fee System",
      paragraphs: [
        "eBay charges a Final Value Fee (FVF) that consists of a category-specific percentage plus a fixed fee per order ($0.30 on orders $10 and under, or $0.40 on orders over $10). For standard sellers without an eBay Store, the baseline rate is 13.60% on the total amount of the sale, which includes the item price, shipping charged, and sales tax collected by eBay.",
        "Subscribing to an eBay Store (Basic, Premium, Anchor) reduces Final Value Fees across many categories (often from 13.60% down to 9.0% or 12.0%) and provides monthly insertion fee credits.",
        "Advertising is dominated by Promoted Listings Standard, where sellers set an ad rate percentage (e.g. 5% to 12%) charged only when a buyer purchases via a sponsored click within a 30-day window.",
      ],
      formulaSummary: [
        "Final Value Fee %: 13.60% standard (reduced with Store subscription)",
        "Fixed Order Fee: $0.30 per transaction ($0.40 if total sale exceeds $10)",
        "Promoted Listings Standard: Configured % × Final Sale Price",
        "Insertion Fees: Free up to monthly limit, then $0.35/listing",
        "Net Profit = Item Price + Shipping Charged − Final Value Fee − Promoted Listings Fee − COGS − Actual Shipping Cost",
      ],
    },
    howToGuide: {
      heading: "How to Compute Your True eBay Margins",
      steps: [
        {
          number: "1",
          title: "Calculate Total Transaction Amount",
          detail: "Remember that eBay assesses the 13.60% fee on item price + shipping charged + estimated state sales tax.",
        },
        {
          number: "2",
          title: "Select Store Subscription Tier",
          detail: "Toggle whether you have a Starter, Basic, or Premium Store to apply reduced Final Value Fee percentages.",
        },
        {
          number: "3",
          title: "Factor in Promoted Listings Ad Rate",
          detail: "Include your target ad rate (e.g. 7.5%) to account for competitive eBay search placement costs.",
        },
        {
          number: "4",
          title: "Verify Actual Shipping Label Costs",
          detail: "Compare what the buyer paid vs your commercial USPS/UPS label costs to detect shipping margin loss.",
        },
      ],
    },
    faqs: [
      {
        question: "What is eBay's standard Final Value Fee in 2026?",
        answer:
          "The standard eBay Final Value Fee for sellers without an eBay Store subscription is 13.60% of the total amount of the sale (item price + shipping + sales tax), plus a fixed per-order fee ($0.30 for orders $10 and under, or $0.40 for orders over $10).",
      },
      {
        question: "Does eBay charge fees on sales tax?",
        answer:
          "Yes. Under US marketplace facilitator laws, eBay collects and remits sales tax on behalf of sellers. eBay charges its final value fee percentage on the entire order total, including the sales tax portion.",
      },
      {
        question: "How do Promoted Listings Standard fees work?",
        answer:
          "Promoted Listings Standard is a pure pay-per-sale ad model. You choose an ad rate (e.g. 6%). You are only charged that 6% if a buyer clicks on your promoted listing and purchases your item within 30 days.",
      },
      {
        question: "Is an eBay Store subscription worth it to save on fees?",
        answer:
          "Generally, if you generate over $2,500 to $3,000 per month in gross sales, the fee reduction offered by a Basic Store ($21.95/mo billed annually) more than pays for the monthly subscription fee.",
      },
      {
        question: "How does FeeSpotter calculate eBay net profit?",
        answer:
          "FeeSpotter dynamically models the 13.60% rate, store tier discounts, Promoted Listings ad rate, and shipping margins in real time with 100% deterministic arithmetic.",
      },
      {
        question: "What happens to eBay fees when a buyer returns an item?",
        answer:
          "If you issue a full refund to a buyer, eBay credits back your percentage Final Value Fee, BUT eBay retains the fixed per-order fee ($0.30 or $0.40). Furthermore, if you offer free returns or the buyer opens an 'Item Not as Described' (INAD) claim, you must pay for both the original outbound postage and the return label postage, plus absorb any packaging or restocking damage.",
      },
      {
        question: "What is eBay's International Fee and Currency Conversion Fee?",
        answer:
          "If a buyer is registered outside the US or uses a non-US credit card, eBay tacks on an extra 1.65% International Fee on the total order amount. If eBay converts currency for payouts, an additional 3.0% currency conversion charge applies.",
      },
    ],
  },

  shopify: {
    title: "Shopify DTC Fee Stack, App Costs & Break-Even ROAS (2026)",
    tagline: "Compute true direct-to-consumer profit margins after Shopify Payments, 3rd-party gateway fees, app stack overhead, and Meta/Google ad CAC.",
    officialSource: {
      name: "Shopify Official Pricing & Plans",
      url: "https://www.shopify.com/pricing",
      note: "Official Shopify Plans & Payment Fees",
    },
    lastVerifiedDate: "October 2026",
    explanation: {
      heading: "The True Cost of Selling on Shopify DTC in 2026",
      paragraphs: [
        "Unlike marketplaces like Etsy or Amazon that charge 15% referral commissions, Shopify gives you direct ownership of your customer relationship. However, Shopify profit calculations involve distinct cost drivers: plan tiers, transaction rates, third-party gateway surcharges, monthly app stack expenses, and customer acquisition cost (CAC).",
        "Online credit card rates vary by plan: Basic Shopify is 2.9% + 30¢, Grow/Shopify is 2.7% + 30¢, and Advanced Shopify is 2.5% + 30¢. If you use a third-party gateway instead of Shopify Payments, Shopify charges an additional 2.0% (Basic), 1.0% (Grow), or 0.6% (Advanced) penalty fee.",
        "Crucially, successful Shopify brands invest in customer acquisition via Meta, Google, and TikTok Ads. Computing Break-Even ROAS is mandatory to ensure paid acquisition campaigns produce cash flow rather than burn through working capital.",
      ],
      formulaSummary: [
        "Shopify Payments: 2.9% to 2.5% + 30¢ per transaction (by plan tier)",
        "3rd-Party Gateway Surcharge: 2.0% / 1.0% / 0.6% if not using Shopify Payments",
        "App Stack Overhead: Monthly apps allocated across units sold",
        "Break-Even ROAS = Selling Price ÷ (Selling Price − COGS − Shipping − Packaging − Shopify Payment Fee − App Overhead)",
        "Net Profit = Selling Price + Shipping Charged − Payment Fee − Gateway Surcharge − App Cost/Unit − Ad Spend/CAC − COGS − Actual Shipping",
      ],
    },
    howToGuide: {
      heading: "How to Calculate Real Shopify DTC Net Profit",
      steps: [
        {
          number: "1",
          title: "Select Your Shopify Plan Tier",
          detail: "Set Basic (2.9% + 30¢), Grow (2.7% + 30¢), or Advanced (2.5% + 30¢) payment processing rates.",
        },
        {
          number: "2",
          title: "Amortize Monthly App Stack Expenses",
          detail: "Divide your monthly app subscriptions (Klaviyo, reviews, page builders, upsells) by your average monthly order volume.",
        },
        {
          number: "3",
          title: "Calculate Target Meta/Google ROAS",
          detail: "Determine the exact Break-Even ROAS your media buyer must maintain on paid ad campaigns.",
        },
        {
          number: "4",
          title: "Model Unrefunded Payment Fees on Returns",
          detail: "Remember that credit card processing fees (2.9% + 30¢) are not refunded when you issue customer refunds.",
        },
      ],
    },
    faqs: [
      {
        question: "What are Shopify Payments credit card rates in 2026?",
        answer:
          "Online credit card rates are 2.9% + 30¢ on Basic ($39/mo), 2.7% + 30¢ on Shopify/Grow ($105/mo), and 2.5% + 30¢ on Advanced ($399/mo). In-person POS rates are 2.6%, 2.5%, and 2.4% respectively.",
      },
      {
        question: "What is the 3rd-party payment gateway transaction fee penalty?",
        answer:
          "If you do not use Shopify Payments and instead use an external payment gateway (like an external PayPal account or Authorize.net), Shopify charges an additional fee of 2.0% (Basic), 1.0% (Shopify), or 0.6% (Advanced) on every sale.",
      },
      {
        question: "Does Shopify refund processing fees when a customer returns an order?",
        answer:
          "No. Shopify Payments (like Stripe) does not return credit card processing fees (2.9% + 30¢) when you issue a customer refund. Sellers absorb this cost on every return.",
      },
      {
        question: "How do monthly Shopify apps impact per-unit profit?",
        answer:
          "Most Shopify stores run 5–10 apps totaling $150–$600+/month. If you sell 300 orders/month with $300 in monthly apps, each order has an embedded $1.00 app overhead cost that must be deducted before computing net profit.",
      },
      {
        question: "How do I calculate Break-Even ROAS for Meta & Google Ads?",
        answer:
          "FeeSpotter calculates your exact Break-Even ROAS by dividing your selling price by your gross margin before advertising. If your result is 2.8x, your ad campaigns must generate at least $2.80 in revenue per $1.00 spent to break even.",
      },
      {
        question: "When should I upgrade from Shopify Basic ($39) to the Shopify ($105) or Advanced ($399) plan?",
        answer:
          "The upgrade decision is pure math based on credit card fee rate savings. Basic charges 2.9% + 30¢, while the Shopify plan charges 2.7% + 30¢ (a 0.2% savings for an extra $66/month). You break even on upgrading to the $105 plan once your monthly gross revenue exceeds $33,000. Upgrading to Advanced (2.5%) breaks even once monthly revenue crosses $147,000.",
      },
    ],
  },
};

export function MarketplaceSeoContent({ store }: { store: Exclude<StoreId, "hub"> }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const data = MARKETPLACE_SEO_DATA[store];

  if (!data) return null;

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": data.title,
        "url": `${getSiteUrl()}${STORE_URLS[store]}`,
        "description": data.tagline,
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
        "@type": "FAQPage",
        "mainEntity": data.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <section className="mt-12 pt-10 border-t border-zinc-800/80 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      {/* 1. Header with Freshness & Verification Trust Signals */}
      <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-950 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified &amp; Accurate
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-700/60 text-xs font-medium">
              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
              Last Verified: {data.lastVerifiedDate}
            </span>
          </div>

          <a
            href={data.officialSource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors underline decoration-zinc-700 hover:decoration-white"
          >
            <span>Source: {data.officialSource.name}</span>
            <ExternalLink className="w-3 h-3 text-zinc-500" />
          </a>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {data.title}
          </h2>
          <p className="text-sm text-zinc-400 mt-1 max-w-3xl">
            {data.tagline}
          </p>
        </div>
      </div>

      {/* 2. Deep Explanation (150-300 words) + Exact Formulas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 text-zinc-300 font-bold text-base">
            <BookOpen className="w-5 h-5 text-emerald-400 shrink-0" />
            <h3>{data.explanation.heading}</h3>
          </div>
          <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
            {data.explanation.paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <Calculator className="w-4 h-4" />
            <span>Mathematical Formula Summary</span>
          </div>
          <ul className="space-y-2 text-xs text-zinc-300">
            {data.explanation.formulaSummary.map((item, i) => (
              <li
                key={i}
                className="p-2.5 rounded-xl bg-zinc-900/70 border border-zinc-800/80 font-mono text-[11px] leading-relaxed text-zinc-200"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 3. Step-by-Step Profit Guide */}
      <div className="space-y-6 bg-zinc-950/60 border border-zinc-800/70 rounded-3xl p-6 sm:p-8">
        <div className="flex items-center gap-2.5 text-zinc-200 font-black text-lg">
          <TrendingUp className="w-5 h-5 text-emerald-400" />
          <h3>{data.howToGuide.heading}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.howToGuide.steps.map((step) => (
            <div
              key={step.number}
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-2 hover:border-zinc-700 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-black text-xs flex items-center justify-center">
                {step.number}
              </div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                {step.title}
              </h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {step.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Frequently Asked Questions (FAQ Accordion with rich SEO schema ready structure) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2.5 text-zinc-200 font-black text-lg">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          <h3>Frequently Asked Questions</h3>
        </div>

        <div className="space-y-3">
          {data.faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl overflow-hidden transition-colors hover:border-zinc-700/80"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-bold text-sm sm:text-base text-zinc-200 hover:text-white cursor-pointer gap-4"
                >
                  <span>{faq.question}</span>
                  <span className="shrink-0 text-zinc-400">
                    {isOpen ? <ChevronUp className="w-4 h-4 text-emerald-400" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-zinc-900">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Cross-Platform Internal Linking Section */}
      <div className="p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Compare Other Marketplace Fee Calculators:
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {store !== "etsy" && (
            <Link
              href="/etsy-fee-calculator"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              <span>Etsy Fee Calculator</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          )}
          {store !== "tiktok" && (
            <Link
              href="/tiktok-shop-fee-calculator"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              <span>TikTok Shop Fee Calculator</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          )}
          {store !== "amazon" && (
            <Link
              href="/amazon-fba-fee-calculator"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              <span>Amazon FBA Calculator</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          )}
          {store !== "ebay" && (
            <Link
              href="/ebay-fee-calculator"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              <span>eBay Fee Calculator</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          )}
          {store !== "shopify" && (
            <Link
              href="/shopify-fee-calculator"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/70 text-xs font-semibold text-zinc-300 hover:text-white transition-colors"
            >
              <span>Shopify Fee Calculator</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default MarketplaceSeoContent;
