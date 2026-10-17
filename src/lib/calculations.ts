// ─────────────────────────────────────────────────────────────
// FeeSpotter — Deterministic Fee Engine
// All marketplace fee calculations live here.
// Pure functions, no side effects, 2-decimal rounding at output.
// ─────────────────────────────────────────────────────────────

/** Round to 2 decimal places (currency precision) */
export function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════

export interface EtsyInputs {
  /** Item selling price in USD */
  sellingPrice: number;
  /** Cost of goods sold */
  cogs: number;
  /** Shipping amount charged to buyer */
  shippingCharged: number;
  /** Your actual shipping cost */
  actualShippingCost: number;
  /** Packaging / materials cost */
  packagingCost: number;
  /** Labor, helper pay, or misc overhead per unit (optional, defaults to 0) */
  miscCost?: number;
  /** Offsite Ads rate: 0, 0.12, or 0.15 */
  offsiteAdsRate: 0 | 0.12 | 0.15;
  /** Number of items in this listing (for listing fee, default 1) */
  quantity: number;
  /** Estimated monthly sales volume in units (optional, defaults to 100) */
  monthlyVolume?: number;
}

export interface EtsyResult {
  grossRevenue: number;
  listingFee: number;
  transactionFee: number;
  paymentProcessingFee: number;
  offsiteAdsFee: number;
  totalFees: number;
  totalCosts: number;
  netProfit: number;
  netMarginPercent: number;
  waterfallSteps: WaterfallStep[];
  monthlyVolume: number;
  monthlyRevenue: number;
  monthlyNetProfit: number;
  monthlyTotalFees: number;
  monthlyTotalCosts: number;
  /** Out-of-pocket cash loss if buyer returns this item (lost shipping, unrefunded listing fee, damaged packing) */
  returnClawbackLoss: number;
}

export interface TikTokInputs {
  /** Item selling price in USD */
  sellingPrice: number;
  /** Cost of goods sold */
  cogs: number;
  /** Shipping cost (seller pays on TikTok Shop) */
  shippingCost: number;
  /** Packaging / materials cost */
  packagingCost: number;
  /** Labor, helper pay, or misc overhead per unit (optional, defaults to 0) */
  miscCost?: number;
  /** Creator affiliate commission rate (e.g. 0.10 = 10%) */
  affiliateCommissionRate: number;
  /** Ad spend per sale (CAC) in USD */
  adSpendPerSale: number;
  /** Return / damage rate buffer (e.g. 0.05 = 5%) */
  returnRate: number;
  /** Estimated monthly sales volume in units (optional, defaults to 250) */
  monthlyVolume?: number;
}

export interface TikTokResult {
  grossRevenue: number;
  referralFee: number;
  affiliateCommission: number;
  paymentProcessingFee: number;
  adSpend: number;
  returnLoss: number;
  totalFees: number;
  totalCosts: number;
  netProfit: number;
  netMarginPercent: number;
  waterfallSteps: WaterfallStep[];
  breakEvenRoas: number | null;
  breakEvenRoasDisplay: string;
  maxAllowableCac: number;
  monthlyVolume: number;
  monthlyRevenue: number;
  monthlyNetProfit: number;
  monthlyTotalFees: number;
  monthlyTotalCosts: number;
  /** Out-of-pocket cash loss if customer returns item (lost shipping, non-refundable platform admin, packaging) */
  returnClawbackLoss: number;
}

export type AmazonFulfillmentMode = "fba" | "fbm";

export interface AmazonInputs {
  /** Item retail selling price in USD */
  sellingPrice: number;
  /** Product cost (landed COGS from supplier) */
  cogs: number;
  /** Fulfillment mode: FBA (Amazon warehouse) or FBM (seller ships) */
  fulfillmentMode: AmazonFulfillmentMode;
  /** Amazon category referral fee rate (e.g. 0.15 = 15%) */
  referralFeeRate: number;
  /** If FBA: Pick & pack fulfillment fee per unit */
  fbaFee: number;
  /** If FBA: Estimated monthly storage + inbound placement fee per unit */
  storageAndInboundFee: number;
  /** Whether Q4 Holiday storage surcharge (Oct-Dec) is active (~$0.85/unit extra) */
  isQ4StorageSurge?: boolean;
  /** Whether item has Low-Inventory-Level Fee applied (<28 days of supply, ~$0.45/unit) */
  hasLowInventoryFee?: boolean;
  /** Whether item is in a high-return category with Returns Processing Fee (apparel/shoes, ~$1.85/return) */
  isHighReturnCategory?: boolean;
  /** If FBM: Shipping charged to buyer (often $0 if free shipping) */
  shippingCharged: number;
  /** If FBM: Actual shipping cost paid by seller */
  actualShippingCost: number;
  /** Packaging / poly bag / label materials cost */
  packagingCost: number;
  /** Labor / prep center / helper cost per unit */
  miscCost?: number;
  /** Amazon PPC ad spend / CAC per unit */
  adSpendPerSale: number;
  /** Return & unsellable shrinkage buffer rate (e.g. 0.03 = 3%) */
  returnRate: number;
  /** Estimated monthly units sold */
  monthlyVolume?: number;
}

export interface AmazonResult {
  grossRevenue: number;
  referralFee: number;
  fulfillmentFee: number;
  storageAndInboundFee: number;
  q4StorageSurgeFee: number;
  lowInventoryFee: number;
  returnsProcessingFee: number;
  adSpend: number;
  returnLoss: number;
  totalFees: number;
  totalCosts: number;
  netProfit: number;
  netMarginPercent: number;
  waterfallSteps: WaterfallStep[];
  breakEvenRoas: number | null;
  breakEvenRoasDisplay: string;
  breakEvenAcosPercent: number | null;
  breakEvenAcosDisplay: string;
  maxAllowableCac: number;
  monthlyVolume: number;
  monthlyRevenue: number;
  monthlyNetProfit: number;
  monthlyTotalFees: number;
  monthlyTotalCosts: number;
  /** True financial loss when an Amazon customer returns this item */
  returnClawbackLoss: number;
}

export interface EbayInputs {
  /** Retail item price in USD */
  sellingPrice: number;
  /** Product cost (landed COGS) */
  cogs: number;
  /** Shipping charged to buyer */
  shippingCharged: number;
  /** Actual shipping postage paid by seller */
  actualShippingCost: number;
  /** Packaging / mailer materials */
  packagingCost: number;
  /** Labor / misc overhead per unit */
  miscCost?: number;
  /** Category Final Value Fee rate (default 0.1325 = 13.25%) */
  finalValueFeeRate: number;
  /** Promoted Listings Standard ad rate (e.g. 0.04 = 4%, default 0) */
  promotedListingRate: number;
  /** Monthly eBay Store subscription cost ($0, $4.95, $21.95, $59.95) */
  storeSubscriptionMonthlyCost: number;
  /** Insertion fee per listing (usually $0 for first 250 listings, $0.35 after) */
  insertionFee: number;
  /** Return & dispute loss buffer rate (e.g. 0.03 = 3%) */
  returnRate: number;
  /** Estimated monthly units sold */
  monthlyVolume?: number;
}

export interface EbayResult {
  grossRevenue: number;
  finalValueFee: number;
  orderPerSaleFee: number;
  promotedListingFee: number;
  insertionFee: number;
  storeFeePerUnit: number;
  returnLoss: number;
  totalFees: number;
  totalCosts: number;
  netProfit: number;
  netMarginPercent: number;
  waterfallSteps: WaterfallStep[];
  breakEvenRoas: number | null;
  breakEvenRoasDisplay: string;
  maxAllowableCac: number;
  monthlyVolume: number;
  monthlyRevenue: number;
  monthlyNetProfit: number;
  monthlyTotalFees: number;
  monthlyTotalCosts: number;
  returnClawbackLoss: number;
}

export type ShopifyPlanTier = "basic" | "shopify" | "advanced" | "plus";

export interface ShopifyInputs {
  /** Retail selling price in USD */
  sellingPrice: number;
  /** Product cost (landed COGS) */
  cogs: number;
  /** Shipping charged to buyer */
  shippingCharged: number;
  /** Actual shipping postage paid by seller */
  actualShippingCost: number;
  /** Packaging / materials cost */
  packagingCost: number;
  /** Labor / fulfillment helper overhead per unit */
  miscCost?: number;
  /** Shopify plan tier: basic ($39/mo, 2.9%+30¢), shopify ($105/mo, 2.7%+30¢), advanced ($399/mo, 2.5%+30¢) */
  planTier: ShopifyPlanTier;
  /** Whether using external gateway (adds 2.0% on Basic, 1.0% on Shopify, 0.5% on Advanced) */
  isThirdPartyPaymentGateway?: boolean;
  /** Monthly app stack tech cost (Klaviyo, Loox, PageFly, etc. e.g. $120/mo) */
  monthlyAppsCost: number;
  /** Paid advertising spend per order (Meta / Google Ads CAC) */
  adSpendPerSale: number;
  /** Return & chargeback buffer rate (e.g. 0.03 = 3%) */
  returnRate: number;
  /** Estimated monthly orders */
  monthlyVolume?: number;
}

export interface ShopifyResult {
  grossRevenue: number;
  paymentProcessingFee: number;
  thirdPartyGatewayFee: number;
  subscriptionPerUnit: number;
  appsPerUnit: number;
  adSpend: number;
  returnLoss: number;
  totalFees: number;
  totalCosts: number;
  netProfit: number;
  netMarginPercent: number;
  waterfallSteps: WaterfallStep[];
  breakEvenRoas: number | null;
  breakEvenRoasDisplay: string;
  maxAllowableCac: number;
  monthlyVolume: number;
  monthlyRevenue: number;
  monthlyNetProfit: number;
  monthlyTotalFees: number;
  monthlyTotalCosts: number;
  returnClawbackLoss: number;
}

