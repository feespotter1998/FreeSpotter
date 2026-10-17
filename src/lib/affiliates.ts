// ─────────────────────────────────────────────────────────────
// FeeSpotter — Affiliate & Advertising Configuration
// Paste your affiliate tags & AdSense Publisher IDs here or in .env.local
// ─────────────────────────────────────────────────────────────

export const AFFILIATE_CONFIG = {
  // 1. Google AdSense Settings
  adsense: {
    // Replace with your Google AdSense Publisher ID (e.g., "ca-pub-1234567890123456")
    clientId: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "",
    // Slot IDs for responsive banners
    slots: {
      dashboardBanner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DASHBOARD || "",
      comparatorBanner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_COMPARATOR || "",
      footerBanner: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || "",
    },
  },

  // 2. Etsy Seller Tools (High Conversion)
  etsy: {
    // EverBee: Etsy Product Research & Competitor Sales Spy (30% recurring monthly)
    everbee: {
      name: "EverBee",
      title: "Spy on Top-Selling Etsy Listings & Keywords",
      description: "Find high-demand, low-competition keywords and analyze competitor monthly revenue in 1 click.",
      url: process.env.NEXT_PUBLIC_EVERBEE_AFFILIATE_URL || "https://www.everbee.io/?via=FeeSpotter",
      payoutNote: "30% recurring monthly",
    },
    // Thermal Label Printers (Amazon Associates 4-8%)
    thermalPrinter: {
      name: "MUNBYN Thermal Printer",
      title: "Save Hours Shipping with a 4x6 Thermal Label Printer",
      description: "No ink, no toner. Print high-speed shipping labels directly from Etsy.",
      url: process.env.NEXT_PUBLIC_MUNBYN_AFFILIATE_URL || "https://www.amazon.com/dp/B0885RLLG1?tag=feespotter-20",
      payoutNote: "Amazon Associates",
    },
  },

  // 3. TikTok Shop Seller Tools (High Ticket)
  tiktok: {
    // Kalodata: TikTok Shop Trending Product & Creator Intelligence (20-30% rev-share)
    kalodata: {
      name: "Kalodata",
      title: "Discover Trending Viral Products on TikTok Shop",
      description: "Track daily viral product revenue, top creator affiliate GMV, and breakout product trends.",
      url: process.env.NEXT_PUBLIC_KALODATA_AFFILIATE_URL || "https://kalodata.com/?ref=feespotter",
      payoutNote: "20-30% recurring rev-share",
    },
    // Printify: Zero-Inventory Print on Demand Supplier (Up to 60% margins)
    printify: {
      name: "Printify",
      title: "Sell on TikTok Shop with Zero Upfront Inventory",
      description: "Automate fulfillment for viral custom apparel, mugs, and accessories with 60%+ margins.",
      url: process.env.NEXT_PUBLIC_PRINTIFY_AFFILIATE_URL || "https://printify.com/?ref=feespotter",
      payoutNote: "POD partner bonus",
    },
  },

  // 4. Amazon FBA Seller Tools (High Ticket Bounties)
  amazon: {
    // Helium 10: The #1 Amazon FBA Product Research & Keyword Suite (25-33% lifetime recurring)
    helium10: {
      name: "Helium 10",
      title: "Find High-Profit Amazon FBA Products & Untapped Keywords",
      description: "Analyze competitor revenue, reverse ASIN keywords, and calculate estimated FBA profit in seconds.",
      url: process.env.NEXT_PUBLIC_HELIUM10_AFFILIATE_URL || "https://crushit.helium10.com/?crsa=feespotter",
      payoutNote: "Up to 33% lifetime recurring",
    },
    // Jungle Scout: Amazon Sales Estimator & Supplier Database ($150 per referral)
    jungleScout: {
      name: "Jungle Scout",
      title: "Accurate Amazon Sales Data & Supplier Finder",
      description: "Access historical sales estimates, review automation, and verified overseas manufacturer contacts.",
      url: process.env.NEXT_PUBLIC_JUNGLESCOUT_AFFILIATE_URL || "https://junglescout.com/?ref=feespotter",
      payoutNote: "Up to $150 per referral",
    },
  },

  // 5. eBay Seller Tools
  ebay: {
    zikAnalytics: {
      name: "ZIK Analytics",
      title: "Spy on Top-Selling eBay Items & Sourcing Opportunities",
      description: "Discover high-sell-through rate items, analyze competitor stores, and find winning wholesale products.",
      url: process.env.NEXT_PUBLIC_ZIK_AFFILIATE_URL || "https://zikanalytics.com/?ref=feespotter",
      payoutNote: "Recurring affiliate rev-share",
    },
  },

  // 6. Shopify DTC Tools
  shopify: {
    klaviyo: {
      name: "Klaviyo Email & SMS",
      title: "Drive 30%+ of Your DTC Revenue on Autopilot",
      description: "Turn Shopify store traffic into repeat buyers with automated abandoned cart and post-purchase flows.",
      url: process.env.NEXT_PUBLIC_KLAVIYO_AFFILIATE_URL || "https://klaviyo.com/?ref=feespotter",
      payoutNote: "DTC partner rev-share",
    },
  },
} as const;