export interface WaterfallStep {
  name: string;
  value: number;
  /** Running cumulative total after this step */
  cumulative: number;
  type: "revenue" | "cost" | "fee" | "profit";
}

export interface ReverseCalcInputs {
  /** Target net margin as a decimal (e.g. 0.30 = 30%) */
  targetMarginPercent: number;
  cogs: number;
  shippingCharged: number;
  actualShippingCost: number;
  packagingCost: number;
  /** Labor, helper pay, or misc overhead per unit (optional, defaults to 0) */
  miscCost?: number;
  offsiteAdsRate: 0 | 0.12 | 0.15;
  quantity: number;
}

export interface ReverseCalcResult {
  requiredSellingPrice: number;
  expectedProfit: number;
  expectedMarginPercent: number;
  breakdown: EtsyResult;
}

export interface ReverseSolverResult<T> {
  requiredSellingPrice: number;
  expectedProfit: number;
  expectedMarginPercent: number;
  breakdown: T;
}

export interface ReverseTikTokInputs {
  targetMarginPercent: number;
  cogs: number;
  shippingCost: number;
  packagingCost: number;
  miscCost?: number;
  affiliateCommissionRate: number;
  adSpendPerSale: number;
  returnRate: number;
}

export interface ReverseAmazonInputs {
  targetMarginPercent: number;
  cogs: number;
  fulfillmentMode: AmazonFulfillmentMode;
  referralFeeRate: number;
  fbaFee: number;
  storageAndInboundFee: number;
  shippingCharged: number;
  actualShippingCost: number;
  packagingCost: number;
  miscCost?: number;
  adSpendPerSale: number;
  returnRate: number;
  isQ4StorageSurge?: boolean;
  hasLowInventoryFee?: boolean;
  isHighReturnCategory?: boolean;
}

export interface ReverseEbayInputs {
  targetMarginPercent: number;
  cogs: number;
  shippingCharged: number;
  actualShippingCost: number;
  packagingCost: number;
  miscCost?: number;
  finalValueFeeRate: number;
  promotedListingRate: number;
  storeSubscriptionMonthlyCost: number;
  insertionFee: number;
  returnRate: number;
  monthlyVolume?: number;
}

export interface ReverseShopifyInputs {
  targetMarginPercent: number;
  cogs: number;
  shippingCharged: number;
  actualShippingCost: number;
  packagingCost: number;
  miscCost?: number;
  planTier: ShopifyPlanTier;
  isThirdPartyPaymentGateway?: boolean;
  monthlyAppsCost: number;
  adSpendPerSale: number;
  returnRate: number;
  monthlyVolume?: number;
}

export type ReverseTikTokResult = ReverseSolverResult<TikTokResult>;
export type ReverseAmazonResult = ReverseSolverResult<AmazonResult>;
export type ReverseEbayResult = ReverseSolverResult<EbayResult>;
export type ReverseShopifyResult = ReverseSolverResult<ShopifyResult>;


// ═══════════════════════════════════════════════════════════════
//  ETSY FEE CALCULATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Etsy Hidden Fee Stack:
 * 1. Listing Fee:            $0.20 per item listed/sold
 * 2. Transaction Fee:        6.5% of (Item Price + Shipping Charged)
 * 3. Payment Processing:     3.0% of (Item Price + Shipping Charged) + $0.25
 * 4. Offsite Ads:            0%, 12%, or 15% of Item Price (capped at $100)
 */
export function calculateEtsyProfit(inputs: EtsyInputs): EtsyResult {
  const {
    sellingPrice,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost = 0,
    offsiteAdsRate,
    quantity,
  } = inputs;

  const grossRevenue = round2(sellingPrice + shippingCharged);

  if (grossRevenue === 0 && cogs === 0 && actualShippingCost === 0 && packagingCost === 0 && miscCost === 0) {
    const monthlyVolume =
      inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 100;
    return {
      grossRevenue: 0,
      listingFee: 0,
      transactionFee: 0,
      paymentProcessingFee: 0,
      offsiteAdsFee: 0,
      totalFees: 0,
      totalCosts: 0,
      netProfit: 0,
      netMarginPercent: 0,
      waterfallSteps: [
        { name: "Gross Revenue", value: 0, cumulative: 0, type: "revenue" },
        { name: "Net Profit", value: 0, cumulative: 0, type: "profit" },
      ],
      monthlyVolume,
      monthlyRevenue: 0,
      monthlyNetProfit: 0,
      monthlyTotalFees: 0,
      monthlyTotalCosts: 0,
      returnClawbackLoss: 0,
    };
  }

  // Fee calculations
  const listingFee = round2(0.2 * quantity);

  const transactionFee = round2(
    (sellingPrice + shippingCharged) * 0.065
  );

  const paymentProcessingFee = round2(
    (sellingPrice + shippingCharged) * 0.03 + 0.25
  );

  // Offsite ads: percentage of item price only, capped at $100
  const rawOffsiteAds = sellingPrice * offsiteAdsRate;
  const offsiteAdsFee = round2(Math.min(rawOffsiteAds, 100));

  const totalFees = round2(
    listingFee + transactionFee + paymentProcessingFee + offsiteAdsFee
  );

  const totalCosts = round2(cogs + actualShippingCost + packagingCost + miscCost);

  const netProfit = round2(grossRevenue - totalFees - totalCosts);

  const netMarginPercent =
    grossRevenue > 0 ? round2((netProfit / grossRevenue) * 100) : 0;

  // Build waterfall steps for charting
  const waterfallSteps = buildEtsyWaterfall({
    grossRevenue,
    listingFee,
    transactionFee,
    paymentProcessingFee,
    offsiteAdsFee,
    cogs,
    actualShippingCost,
    packagingCost,
    miscCost,
    netProfit,
  });

  const monthlyVolume =
    inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 100;
  const monthlyRevenue = round2(grossRevenue * monthlyVolume);
  const monthlyNetProfit = round2(netProfit * monthlyVolume);
  const monthlyTotalFees = round2(totalFees * monthlyVolume);
  const monthlyTotalCosts = round2(totalCosts * monthlyVolume);

  const returnClawbackLoss = round2(
    listingFee + actualShippingCost + packagingCost + cogs * 0.2
  );

  return {
    grossRevenue,
    listingFee,
    transactionFee,
    paymentProcessingFee,
    offsiteAdsFee,
    totalFees,
    totalCosts,
    netProfit,
    netMarginPercent,
    waterfallSteps,
    monthlyVolume,
    monthlyRevenue,
    monthlyNetProfit,
    monthlyTotalFees,
    monthlyTotalCosts,
    returnClawbackLoss,
  };
}

function buildEtsyWaterfall(data: {
  grossRevenue: number;
  listingFee: number;
  transactionFee: number;
  paymentProcessingFee: number;
  offsiteAdsFee: number;
  cogs: number;
  actualShippingCost: number;
  packagingCost: number;
  miscCost: number;
  netProfit: number;
}): WaterfallStep[] {
  let cumulative = data.grossRevenue;
  const steps: WaterfallStep[] = [
    {
      name: "Gross Revenue",
      value: data.grossRevenue,
      cumulative,
      type: "revenue",
    },
  ];

  const deductions: { name: string; value: number; type: "fee" | "cost" }[] = [
    { name: "Listing Fee", value: data.listingFee, type: "fee" },
    { name: "Transaction Fee (6.5%)", value: data.transactionFee, type: "fee" },
    {
      name: "Payment Processing",
      value: data.paymentProcessingFee,
      type: "fee",
    },
    { name: "Offsite Ads", value: data.offsiteAdsFee, type: "fee" },
    { name: "COGS", value: data.cogs, type: "cost" },
    { name: "Shipping Cost", value: data.actualShippingCost, type: "cost" },
    { name: "Packaging", value: data.packagingCost, type: "cost" },
  ];

  if (data.miscCost > 0) {
    deductions.push({
      name: "Labor & Overhead",
      value: data.miscCost,
      type: "cost",
    });
  }

  for (const d of deductions) {
    if (d.value > 0) {
      cumulative = round2(cumulative - d.value);
      steps.push({
        name: d.name,
        value: -d.value,
        cumulative,
        type: d.type,
      });
    }
  }

  steps.push({
    name: "Net Profit",
    value: data.netProfit,
    cumulative: data.netProfit,
    type: "profit",
  });

  return steps;
}

// ═══════════════════════════════════════════════════════════════
//  TIKTOK SHOP FEE CALCULATOR
// ═══════════════════════════════════════════════════════════════

/**
 * TikTok Shop Hidden Fee Stack:
 * 1. Base Referral Fee:       6.0% of selling price
 * 2. Creator Affiliate:       custom % of selling price
 * 3. Payment Processing:      2.9% of selling price + $0.30
 * 4. Ad Spend / CAC:          flat $ per sale
 * 5. Return/Damage Buffer:    % of selling price lost to returns
 */
export function calculateTikTokProfit(inputs: TikTokInputs): TikTokResult {
  const {
    sellingPrice,
    cogs,
    shippingCost,
    packagingCost,
    miscCost = 0,
    affiliateCommissionRate,
    adSpendPerSale,
    returnRate,
  } = inputs;

  const grossRevenue = round2(sellingPrice);

  if (grossRevenue === 0 && cogs === 0 && shippingCost === 0 && packagingCost === 0 && miscCost === 0 && adSpendPerSale === 0) {
    const monthlyVolume =
      inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 250;
    return {
      grossRevenue: 0,
      referralFee: 0,
      affiliateCommission: 0,
      paymentProcessingFee: 0,
      adSpend: 0,
      returnLoss: 0,
      totalFees: 0,
      totalCosts: 0,
      netProfit: 0,
      netMarginPercent: 0,
      waterfallSteps: [
        { name: "Gross Revenue", value: 0, cumulative: 0, type: "revenue" },
        { name: "Net Profit", value: 0, cumulative: 0, type: "profit" },
      ],
      breakEvenRoas: null,
      breakEvenRoasDisplay: "0.00x",
      maxAllowableCac: 0,
      monthlyVolume,
      monthlyRevenue: 0,
      monthlyNetProfit: 0,
      monthlyTotalFees: 0,
      monthlyTotalCosts: 0,
      returnClawbackLoss: 0,
    };
  }

  // Fee calculations
  const referralFee = round2(sellingPrice * 0.06);

  const affiliateCommission = round2(
    sellingPrice * affiliateCommissionRate
  );

  const paymentProcessingFee = round2(sellingPrice * 0.029 + 0.3);

  const adSpend = round2(adSpendPerSale);

  // Return loss: the % of sales that get returned — you lose COGS + shipping on those
  const returnLoss = round2(sellingPrice * returnRate);

  const totalFees = round2(
    referralFee +
      affiliateCommission +
      paymentProcessingFee +
      adSpend +
      returnLoss
  );

  const totalCosts = round2(cogs + shippingCost + packagingCost + miscCost);

  const netProfit = round2(grossRevenue - totalFees - totalCosts);

  const netMarginPercent =
    grossRevenue > 0 ? round2((netProfit / grossRevenue) * 100) : 0;

  const waterfallSteps = buildTikTokWaterfall({
    grossRevenue,
    referralFee,
    affiliateCommission,
    paymentProcessingFee,
    adSpend,
    returnLoss,
    cogs,
    shippingCost,
    packagingCost,
    miscCost,
    netProfit,
  });

  // Non-ad costs and fees per unit (to calculate break-even ad threshold)
  const costBeforeAds = round2(
    referralFee +
      affiliateCommission +
      paymentProcessingFee +
      returnLoss +
      totalCosts
  );

  const maxAllowableCac = round2(sellingPrice - costBeforeAds);

  let breakEvenRoas: number | null = null;
  let breakEvenRoasDisplay = "N/A";

  if (sellingPrice <= 0) {
    breakEvenRoas = null;
    breakEvenRoasDisplay = "N/A";
  } else if (maxAllowableCac <= 0) {
    breakEvenRoas = null;
    breakEvenRoasDisplay = "Loss Before Ads";
  } else {
    breakEvenRoas = round2(sellingPrice / maxAllowableCac);
    breakEvenRoasDisplay = `${breakEvenRoas.toFixed(2)}x`;
  }

  const monthlyVolume =
    inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 250;
  const monthlyRevenue = round2(grossRevenue * monthlyVolume);
  const monthlyNetProfit = round2(netProfit * monthlyVolume);
  const monthlyTotalFees = round2(totalFees * monthlyVolume);
  const monthlyTotalCosts = round2(totalCosts * monthlyVolume);

  const returnClawbackLoss = round2(
    referralFee * 0.2 + shippingCost + packagingCost + cogs * 0.15
  );

  return {
    grossRevenue,
    referralFee,
    affiliateCommission,
    paymentProcessingFee,
    adSpend,
    returnLoss,
    totalFees,
    totalCosts,
    netProfit,
    netMarginPercent,
    waterfallSteps,
    breakEvenRoas,
    breakEvenRoasDisplay,
    maxAllowableCac,
    monthlyVolume,
    monthlyRevenue,
    monthlyNetProfit,
    monthlyTotalFees,
    monthlyTotalCosts,
    returnClawbackLoss,
  };
}

function buildTikTokWaterfall(data: {
  grossRevenue: number;
  referralFee: number;
  affiliateCommission: number;
  paymentProcessingFee: number;
  adSpend: number;
  returnLoss: number;
  cogs: number;
  shippingCost: number;
  packagingCost: number;
  miscCost: number;
  netProfit: number;
}): WaterfallStep[] {
  let cumulative = data.grossRevenue;
  const steps: WaterfallStep[] = [
    {
      name: "Gross Revenue",
      value: data.grossRevenue,
      cumulative,
      type: "revenue",
    },
  ];

  const deductions: { name: string; value: number; type: "fee" | "cost" }[] = [
    { name: "Referral Fee (6%)", value: data.referralFee, type: "fee" },
    { name: "Affiliate Commission", value: data.affiliateCommission, type: "fee" },
    { name: "Payment Processing", value: data.paymentProcessingFee, type: "fee" },
    { name: "Ad Spend / CAC", value: data.adSpend, type: "fee" },
    { name: "Return/Damage Buffer", value: data.returnLoss, type: "fee" },
    { name: "COGS", value: data.cogs, type: "cost" },
    { name: "Shipping Cost", value: data.shippingCost, type: "cost" },
    { name: "Packaging", value: data.packagingCost, type: "cost" },
  ];

  if (data.miscCost > 0) {
    deductions.push({
      name: "Labor & Overhead",
      value: data.miscCost,
      type: "cost",
    });
  }

  for (const d of deductions) {
    if (d.value > 0) {
      cumulative = round2(cumulative - d.value);
      steps.push({
        name: d.name,
        value: -d.value,
        cumulative,
        type: d.type,
      });
    }
  }

  steps.push({
    name: "Net Profit",
    value: data.netProfit,
    cumulative: data.netProfit,
    type: "profit",
  });

  return steps;
}

// ═══════════════════════════════════════════════════════════════
//  AMAZON (FBA / FBM) FEE CALCULATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Amazon Marketplace Fee Stack:
 * 1. Referral Fee:            Category % (typically 8% - 17%, default 15%) of Total Revenue
 * 2. FBA Fulfillment Fee:     Weight/Size based Pick & Pack fee (if FBA)
 * 3. Storage & Inbound:       Estimated monthly storage & inbound placement fee (if FBA)
 * 4. Seller Shipping Cost:    Actual fulfillment postage paid by seller (if FBM)
 * 5. Packaging / Prep:        Polybag, bubble wrap, barcode labels
 * 6. PPC Ad Spend / CAC:      Optional advertising spend per unit
 * 7. Return & Damage Buffer:  Reserve for customer returns & damaged inventory
 */
export function calculateAmazonProfit(inputs: AmazonInputs): AmazonResult {
  const {
    sellingPrice,
    cogs,
    fulfillmentMode,
    referralFeeRate,
    fbaFee,
    storageAndInboundFee,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost = 0,
    adSpendPerSale,
    returnRate,
  } = inputs;

  const isFba = fulfillmentMode === "fba";
  const grossRevenue = round2(sellingPrice + (isFba ? 0 : shippingCharged));

  if (grossRevenue === 0 && cogs === 0 && actualShippingCost === 0 && packagingCost === 0 && miscCost === 0 && adSpendPerSale === 0) {
    const monthlyVolume =
      inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 250;
    return {
      grossRevenue: 0,
      referralFee: 0,
      fulfillmentFee: 0,
      storageAndInboundFee: 0,
      q4StorageSurgeFee: 0,
      lowInventoryFee: 0,
      returnsProcessingFee: 0,
      adSpend: 0,
      returnLoss: 0,
      totalFees: 0,
      totalCosts: 0,
      netProfit: 0,
      netMarginPercent: 0,
      waterfallSteps: [
        { name: "Gross Revenue", value: 0, cumulative: 0, type: "revenue" },
        { name: "Net Profit", value: 0, cumulative: 0, type: "profit" },
      ],
      breakEvenRoas: null,
      breakEvenRoasDisplay: "0.00x",
      breakEvenAcosPercent: null,
      breakEvenAcosDisplay: "0.0%",
      maxAllowableCac: 0,
      monthlyVolume,
      monthlyRevenue: 0,
      monthlyNetProfit: 0,
      monthlyTotalFees: 0,
      monthlyTotalCosts: 0,
      returnClawbackLoss: 0,
    };
  }

  // Fee calculations
  const referralFee = round2(grossRevenue * referralFeeRate);
  const fulfillmentFee = isFba ? round2(fbaFee) : 0;
  const storageFee = isFba ? round2(storageAndInboundFee) : 0;
  const q4StorageSurgeFee = isFba && inputs.isQ4StorageSurge ? 0.85 : 0;
  const lowInventoryFee = isFba && inputs.hasLowInventoryFee ? 0.45 : 0;
  const returnsProcessingFee = inputs.isHighReturnCategory ? 1.85 : 0;
  const adSpend = round2(adSpendPerSale);
  const returnLoss = round2(grossRevenue * returnRate);

  const totalFees = round2(
    referralFee +
      fulfillmentFee +
      storageFee +
      q4StorageSurgeFee +
      lowInventoryFee +
      returnsProcessingFee +
      adSpend +
      returnLoss
  );

  const shippingCostToSeller = isFba ? 0 : actualShippingCost;
  const totalCosts = round2(
    cogs + shippingCostToSeller + packagingCost + miscCost
  );

  const netProfit = round2(grossRevenue - totalFees - totalCosts);
  const netMarginPercent =
    grossRevenue > 0 ? round2((netProfit / grossRevenue) * 100) : 0;

  // Non-ad costs and fees per unit to calculate Break-Even thresholds
  const nonAdCosts = round2(
    referralFee +
      fulfillmentFee +
      storageFee +
      q4StorageSurgeFee +
      lowInventoryFee +
      returnsProcessingFee +
      returnLoss +
      totalCosts
  );

  const maxAllowableCac = round2(grossRevenue - nonAdCosts);

  let breakEvenRoas: number | null = null;
  let breakEvenRoasDisplay = "N/A";
  let breakEvenAcosPercent: number | null = null;
  let breakEvenAcosDisplay = "N/A";

  if (grossRevenue <= 0) {
    breakEvenRoas = null;
    breakEvenRoasDisplay = "N/A";
    breakEvenAcosPercent = null;
    breakEvenAcosDisplay = "N/A";
  } else if (maxAllowableCac <= 0) {
    breakEvenRoas = null;
    breakEvenRoasDisplay = "Loss Before Ads";
    breakEvenAcosPercent = null;
    breakEvenAcosDisplay = "0% (Losing $)";
  } else {
    breakEvenRoas = round2(grossRevenue / maxAllowableCac);
    breakEvenRoasDisplay = `${breakEvenRoas.toFixed(2)}x`;
    breakEvenAcosPercent = round2((maxAllowableCac / grossRevenue) * 100);
    breakEvenAcosDisplay = `${breakEvenAcosPercent.toFixed(1)}%`;
  }

  const monthlyVolume =
    inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 250;
  const monthlyRevenue = round2(grossRevenue * monthlyVolume);
  const monthlyNetProfit = round2(netProfit * monthlyVolume);
  const monthlyTotalFees = round2(totalFees * monthlyVolume);
  const monthlyTotalCosts = round2(totalCosts * monthlyVolume);

  const returnClawbackLoss = round2(
    Math.min(referralFee * 0.2, 5.0) +
      (isFba ? fulfillmentFee : actualShippingCost) +
      returnsProcessingFee +
      packagingCost +
      cogs * 0.25
  );

  const waterfallSteps = buildAmazonWaterfall({
    grossRevenue,
    referralFee,
    fulfillmentFee,
    storageAndInboundFee: storageFee,
    q4StorageSurgeFee,
    lowInventoryFee,
    returnsProcessingFee,
    adSpend,
    returnLoss,
    cogs,
    shippingCost: shippingCostToSeller,
    packagingCost,
    miscCost,
    netProfit,
    isFba,
  });

  return {
    grossRevenue,
    referralFee,
    fulfillmentFee,
    storageAndInboundFee: storageFee,
    q4StorageSurgeFee,
    lowInventoryFee,
    returnsProcessingFee,
    adSpend,
    returnLoss,
    totalFees,
    totalCosts,
    netProfit,
    netMarginPercent,
    waterfallSteps,
    breakEvenRoas,
    breakEvenRoasDisplay,
    breakEvenAcosPercent,
    breakEvenAcosDisplay,
    maxAllowableCac,
    monthlyVolume,
    monthlyRevenue,
    monthlyNetProfit,
    monthlyTotalFees,
    monthlyTotalCosts,
    returnClawbackLoss,
  };
}

function buildAmazonWaterfall(data: {
  grossRevenue: number;
  referralFee: number;
  fulfillmentFee: number;
  storageAndInboundFee: number;
  q4StorageSurgeFee?: number;
  lowInventoryFee?: number;
  returnsProcessingFee?: number;
  adSpend: number;
  returnLoss: number;
  cogs: number;
  shippingCost: number;
  packagingCost: number;
  miscCost: number;
  netProfit: number;
  isFba: boolean;
}): WaterfallStep[] {
  let cumulative = data.grossRevenue;
  const steps: WaterfallStep[] = [
    {
      name: "Gross Revenue",
      value: data.grossRevenue,
      cumulative,
      type: "revenue",
    },
  ];

  const deductions: { name: string; value: number; type: "fee" | "cost" }[] = [
    { name: "Referral Fee", value: data.referralFee, type: "fee" },
  ];

  if (data.isFba) {
    deductions.push(
      { name: "FBA Pick & Pack", value: data.fulfillmentFee, type: "fee" },
      { name: "Storage & Inbound", value: data.storageAndInboundFee, type: "fee" }
    );
    if (data.q4StorageSurgeFee && data.q4StorageSurgeFee > 0) {
      deductions.push({
        name: "Q4 Storage Surge",
        value: data.q4StorageSurgeFee,
        type: "fee",
      });
    }
    if (data.lowInventoryFee && data.lowInventoryFee > 0) {
      deductions.push({
        name: "Low-Inventory Fee",
        value: data.lowInventoryFee,
        type: "fee",
      });
    }
  }

  if (data.returnsProcessingFee && data.returnsProcessingFee > 0) {
    deductions.push({
      name: "Returns Processing Fee",
      value: data.returnsProcessingFee,
      type: "fee",
    });
  }

  deductions.push(
    { name: "Amazon PPC Ad Spend", value: data.adSpend, type: "fee" },
    { name: "Return/Damage Reserve", value: data.returnLoss, type: "fee" },
    { name: "COGS", value: data.cogs, type: "cost" }
  );

  if (!data.isFba && data.shippingCost > 0) {
    deductions.push({ name: "FBM Shipping", value: data.shippingCost, type: "cost" });
  }

  deductions.push({ name: "Packaging & Prep", value: data.packagingCost, type: "cost" });

  if (data.miscCost > 0) {
    deductions.push({
      name: "Labor & Prep Overhead",
      value: data.miscCost,
      type: "cost",
    });
  }

  for (const d of deductions) {
    if (d.value > 0) {
      cumulative = round2(cumulative - d.value);
      steps.push({
        name: d.name,
        value: -d.value,
        cumulative,
        type: d.type,
      });
    }
  }

  steps.push({
    name: "Net Profit",
    value: data.netProfit,
    cumulative: data.netProfit,
    type: "profit",
  });

  return steps;
}

// ═══════════════════════════════════════════════════════════════
//  EBAY FEE CALCULATOR
// ═══════════════════════════════════════════════════════════════

/**
 * eBay Marketplace Fee Stack:
 * 1. Final Value Fee (FVF):    Category % (standard 13.25%) applied to total order amount (item + shipping)
 * 2. Per-Order Fee:            $0.30 fixed fee per completed order
 * 3. Promoted Listings:        Ad rate % (e.g. 2% - 10%) on total sale when clicked
 * 4. Insertion Fee:            $0.35 per listing beyond 250 free monthly allocation
 * 5. Store Subscription:       Amortized monthly store fee ($0, $4.95, $21.95, $59.95)
 * 6. Return / Dispute Buffer:  Reserve for buyer return postage, chargebacks, item-not-as-described
 */
export function calculateEbayProfit(inputs: EbayInputs): EbayResult {
  const {
    sellingPrice,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost = 0,
    finalValueFeeRate = 0.1325,
    promotedListingRate = 0,
    storeSubscriptionMonthlyCost = 0,
    insertionFee = 0,
    returnRate = 0.03,
  } = inputs;

  const grossRevenue = round2(sellingPrice + shippingCharged);

  if (grossRevenue === 0 && cogs === 0 && actualShippingCost === 0 && packagingCost === 0 && miscCost === 0) {
    const monthlyVolume =
      inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 250;
    return {
      grossRevenue: 0,
      finalValueFee: 0,
      orderPerSaleFee: 0,
      promotedListingFee: 0,
      insertionFee: 0,
      storeFeePerUnit: 0,
      returnLoss: 0,
      totalFees: 0,
      totalCosts: 0,
      netProfit: 0,
      netMarginPercent: 0,
      waterfallSteps: [
        { name: "Gross Revenue", value: 0, cumulative: 0, type: "revenue" },
        { name: "Net Profit", value: 0, cumulative: 0, type: "profit" },
      ],
      breakEvenRoas: null,
      breakEvenRoasDisplay: "0.00x",
      maxAllowableCac: 0,
      monthlyVolume,
      monthlyRevenue: 0,
      monthlyNetProfit: 0,
      monthlyTotalFees: 0,
      monthlyTotalCosts: 0,
      returnClawbackLoss: 0,
    };
  }

  const finalValueFee = round2(grossRevenue * finalValueFeeRate);
  const orderPerSaleFee = 0.3;
  const promotedListingFee = round2(grossRevenue * promotedListingRate);
  const listingInsertionFee = round2(insertionFee);

  const monthlyVolume =
    inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 250;
  const storeFeePerUnit =
    storeSubscriptionMonthlyCost > 0
      ? round2(storeSubscriptionMonthlyCost / monthlyVolume)
      : 0;

  const returnLoss = round2(grossRevenue * returnRate);

  const totalFees = round2(
    finalValueFee +
      orderPerSaleFee +
      promotedListingFee +
      listingInsertionFee +
      storeFeePerUnit +
      returnLoss
  );

  const totalCosts = round2(
    cogs + actualShippingCost + packagingCost + miscCost
  );

  const netProfit = round2(grossRevenue - totalFees - totalCosts);
  const netMarginPercent =
    grossRevenue > 0 ? round2((netProfit / grossRevenue) * 100) : 0;

  // Non-ad costs for break-even calculations
  const nonAdCosts = round2(
    finalValueFee +
      orderPerSaleFee +
      listingInsertionFee +
      storeFeePerUnit +
      returnLoss +
      totalCosts
  );

  const maxAllowableCac = round2(grossRevenue - nonAdCosts);

  let breakEvenRoas: number | null = null;
  let breakEvenRoasDisplay = "N/A";

  if (grossRevenue <= 0) {
    breakEvenRoas = null;
    breakEvenRoasDisplay = "N/A";
  } else if (maxAllowableCac <= 0) {
    breakEvenRoas = null;
    breakEvenRoasDisplay = "Loss Before Ads";
  } else {
    breakEvenRoas = round2(grossRevenue / maxAllowableCac);
    breakEvenRoasDisplay = `${breakEvenRoas.toFixed(2)}x`;
  }

  const monthlyRevenue = round2(grossRevenue * monthlyVolume);
  const monthlyNetProfit = round2(netProfit * monthlyVolume);
  const monthlyTotalFees = round2(totalFees * monthlyVolume);
  const monthlyTotalCosts = round2(totalCosts * monthlyVolume);

  // Return clawback: eBay retains $0.30 fixed fee on refunds, seller loses outbound + return shipping + packaging + 15% COGS inspection/damage
  const returnClawbackLoss = round2(
    0.3 + actualShippingCost * 2 + packagingCost + cogs * 0.15
  );

  const waterfallSteps = buildEbayWaterfall({
    grossRevenue,
    finalValueFee,
    orderPerSaleFee,
    promotedListingFee,
    insertionFee: listingInsertionFee,
    storeFeePerUnit,
    returnLoss,
    cogs,
    shippingCost: actualShippingCost,
    packagingCost,
    miscCost,
    netProfit,
  });

  return {
    grossRevenue,
    finalValueFee,
    orderPerSaleFee,
    promotedListingFee,
    insertionFee: listingInsertionFee,
    storeFeePerUnit,
    returnLoss,
    totalFees,
    totalCosts,
    netProfit,
    netMarginPercent,
    waterfallSteps,
    breakEvenRoas,
    breakEvenRoasDisplay,
    maxAllowableCac,
    monthlyVolume,
    monthlyRevenue,
    monthlyNetProfit,
    monthlyTotalFees,
    monthlyTotalCosts,
    returnClawbackLoss,
  };
}

function buildEbayWaterfall(data: {
  grossRevenue: number;
  finalValueFee: number;
  orderPerSaleFee: number;
  promotedListingFee: number;
  insertionFee: number;
  storeFeePerUnit: number;
  returnLoss: number;
  cogs: number;
  shippingCost: number;
  packagingCost: number;
  miscCost: number;
  netProfit: number;
}): WaterfallStep[] {
  let cumulative = data.grossRevenue;
  const steps: WaterfallStep[] = [
    {
      name: "Gross Revenue",
      value: data.grossRevenue,
      cumulative,
      type: "revenue",
    },
  ];

  const deductions: { name: string; value: number; type: "fee" | "cost" }[] = [
    { name: "Final Value Fee (13.25%)", value: data.finalValueFee, type: "fee" },
    { name: "Per-Order Fee ($0.30)", value: data.orderPerSaleFee, type: "fee" },
  ];

  if (data.promotedListingFee > 0) {
    deductions.push({
      name: "Promoted Listings Standard",
      value: data.promotedListingFee,
      type: "fee",
    });
  }

  if (data.insertionFee > 0) {
    deductions.push({
      name: "Insertion Fee",
      value: data.insertionFee,
      type: "fee",
    });
  }

  if (data.storeFeePerUnit > 0) {
    deductions.push({
      name: "Store Subscription",
      value: data.storeFeePerUnit,
      type: "fee",
    });
  }

  deductions.push(
    { name: "Return & Dispute Reserve", value: data.returnLoss, type: "fee" },
    { name: "COGS", value: data.cogs, type: "cost" },
    { name: "Outbound Shipping", value: data.shippingCost, type: "cost" },
    { name: "Packaging & Mailers", value: data.packagingCost, type: "cost" }
  );

  if (data.miscCost > 0) {
    deductions.push({
      name: "Labor & Overhead",
      value: data.miscCost,
      type: "cost",
    });
  }

  for (const d of deductions) {
    if (d.value > 0) {
      cumulative = round2(cumulative - d.value);
      steps.push({
        name: d.name,
        value: -d.value,
        cumulative,
        type: d.type,
      });
    }
  }

  steps.push({
    name: "Net Profit",
    value: data.netProfit,
    cumulative: data.netProfit,
    type: "profit",
  });

  return steps;
}

// ═══════════════════════════════════════════════════════════════
//  SHOPIFY DTC PROFIT CALCULATOR
// ═══════════════════════════════════════════════════════════════

/**
 * Shopify Direct-to-Consumer (DTC) Fee Stack:
 * 1. Payment Processing (Shopify Payments): Tiered rate (Basic 2.9% + 30¢, Shopify 2.7% + 30¢, Advanced 2.5% + 30¢)
 * 2. 3rd-Party Payment Surcharge:            Optional +2.0%, +1.0%, +0.5% if not using Shopify Payments
 * 3. Subscription Overhead per Order:        Plan monthly fee ($39, $105, $399) amortized over monthly sales volume
 * 4. App Stack Monthly Tech Overhead:        Klaviyo, Loox, Recharge, PageFly amortized over volume
 * 5. Paid Advertising CAC (Meta / Google):   Cost to acquire each customer order
 * 6. Return & Chargeback Buffer:             Reserve for refunds & retained processing fees
 */
export function calculateShopifyProfit(inputs: ShopifyInputs): ShopifyResult {
  const {
    sellingPrice,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost = 0,
    planTier = "basic",
    isThirdPartyPaymentGateway = false,
    monthlyAppsCost = 89,
    adSpendPerSale = 0,
    returnRate = 0.04,
  } = inputs;

  const grossRevenue = round2(sellingPrice + shippingCharged);

  if (grossRevenue === 0 && cogs === 0 && actualShippingCost === 0 && packagingCost === 0 && miscCost === 0 && adSpendPerSale === 0) {
    const monthlyVolume =
      inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 250;
    return {
      grossRevenue: 0,
      paymentProcessingFee: 0,
      thirdPartyGatewayFee: 0,
      subscriptionPerUnit: 0,
      appsPerUnit: 0,
      adSpend: 0,
      returnLoss: 0,
      totalFees: 0,
      totalCosts: 0,
      netProfit: 0,
      netMarginPercent: 0,
      waterfallSteps: [
        { name: "Gross Revenue", value: 0, cumulative: 0, type: "revenue" },
        { name: "Net Profit", value: 0, cumulative: 0, type: "profit" },
      ],
      breakEvenRoas: null,
      breakEvenRoasDisplay: "0.00x",
      maxAllowableCac: 0,
      monthlyVolume,
      monthlyRevenue: 0,
      monthlyNetProfit: 0,
      monthlyTotalFees: 0,
      monthlyTotalCosts: 0,
      returnClawbackLoss: 0,
    };
  }

  const monthlyVolume =
    inputs.monthlyVolume && inputs.monthlyVolume > 0 ? inputs.monthlyVolume : 250;

  // Plan rates & subscription costs
  let processingRate = 0.029;
  let planMonthlyCost = 39;
  let thirdPartyGatewayRate = 0.02;

  if (planTier === "shopify") {
    processingRate = 0.027;
    planMonthlyCost = 105;
    thirdPartyGatewayRate = 0.01;
  } else if (planTier === "advanced") {
    processingRate = 0.025;
    planMonthlyCost = 399;
    thirdPartyGatewayRate = 0.005;
  } else if (planTier === "plus") {
    processingRate = 0.0215;
    planMonthlyCost = 2000;
    thirdPartyGatewayRate = 0.002;
  }

  const paymentProcessingFee = round2(grossRevenue * processingRate + 0.3);
  const thirdPartyGatewayFee = isThirdPartyPaymentGateway
    ? round2(grossRevenue * thirdPartyGatewayRate)
    : 0;

  const subscriptionPerUnit = round2(planMonthlyCost / monthlyVolume);
  const appsPerUnit = round2(monthlyAppsCost / monthlyVolume);
  const adSpend = round2(adSpendPerSale);
  const returnLoss = round2(grossRevenue * returnRate);

  const totalFees = round2(
    paymentProcessingFee +
      thirdPartyGatewayFee +
      subscriptionPerUnit +
      appsPerUnit +
      adSpend +
      returnLoss
  );

  const totalCosts = round2(
    cogs + actualShippingCost + packagingCost + miscCost
  );

  const netProfit = round2(grossRevenue - totalFees - totalCosts);
  const netMarginPercent =
    grossRevenue > 0 ? round2((netProfit / grossRevenue) * 100) : 0;

  // Non-ad costs for break-even calculations
  const nonAdCosts = round2(
    paymentProcessingFee +
      thirdPartyGatewayFee +
      subscriptionPerUnit +
      appsPerUnit +
      returnLoss +
      totalCosts
  );

  const maxAllowableCac = round2(grossRevenue - nonAdCosts);

  let breakEvenRoas: number | null = null;
  let breakEvenRoasDisplay = "N/A";

  if (grossRevenue <= 0) {
    breakEvenRoas = null;
    breakEvenRoasDisplay = "N/A";
  } else if (maxAllowableCac <= 0) {
    breakEvenRoas = null;
    breakEvenRoasDisplay = "Loss Before Ads";
  } else {
    breakEvenRoas = round2(grossRevenue / maxAllowableCac);
    breakEvenRoasDisplay = `${breakEvenRoas.toFixed(2)}x`;
  }

  const monthlyRevenue = round2(grossRevenue * monthlyVolume);
  const monthlyNetProfit = round2(netProfit * monthlyVolume);
  const monthlyTotalFees = round2(totalFees * monthlyVolume);
  const monthlyTotalCosts = round2(totalCosts * monthlyVolume);

  // Return clawback: Shopify Payments NEVER refunds credit card transaction fees (2.9% + 30¢) on refunds!
  // Plus double shipping, packaging, and 15% COGS restocking/damage loss.
  const returnClawbackLoss = round2(
    paymentProcessingFee + actualShippingCost * 2 + packagingCost + cogs * 0.15
  );

  const waterfallSteps = buildShopifyWaterfall({
    grossRevenue,
    paymentProcessingFee,
    thirdPartyGatewayFee,
    subscriptionPerUnit,
    appsPerUnit,
    adSpend,
    returnLoss,
    cogs,
    shippingCost: actualShippingCost,
    packagingCost,
    miscCost,
    netProfit,
  });

  return {
    grossRevenue,
    paymentProcessingFee,
    thirdPartyGatewayFee,
    subscriptionPerUnit,
    appsPerUnit,
    adSpend,
    returnLoss,
    totalFees,
    totalCosts,
    netProfit,
    netMarginPercent,
    waterfallSteps,
    breakEvenRoas,
    breakEvenRoasDisplay,
    maxAllowableCac,
    monthlyVolume,
    monthlyRevenue,
    monthlyNetProfit,
    monthlyTotalFees,
    monthlyTotalCosts,
    returnClawbackLoss,
  };
}

function buildShopifyWaterfall(data: {
  grossRevenue: number;
  paymentProcessingFee: number;
  thirdPartyGatewayFee: number;
  subscriptionPerUnit: number;
  appsPerUnit: number;
  adSpend: number;
  returnLoss: number;
  cogs: number;
  shippingCost: number;
  packagingCost: number;
  miscCost: number;
  netProfit: number;
}): WaterfallStep[] {
  let cumulative = data.grossRevenue;
  const steps: WaterfallStep[] = [
    {
      name: "Gross Revenue",
      value: data.grossRevenue,
      cumulative,
      type: "revenue",
    },
  ];

  const deductions: { name: string; value: number; type: "fee" | "cost" }[] = [
    { name: "Payment Processing", value: data.paymentProcessingFee, type: "fee" },
  ];

  if (data.thirdPartyGatewayFee > 0) {
    deductions.push({
      name: "3rd-Party Gateway Fee",
      value: data.thirdPartyGatewayFee,
      type: "fee",
    });
  }

  deductions.push(
    { name: "Shopify Plan Overhead", value: data.subscriptionPerUnit, type: "fee" },
    { name: "App Stack Overhead", value: data.appsPerUnit, type: "fee" }
  );

  if (data.adSpend > 0) {
    deductions.push({
      name: "Meta / Google CAC",
      value: data.adSpend,
      type: "fee",
    });
  }

  deductions.push(
    { name: "Return / Chargeback Buffer", value: data.returnLoss, type: "fee" },
    { name: "COGS", value: data.cogs, type: "cost" },
    { name: "Outbound Shipping", value: data.shippingCost, type: "cost" },
    { name: "Packaging & Mailers", value: data.packagingCost, type: "cost" }
  );

  if (data.miscCost > 0) {
    deductions.push({
      name: "Labor & Overhead",
      value: data.miscCost,
      type: "cost",
    });
  }

  for (const d of deductions) {
    if (d.value > 0) {
      cumulative = round2(cumulative - d.value);
      steps.push({
        name: d.name,
        value: -d.value,
        cumulative,
        type: d.type,
      });
    }
  }

  steps.push({
    name: "Net Profit",
    value: data.netProfit,
    cumulative: data.netProfit,
    type: "profit",
  });

  return steps;
}

// ═══════════════════════════════════════════════════════════════
//  REVERSE CALCULATOR — "What Should I Charge?"
// ═══════════════════════════════════════════════════════════════

export function solveEtsyPriceForTargetMargin(
  inputs: ReverseCalcInputs
): ReverseCalcResult {
  const {
    targetMarginPercent,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost = 0,
    offsiteAdsRate,
    quantity,
  } = inputs;

  if (cogs === 0 && actualShippingCost === 0 && packagingCost === 0 && miscCost === 0 && shippingCharged === 0) {
    const emptyBreakdown = calculateEtsyProfit({
      sellingPrice: 0,
      cogs: 0,
      shippingCharged: 0,
      actualShippingCost: 0,
      packagingCost: 0,
      miscCost: 0,
      offsiteAdsRate,
      quantity,
    });
    return {
      requiredSellingPrice: 0,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: emptyBreakdown,
    };
  }

  const targetMargin = targetMarginPercent / 100;
  const fixedFees = round2(0.2 * quantity + 0.25);
  const variableCosts = cogs + actualShippingCost + packagingCost + miscCost;

  // k = portion of revenue that remains after percentage-based platform fees and target margin
  const k = 1 - 0.095 - targetMargin;

  const denominator = k - offsiteAdsRate;

  if (denominator <= 0) {
    const impossibleBreakdown = calculateEtsyProfit({
      sellingPrice: 0,
      cogs,
      shippingCharged,
      actualShippingCost,
      packagingCost,
      miscCost,
      offsiteAdsRate,
      quantity,
    });
    return {
      requiredSellingPrice: Infinity,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: impossibleBreakdown,
    };
  }

  const numerator = fixedFees + variableCosts - k * shippingCharged;
  let requiredPrice = numerator / denominator;

  if (requiredPrice * offsiteAdsRate > 100 && offsiteAdsRate > 0) {
    const kNoAds = 1 - 0.095 - targetMargin;
    if (kNoAds <= 0) {
      const impossibleBreakdown = calculateEtsyProfit({
        sellingPrice: 0,
        cogs,
        shippingCharged,
        actualShippingCost,
        packagingCost,
        miscCost,
        offsiteAdsRate,
        quantity,
      });
      return {
        requiredSellingPrice: Infinity,
        expectedProfit: 0,
        expectedMarginPercent: 0,
        breakdown: impossibleBreakdown,
      };
    }
    requiredPrice = (fixedFees + 100 + variableCosts) / kNoAds - shippingCharged;
  }

  requiredPrice = Math.ceil(requiredPrice * 100) / 100;
  requiredPrice = Math.max(requiredPrice, 0.01);

  const breakdown = calculateEtsyProfit({
    sellingPrice: requiredPrice,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost,
    offsiteAdsRate,
    quantity,
  });

  return {
    requiredSellingPrice: round2(requiredPrice),
    expectedProfit: breakdown.netProfit,
    expectedMarginPercent: breakdown.netMarginPercent,
    breakdown,
  };
}

export function solveTikTokPriceForTargetMargin(
  inputs: ReverseTikTokInputs
): ReverseTikTokResult {
  const {
    targetMarginPercent,
    cogs,
    shippingCost,
    packagingCost,
    miscCost = 0,
    affiliateCommissionRate,
    adSpendPerSale = 0,
    returnRate = 0.05,
  } = inputs;

  if (cogs === 0 && shippingCost === 0 && packagingCost === 0 && miscCost === 0 && adSpendPerSale === 0) {
    const emptyBreakdown = calculateTikTokProfit({
      sellingPrice: 0,
      cogs: 0,
      shippingCost: 0,
      packagingCost: 0,
      miscCost: 0,
      affiliateCommissionRate,
      adSpendPerSale: 0,
      returnRate,
    });
    return {
      requiredSellingPrice: 0,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: emptyBreakdown,
    };
  }

  const targetMargin = targetMarginPercent / 100;
  const pctRate = 0.06 + 0.029 + affiliateCommissionRate + returnRate;
  const fixedDeductions = 0.30 + adSpendPerSale + cogs + shippingCost + packagingCost + miscCost;
  const denominator = 1 - pctRate - targetMargin;

  if (denominator <= 0) {
    const impossible = calculateTikTokProfit({
      sellingPrice: 0,
      cogs,
      shippingCost,
      packagingCost,
      miscCost,
      affiliateCommissionRate,
      adSpendPerSale,
      returnRate,
    });
    return {
      requiredSellingPrice: Infinity,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: impossible,
    };
  }

  let requiredPrice = fixedDeductions / denominator;
  requiredPrice = Math.ceil(requiredPrice * 100) / 100;
  requiredPrice = Math.max(requiredPrice, 0.01);

  const breakdown = calculateTikTokProfit({
    sellingPrice: requiredPrice,
    cogs,
    shippingCost,
    packagingCost,
    miscCost,
    affiliateCommissionRate,
    adSpendPerSale,
    returnRate,
  });

  return {
    requiredSellingPrice: round2(requiredPrice),
    expectedProfit: breakdown.netProfit,
    expectedMarginPercent: breakdown.netMarginPercent,
    breakdown,
  };
}

export function solveAmazonPriceForTargetMargin(
  inputs: ReverseAmazonInputs
): ReverseAmazonResult {
  const {
    targetMarginPercent,
    cogs,
    fulfillmentMode = "fba",
    referralFeeRate = 0.15,
    fbaFee = 3.86,
    storageAndInboundFee = 0.35,
    shippingCharged = 0,
    actualShippingCost = 0,
    packagingCost = 0.5,
    miscCost = 0,
    adSpendPerSale = 0,
    returnRate = 0.03,
    isQ4StorageSurge = false,
    hasLowInventoryFee = false,
    isHighReturnCategory = false,
  } = inputs;

  if (cogs === 0 && actualShippingCost === 0 && packagingCost === 0 && miscCost === 0 && adSpendPerSale === 0) {
    const emptyBreakdown = calculateAmazonProfit({
      sellingPrice: 0,
      cogs: 0,
      fulfillmentMode,
      referralFeeRate,
      fbaFee,
      storageAndInboundFee,
      shippingCharged: 0,
      actualShippingCost: 0,
      packagingCost: 0,
      miscCost: 0,
      adSpendPerSale: 0,
      returnRate,
      isQ4StorageSurge,
      hasLowInventoryFee,
      isHighReturnCategory,
    });
    return {
      requiredSellingPrice: 0,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: emptyBreakdown,
    };
  }

  const isFba = fulfillmentMode === "fba";
  const targetMargin = targetMarginPercent / 100;

  const pctRate = referralFeeRate + returnRate;
  const denominator = 1 - pctRate - targetMargin;

  const fbaFixed = isFba
    ? fbaFee + storageAndInboundFee + (isQ4StorageSurge ? 0.85 : 0) + (hasLowInventoryFee ? 0.45 : 0)
    : 0;
  const returnsFee = isHighReturnCategory ? 1.85 : 0;
  const shippingPostage = isFba ? 0 : actualShippingCost;
  const totalVariableCosts = cogs + shippingPostage + packagingCost + miscCost;
  const fixedDeductions = fbaFixed + returnsFee + adSpendPerSale + totalVariableCosts;

  if (denominator <= 0) {
    const impossible = calculateAmazonProfit({
      sellingPrice: 0,
      cogs,
      fulfillmentMode,
      referralFeeRate,
      fbaFee,
      storageAndInboundFee,
      shippingCharged,
      actualShippingCost,
      packagingCost,
      miscCost,
      adSpendPerSale,
      returnRate,
      isQ4StorageSurge,
      hasLowInventoryFee,
      isHighReturnCategory,
    });
    return {
      requiredSellingPrice: Infinity,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: impossible,
    };
  }

  const requiredRevenue = fixedDeductions / denominator;
  let requiredPrice = isFba ? requiredRevenue : requiredRevenue - shippingCharged;

  if (requiredRevenue * referralFeeRate < 0.30) {
    const denomMin = 1 - returnRate - targetMargin;
    if (denomMin > 0) {
      const revMin = (0.30 + fixedDeductions - fbaFixed) / denomMin;
      requiredPrice = isFba ? revMin : revMin - shippingCharged;
    }
  }

  requiredPrice = Math.ceil(requiredPrice * 100) / 100;
  requiredPrice = Math.max(requiredPrice, 0.01);

  const breakdown = calculateAmazonProfit({
    sellingPrice: requiredPrice,
    cogs,
    fulfillmentMode,
    referralFeeRate,
    fbaFee,
    storageAndInboundFee,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost,
    adSpendPerSale,
    returnRate,
    isQ4StorageSurge,
    hasLowInventoryFee,
    isHighReturnCategory,
  });

  return {
    requiredSellingPrice: round2(requiredPrice),
    expectedProfit: breakdown.netProfit,
    expectedMarginPercent: breakdown.netMarginPercent,
    breakdown,
  };
}

export function solveEbayPriceForTargetMargin(
  inputs: ReverseEbayInputs
): ReverseEbayResult {
  const {
    targetMarginPercent,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost = 0,
    finalValueFeeRate = 0.1325,
    promotedListingRate = 0,
    storeSubscriptionMonthlyCost = 0,
    insertionFee = 0,
    returnRate = 0.03,
    monthlyVolume = 250,
  } = inputs;

  if (cogs === 0 && actualShippingCost === 0 && packagingCost === 0 && miscCost === 0 && shippingCharged === 0) {
    const emptyBreakdown = calculateEbayProfit({
      sellingPrice: 0,
      cogs: 0,
      shippingCharged: 0,
      actualShippingCost: 0,
      packagingCost: 0,
      miscCost: 0,
      finalValueFeeRate,
      promotedListingRate,
      storeSubscriptionMonthlyCost: 0,
      insertionFee: 0,
      returnRate,
      monthlyVolume,
    });
    return {
      requiredSellingPrice: 0,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: emptyBreakdown,
    };
  }

  const targetMargin = targetMarginPercent / 100;
  const pctRate = finalValueFeeRate + promotedListingRate + returnRate;
  const denominator = 1 - pctRate - targetMargin;

  const storeFeePerUnit = storeSubscriptionMonthlyCost > 0 ? storeSubscriptionMonthlyCost / monthlyVolume : 0;
  const orderPerSaleFee = 0.30;
  const fixedDeductions = orderPerSaleFee + insertionFee + storeFeePerUnit + cogs + actualShippingCost + packagingCost + miscCost;

  if (denominator <= 0) {
    const impossible = calculateEbayProfit({
      sellingPrice: 0,
      cogs,
      shippingCharged,
      actualShippingCost,
      packagingCost,
      miscCost,
      finalValueFeeRate,
      promotedListingRate,
      storeSubscriptionMonthlyCost,
      insertionFee,
      returnRate,
      monthlyVolume,
    });
    return {
      requiredSellingPrice: Infinity,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: impossible,
    };
  }

  const requiredRevenue = fixedDeductions / denominator;
  let requiredPrice = requiredRevenue - shippingCharged;

  if (requiredRevenue <= 10.0) {
    const fixedLow = 0.40 + insertionFee + storeFeePerUnit + cogs + actualShippingCost + packagingCost + miscCost;
    requiredPrice = fixedLow / denominator - shippingCharged;
  }

  requiredPrice = Math.ceil(requiredPrice * 100) / 100;
  requiredPrice = Math.max(requiredPrice, 0.01);

  const breakdown = calculateEbayProfit({
    sellingPrice: requiredPrice,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost,
    finalValueFeeRate,
    promotedListingRate,
    storeSubscriptionMonthlyCost,
    insertionFee,
    returnRate,
    monthlyVolume,
  });

  return {
    requiredSellingPrice: round2(requiredPrice),
    expectedProfit: breakdown.netProfit,
    expectedMarginPercent: breakdown.netMarginPercent,
    breakdown,
  };
}

export function solveShopifyPriceForTargetMargin(
  inputs: ReverseShopifyInputs
): ReverseShopifyResult {
  const {
    targetMarginPercent,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost = 0,
    planTier = "basic",
    isThirdPartyPaymentGateway = false,
    monthlyAppsCost = 89,
    adSpendPerSale = 0,
    returnRate = 0.04,
    monthlyVolume = 250,
  } = inputs;

  if (cogs === 0 && actualShippingCost === 0 && packagingCost === 0 && miscCost === 0 && shippingCharged === 0 && adSpendPerSale === 0) {
    const emptyBreakdown = calculateShopifyProfit({
      sellingPrice: 0,
      cogs: 0,
      shippingCharged: 0,
      actualShippingCost: 0,
      packagingCost: 0,
      miscCost: 0,
      planTier,
      isThirdPartyPaymentGateway,
      monthlyAppsCost: 0,
      adSpendPerSale: 0,
      returnRate,
      monthlyVolume,
    });
    return {
      requiredSellingPrice: 0,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: emptyBreakdown,
    };
  }

  const targetMargin = targetMarginPercent / 100;

  let processingRate = 0.029;
  let planMonthlyCost = 39;
  let thirdPartyGatewayRate = 0.02;

  if (planTier === "shopify") {
    processingRate = 0.027;
    planMonthlyCost = 105;
    thirdPartyGatewayRate = 0.01;
  } else if (planTier === "advanced") {
    processingRate = 0.025;
    planMonthlyCost = 399;
    thirdPartyGatewayRate = 0.005;
  } else if (planTier === "plus") {
    processingRate = 0.0215;
    planMonthlyCost = 2000;
    thirdPartyGatewayRate = 0.002;
  }

  const pctRate = processingRate + (isThirdPartyPaymentGateway ? thirdPartyGatewayRate : 0) + returnRate;
  const denominator = 1 - pctRate - targetMargin;

  const subscriptionPerUnit = planMonthlyCost / monthlyVolume;
  const appsPerUnit = monthlyAppsCost / monthlyVolume;
  const fixedDeductions = 0.30 + subscriptionPerUnit + appsPerUnit + adSpendPerSale + cogs + actualShippingCost + packagingCost + miscCost;

  if (denominator <= 0) {
    const impossible = calculateShopifyProfit({
      sellingPrice: 0,
      cogs,
      shippingCharged,
      actualShippingCost,
      packagingCost,
      miscCost,
      planTier,
      isThirdPartyPaymentGateway,
      monthlyAppsCost,
      adSpendPerSale,
      returnRate,
      monthlyVolume,
    });
    return {
      requiredSellingPrice: Infinity,
      expectedProfit: 0,
      expectedMarginPercent: 0,
      breakdown: impossible,
    };
  }

  const requiredRevenue = fixedDeductions / denominator;
  let requiredPrice = requiredRevenue - shippingCharged;

  requiredPrice = Math.ceil(requiredPrice * 100) / 100;
  requiredPrice = Math.max(requiredPrice, 0.01);

  const breakdown = calculateShopifyProfit({
    sellingPrice: requiredPrice,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost,
    planTier,
    isThirdPartyPaymentGateway,
    monthlyAppsCost,
    adSpendPerSale,
    returnRate,
    monthlyVolume,
  });

  return {
    requiredSellingPrice: round2(requiredPrice),
    expectedProfit: breakdown.netProfit,
    expectedMarginPercent: breakdown.netMarginPercent,
    breakdown,
  };
}

// ═══════════════════════════════════════════════════════════════
//  DEFAULT INPUT VALUES (for initial UI state)
// ═══════════════════════════════════════════════════════════════

export const DEFAULT_ETSY_INPUTS: EtsyInputs = {
  sellingPrice: 0,
  cogs: 0,
  shippingCharged: 0,
  actualShippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  offsiteAdsRate: 0,
  quantity: 1,
  monthlyVolume: 100,
};

export const DEFAULT_TIKTOK_INPUTS: TikTokInputs = {
  sellingPrice: 0,
  cogs: 0,
  shippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  affiliateCommissionRate: 0.1,
  adSpendPerSale: 0,
  returnRate: 0.05,
  monthlyVolume: 250,
};

export const DEFAULT_REVERSE_INPUTS: ReverseCalcInputs = {
  targetMarginPercent: 30,
  cogs: 0,
  shippingCharged: 0,
  actualShippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  offsiteAdsRate: 0,
  quantity: 1,
};

export const DEFAULT_REVERSE_TIKTOK_INPUTS: ReverseTikTokInputs = {
  targetMarginPercent: 25,
  cogs: 0,
  shippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  affiliateCommissionRate: 0.1,
  adSpendPerSale: 0,
  returnRate: 0.05,
};

export const DEFAULT_REVERSE_AMAZON_INPUTS: ReverseAmazonInputs = {
  targetMarginPercent: 25,
  cogs: 0,
  fulfillmentMode: "fba",
  referralFeeRate: 0.15,
  fbaFee: 3.86,
  storageAndInboundFee: 0.35,
  shippingCharged: 0,
  actualShippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  adSpendPerSale: 0,
  returnRate: 0.03,
};

export const DEFAULT_REVERSE_EBAY_INPUTS: ReverseEbayInputs = {
  targetMarginPercent: 25,
  cogs: 0,
  shippingCharged: 0,
  actualShippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  finalValueFeeRate: 0.1325,
  promotedListingRate: 0.02,
  storeSubscriptionMonthlyCost: 0,
  insertionFee: 0,
  returnRate: 0.03,
  monthlyVolume: 250,
};

export const DEFAULT_REVERSE_SHOPIFY_INPUTS: ReverseShopifyInputs = {
  targetMarginPercent: 30,
  cogs: 0,
  shippingCharged: 0,
  actualShippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  planTier: "basic",
  monthlyAppsCost: 0,
  adSpendPerSale: 0,
  returnRate: 0.04,
  monthlyVolume: 250,
};

export const DEFAULT_AMAZON_INPUTS: AmazonInputs = {
  sellingPrice: 0,
  cogs: 0,
  fulfillmentMode: "fba",
  referralFeeRate: 0.15, // 15% Standard category
  fbaFee: 4.75, // Large standard 1-2 lb size tier
  storageAndInboundFee: 0.65, // Monthly storage & inbound placement buffer
  isQ4StorageSurge: false,
  hasLowInventoryFee: false,
  isHighReturnCategory: false,
  shippingCharged: 0,
  actualShippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  adSpendPerSale: 0,
  returnRate: 0.03, // 3%
  monthlyVolume: 250,
};

export const DEFAULT_EBAY_INPUTS: EbayInputs = {
  sellingPrice: 0,
  cogs: 0,
  shippingCharged: 0,
  actualShippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  finalValueFeeRate: 0.1325, // 13.25% standard category FVF
  promotedListingRate: 0, // Promoted Listings Standard
  storeSubscriptionMonthlyCost: 0,
  insertionFee: 0, // Within 250 free listings
  returnRate: 0.03, // 3%
  monthlyVolume: 250,
};

export const DEFAULT_SHOPIFY_INPUTS: ShopifyInputs = {
  sellingPrice: 0,
  cogs: 0,
  shippingCharged: 0,
  actualShippingCost: 0,
  packagingCost: 0,
  miscCost: 0,
  planTier: "basic",
  isThirdPartyPaymentGateway: false,
  monthlyAppsCost: 0,
  adSpendPerSale: 0,
  returnRate: 0.04, // 4% DTC average
  monthlyVolume: 250,
};

// ═══════════════════════════════════════════════════════════════
//  CROSS-MARKETPLACE PROFIT COMPARATOR ("Where Should I Sell?")
// ═══════════════════════════════════════════════════════════════

export interface MarketplaceCompareInputs {
  sellingPrice: number;
  cogs: number;
  shippingCharged?: number;
  actualShippingCost: number;
  packagingCost: number;
  miscCost?: number;
}

export interface PlatformRankItem {
  platform: "etsy" | "tiktok" | "amazon" | "ebay" | "shopify";
  name: string;
  netProfit: number;
  netMarginPercent: number;
  totalFees: number;
  totalCosts: number;
  takeHomePercentage: number;
  breakEvenMetricName: string;
  breakEvenMetricValue: string;
  rank: number;
  isBest: boolean;
}

export interface MarketplaceCompareResult {
  inputs: MarketplaceCompareInputs;
  etsy: EtsyResult;
  tiktok: TikTokResult;
  amazon: AmazonResult;
  ebay: EbayResult;
  shopify: ShopifyResult;
  ranked: PlatformRankItem[];
  bestPlatform: PlatformRankItem;
  worstPlatform: PlatformRankItem;
  profitSpread: number;
}

export function compareAllMarketplaces(
  inputs: MarketplaceCompareInputs
): MarketplaceCompareResult {
  const {
    sellingPrice,
    cogs,
    shippingCharged = 0,
    actualShippingCost,
    packagingCost,
    miscCost = 0,
  } = inputs;

  const etsy = calculateEtsyProfit({
    sellingPrice,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost,
    offsiteAdsRate: 0,
    quantity: 1,
    monthlyVolume: 100,
  });

  const tiktok = calculateTikTokProfit({
    sellingPrice,
    cogs,
    shippingCost: actualShippingCost,
    packagingCost,
    miscCost,
    affiliateCommissionRate: 0.1, // 10% standard creator affiliate
    adSpendPerSale: 0,
    returnRate: 0.03,
    monthlyVolume: 100,
  });

  const amazon = calculateAmazonProfit({
    sellingPrice,
    cogs,
    fulfillmentMode: "fba",
    referralFeeRate: 0.15,
    fbaFee: 4.75,
    storageAndInboundFee: 0.65,
    shippingCharged: 0,
    actualShippingCost,
    packagingCost,
    miscCost,
    adSpendPerSale: 0,
    returnRate: 0.03,
    monthlyVolume: 100,
  });

  const ebay = calculateEbayProfit({
    sellingPrice,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost,
    finalValueFeeRate: 0.1325,
    promotedListingRate: 0.03,
    storeSubscriptionMonthlyCost: 21.95,
    insertionFee: 0,
    returnRate: 0.03,
    monthlyVolume: 100,
  });

  const shopify = calculateShopifyProfit({
    sellingPrice,
    cogs,
    shippingCharged,
    actualShippingCost,
    packagingCost,
    miscCost,
    planTier: "basic",
    isThirdPartyPaymentGateway: false,
    monthlyAppsCost: 89,
    adSpendPerSale: 0,
    returnRate: 0.04,
    monthlyVolume: 100,
  });

  const rawPlatforms: Omit<PlatformRankItem, "rank" | "isBest">[] = [
    {
      platform: "etsy",
      name: "Etsy",
      netProfit: etsy.netProfit,
      netMarginPercent: etsy.netMarginPercent,
      totalFees: etsy.totalFees,
      totalCosts: etsy.totalCosts,
      takeHomePercentage:
        etsy.grossRevenue > 0
          ? round2((etsy.netProfit / etsy.grossRevenue) * 100)
          : 0,
      breakEvenMetricName: "Total Fee Cut",
      breakEvenMetricValue: `${((etsy.totalFees / (etsy.grossRevenue || 1)) * 100).toFixed(1)}%`,
    },
    {
      platform: "tiktok",
      name: "TikTok Shop",
      netProfit: tiktok.netProfit,
      netMarginPercent: tiktok.netMarginPercent,
      totalFees: tiktok.totalFees,
      totalCosts: tiktok.totalCosts,
      takeHomePercentage:
        tiktok.grossRevenue > 0
          ? round2((tiktok.netProfit / tiktok.grossRevenue) * 100)
          : 0,
      breakEvenMetricName: "Break-Even ROAS",
      breakEvenMetricValue: tiktok.breakEvenRoasDisplay,
    },
    {
      platform: "amazon",
      name: "Amazon FBA",
      netProfit: amazon.netProfit,
      netMarginPercent: amazon.netMarginPercent,
      totalFees: amazon.totalFees,
      totalCosts: amazon.totalCosts,
      takeHomePercentage:
        amazon.grossRevenue > 0
          ? round2((amazon.netProfit / amazon.grossRevenue) * 100)
          : 0,
      breakEvenMetricName: "Break-Even ACoS",
      breakEvenMetricValue: amazon.breakEvenAcosDisplay,
    },
    {
      platform: "ebay",
      name: "eBay",
      netProfit: ebay.netProfit,
      netMarginPercent: ebay.netMarginPercent,
      totalFees: ebay.totalFees,
      totalCosts: ebay.totalCosts,
      takeHomePercentage:
        ebay.grossRevenue > 0
          ? round2((ebay.netProfit / ebay.grossRevenue) * 100)
          : 0,
      breakEvenMetricName: "Break-Even ROAS",
      breakEvenMetricValue: ebay.breakEvenRoasDisplay,
    },
    {
      platform: "shopify",
      name: "Shopify DTC",
      netProfit: shopify.netProfit,
      netMarginPercent: shopify.netMarginPercent,
      totalFees: shopify.totalFees,
      totalCosts: shopify.totalCosts,
      takeHomePercentage:
        shopify.grossRevenue > 0
          ? round2((shopify.netProfit / shopify.grossRevenue) * 100)
          : 0,
      breakEvenMetricName: "Break-Even ROAS",
      breakEvenMetricValue: shopify.breakEvenRoasDisplay,
    },
  ];

  rawPlatforms.sort((a, b) => b.netProfit - a.netProfit);

  const ranked: PlatformRankItem[] = rawPlatforms.map((p, idx) => ({
    ...p,
    rank: idx + 1,
    isBest: idx === 0,
  }));

  const bestPlatform = ranked[0];
  const worstPlatform = ranked[ranked.length - 1];
  const profitSpread = round2(bestPlatform.netProfit - worstPlatform.netProfit);

  return {
    inputs,
    etsy,
    tiktok,
    amazon,
    ebay,
    shopify,
    ranked,
    bestPlatform,
    worstPlatform,
    profitSpread,
  };
}
