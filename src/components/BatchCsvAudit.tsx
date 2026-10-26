"use client";

import React, { useState, useRef, useMemo, ChangeEvent, DragEvent, useEffect } from "react";
import Papa from "papaparse";
import {
  Download,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  FileText,
  Search,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Store,
  LayoutGrid,
  Table as TableIcon,
  Lock,
  Zap,
  Package,
} from "lucide-react";
import {
  calculateEtsyProfit,
  calculateTikTokProfit,
  calculateAmazonProfit,
  calculateEbayProfit,
  calculateShopifyProfit,
  type EtsyInputs,
  type TikTokInputs,
  type AmazonInputs,
  type EbayInputs,
  type ShopifyInputs,
  type EtsyResult,
  type TikTokResult,
  type AmazonResult,
  type EbayResult,
  type ShopifyResult,
} from "@/lib/calculations";

// ═══════════════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════════════

export type AuditPlatform = "etsy" | "tiktok" | "amazon" | "ebay" | "shopify";
export type ViewMode = "cards" | "table";

export interface RawCsvRow {
  sku?: string | number;
  name?: string;
  title?: string;
  item?: string;
  sellingPrice?: string | number;
  price?: string | number;
  cogs?: string | number;
  cost?: string | number;
  shippingCharged?: string | number;
  shipping_charged?: string | number;
  actualShipping?: string | number;
  actual_shipping?: string | number;
  shippingCost?: string | number;
  shipping_cost?: string | number;
  fbaFee?: string | number;
  fba_fee?: string | number;
  packaging?: string | number;
  packaging_cost?: string | number;
  misc?: string | number;
  labor?: string | number;
  [key: string]: unknown;
}

export interface AuditedItem {
  id: string;
  sku: string;
  name: string;
  sellingPrice: number;
  cogs: number;
  shippingCharged: number;
  actualShippingCost: number;
  packagingCost: number;
  miscCost: number;
  grossRevenue: number;
  totalCosts: number;
  totalFees: number;
  netProfit: number;
  netMarginPercent: number;
  isBleeding: boolean;
  platform: AuditPlatform;
  breakdown: EtsyResult | TikTokResult | AmazonResult | EbayResult | ShopifyResult;
}

type FilterOption = "all" | "bleeding" | "profitable";

interface BatchCsvAuditProps {
  isPro?: boolean;
  onOpenProModal?: () => void;
  initialPlatform?: AuditPlatform;
}

// ═══════════════════════════════════════════════════════════════
//  PLATFORM-SPECIFIC SAMPLE CSV TEMPLATES
// ═══════════════════════════════════════════════════════════════

const CSV_HEADERS = [
  "sku",
  "name",
  "sellingPrice",
  "cogs",
  "shippingCharged",
  "actualShipping",
  "packaging",
  "misc",
] as const;

export interface PlatformSampleConfig {
  filename: string;
  name: string;
  rows: string[];
  expectedHeadersDesc: string;
}

export const PLATFORM_SAMPLE_CSV_CONFIG: Record<AuditPlatform, PlatformSampleConfig> = {
  etsy: {
    filename: "feespotter_etsy_sample_catalog.csv",
    name: "Etsy",
    expectedHeadersDesc: "sku, name, sellingPrice, cogs, shippingCharged, actualShipping, packaging, misc",
    rows: [
      CSV_HEADERS.join(","),
      "ETSY-CERAMIC-MUG,Handcrafted Ceramic Coffee Mug,28.00,6.50,5.99,4.20,1.20,1.50",
      "ETSY-LEATHER-WALLET,Minimalist Bifold Leather Wallet,22.00,10.00,0.00,4.80,1.50,1.00",
      "ETSY-SOY-CANDLE,8oz Amber Jar Soy Wax Candle,16.50,4.50,4.99,5.80,1.10,1.20",
      "ETSY-RESIN-COASTER,Resin Agate Coaster 4-Pack,26.00,5.50,5.50,4.20,1.25,2.00",
      "ETSY-CANVAS-TOTE,Hand-Embroidered Canvas Tote Bag,14.00,9.00,0.00,5.20,1.20,1.50",
      "ETSY-BEADED-BRACELET,Natural Gemstone Beaded Bracelet,12.50,2.50,3.99,2.80,0.80,0.75",
      "ETSY-WOODEN-SIGN,Personalized Wooden Kitchen Sign,34.00,8.50,6.50,6.20,2.00,3.00",
      "ETSY-STICKER-SHEET,Vinyl Die-Cut Planner Sticker Sheet,5.50,1.20,0.00,3.50,0.60,0.50",
    ],
  },
  tiktok: {
    filename: "feespotter_tiktok_sample_catalog.csv",
    name: "TikTok Shop",
    expectedHeadersDesc: "sku, name, sellingPrice, cogs, actualShipping (or shippingCost), packaging, misc",
    rows: [
      CSV_HEADERS.join(","),
      "TTS-SUNSET-LAMP,Sunset Projection LED Atmosphere Lamp,24.99,5.80,0.00,4.50,0.90,0.50",
      "TTS-RING-LIGHT,10-Inch Ring Light Tripod & Phone Mount,19.99,7.20,0.00,5.25,1.20,0.50",
      "TTS-SEAMLESS-LEGGINGS,High-Waisted Scrunch Booty Leggings,28.00,6.50,0.00,4.20,0.80,0.75",
      "TTS-MILK-FROTHER,Handheld Electric Foam Maker for Matcha,9.99,4.20,0.00,3.90,0.60,0.25",
      "TTS-TUMBLER-40OZ,Double-Wall Insulated Handle Tumbler 40oz,32.00,8.50,0.00,5.80,1.50,0.50",
      "TTS-HAIR-ERASER,Crystal Hair Eraser Exfoliator,14.50,2.10,0.00,3.80,0.50,0.25",
      "TTS-LIP-GLOSS-SET,Hydrating Plumping Lip Gloss 3-Pack,16.99,3.50,0.00,3.80,0.75,0.50",
      "TTS-WIRELESS-EARBUDS,Budget Bluetooth 5.3 Earbuds with Case,12.99,6.80,0.00,4.10,0.80,0.50",
    ],
  },
  amazon: {
    filename: "feespotter_amazon_fba_sample_catalog.csv",
    name: "Amazon FBA",
    expectedHeadersDesc: "sku, name, sellingPrice, cogs, packaging, misc/freight (FBA fee applied automatically)",
    rows: [
      CSV_HEADERS.join(","),
      "AMZ-BAKING-MAT-2PK,Silicone Macaron Baking Mat Set of 2,21.99,4.20,0.00,0.00,0.45,1.20",
      "AMZ-GARLIC-PRESS,Heavy Duty Stainless Steel Garlic Mincer,14.99,3.50,0.00,0.00,0.40,0.80",
      "AMZ-RESIST-BANDS-5PK,Workout Resistance Loop Bands Set with Pouch,18.95,3.10,0.00,0.00,0.35,0.75",
      "AMZ-MEASURING-SPOONS,Magnetic Stainless Measuring Spoons Set,9.99,3.80,0.00,0.00,0.30,0.60",
      "AMZ-YOGA-BLOCK-2PK,High Density EVA Foam Yoga Blocks 2-Pack,27.50,5.80,0.00,0.00,0.60,1.50",
      "AMZ-MILK-THERMOMETER,Instant Read Digital Food Thermometer,16.99,3.20,0.00,0.00,0.35,0.65",
      "AMZ-BAMBOO-CHEESE-BD,Bamboo Charcuterie Board with Knife Set,39.99,11.50,0.00,0.00,1.20,2.50",
      "AMZ-TRAVEL-BOTTLE-SET,Silicone Leakproof Travel Toiletries 4-Pack,11.49,4.50,0.00,0.00,0.35,0.70",
    ],
  },
  ebay: {
    filename: "feespotter_ebay_sample_catalog.csv",
    name: "eBay",
    expectedHeadersDesc: "sku, name, sellingPrice, cogs, shippingCharged, actualShipping, packaging, misc",
    rows: [
      CSV_HEADERS.join(","),
      "EBAY-REFURB-HEADPHONES,Sony WH-1000XM4 Refurbished Noise Canceling,189.00,85.00,9.95,8.20,2.50,2.00",
      "EBAY-POKEMON-CHARIZARD,Charizard Holo Base Set Graded PSA 8,320.00,175.00,12.50,9.80,3.50,5.00",
      "EBAY-VINTAGE-CARHARTT,Vintage Detroit Duck Canvas Jacket Distressed,125.00,38.00,14.50,11.20,2.00,1.50",
      "EBAY-OEM-SIDE-MIRROR,2018 Toyota Camry Passenger Side View Mirror,68.00,24.00,11.95,10.50,2.50,1.00",
      "EBAY-HANDHELD-GAME,Retro Handheld Game Emulator 3000-in-1,19.99,12.50,0.00,5.20,1.00,0.50",
      "EBAY-CORDLESS-DRILL,Milwaukee M18 Fuel 1/2in Hammer Drill Bare Tool,115.00,58.00,8.95,7.50,2.20,1.00",
      "EBAY-MECH-KEYBOARD,Keychron K2 Wireless Mechanical Keyboard RGB,65.00,28.00,7.50,6.80,1.80,1.00",
      "EBAY-CHEAP-PHONE-CASE,Clear Shockproof Case for iPhone 15 Pro,4.99,1.50,0.00,3.90,0.50,0.25",
    ],
  },
  shopify: {
    filename: "feespotter_shopify_dtc_sample_catalog.csv",
    name: "Shopify DTC",
    expectedHeadersDesc: "sku, name, sellingPrice, cogs, shippingCharged, actualShipping, packaging, misc",
    rows: [
      CSV_HEADERS.join(","),
      "DTC-MATCHA-100G,Ceremonial Grade Japanese Matcha Green Tea 100g,38.00,7.50,4.99,4.80,2.20,1.50",
      "DTC-HOODIE-OVERSIZED,500GSM Heavyweight Luxury Fleece Hoodie,78.00,22.00,6.95,7.80,3.50,2.00",
      "DTC-PIMPLE-PATCH-72,Hydrocolloid Blemish Pimple Patches 72-Pack,16.00,2.20,3.99,3.80,1.20,1.00",
      "DTC-ELECTROLYTES-30,Daily Hydration Electrolyte Drink Powder 30-Pack,34.00,6.80,4.99,4.50,1.80,1.50",
      "DTC-TRIAL-STARTER-KIT,Mini Sample Discovery Skincare Kit,12.00,6.50,0.00,4.50,1.50,1.00",
      "DTC-BLUE-LIGHT-GLASSES,Acetate Blue Light Blocking Eyeglasses,48.00,8.50,4.99,4.50,2.50,1.50",
      "DTC-VIT-C-SERUM,30ml Ferulic Acid + 15% Vitamin C Glow Serum,32.00,5.20,4.99,4.20,1.80,1.50",
      "DTC-LIP-BALM-SINGLE,Organic Vanilla Mint Beeswax Lip Balm,6.00,1.80,0.00,4.10,0.80,0.50",
    ],
  },
};

function parseNumeric(val: unknown, fallback = 0): number {
  if (typeof val === "number") {
    return isNaN(val) ? fallback : val;
  }
  if (typeof val === "string") {
    const clean = val.replace(/[^0-9.-]/g, "").trim();
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

const FREE_TIER_PREVIEW_LIMIT = 3;

export function BatchCsvAudit({
  isPro = false,
  onOpenProModal,
  initialPlatform = "etsy",
}: BatchCsvAuditProps) {
  const [platform, setPlatform] = useState<AuditPlatform>(initialPlatform);
  const [prevInitialPlatform, setPrevInitialPlatform] = useState<AuditPlatform>(initialPlatform);
  if (initialPlatform && initialPlatform !== prevInitialPlatform) {
    setPrevInitialPlatform(initialPlatform);
    setPlatform(initialPlatform);
  }
  const [etsyOffsiteAdsRate, setEtsyOffsiteAdsRate] = useState<0 | 0.12 | 0.15>(0);
  const [tiktokCommissionRate, setTiktokCommissionRate] = useState<number>(0.1);
  const [tiktokAdSpend] = useState<number>(0);
  const [tiktokReturnRate, setTiktokReturnRate] = useState<number>(0.05);
  const [amazonReferralRate, setAmazonReferralRate] = useState<number>(0.15);
  const [amazonFbaFee, setAmazonFbaFee] = useState<number>(4.75);
  const [ebayFvfRate, setEbayFvfRate] = useState<number>(0.136);
  const [ebayPromotedRate, setEbayPromotedRate] = useState<number>(0.03);
  const [shopifyPlanTier, setShopifyPlanTier] = useState<"basic" | "shopify" | "advanced">("basic");
  const [shopifyAdSpend, setShopifyAdSpend] = useState<number>(10);

  const [auditedItems, setAuditedItems] = useState<AuditedItem[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterOption>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [notification, setNotification] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setViewMode("cards");
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const showNotification = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((current) => (current?.message === message ? null : current));
    }, 4500);
  };

  // ─────────────────────────────────────────────────────────────
  // 1. GENERATE & DOWNLOAD SAMPLE CSV TEMPLATE
  // ─────────────────────────────────────────────────────────────
  const handleDownloadSampleCsv = () => {
    try {
      const config = PLATFORM_SAMPLE_CSV_CONFIG[platform] || PLATFORM_SAMPLE_CSV_CONFIG.etsy;
      const csvContent = config.rows.join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", config.filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showNotification(`Sample ${config.name} CSV template downloaded successfully!`, "success");
    } catch (err) {
      console.error("Error downloading sample CSV:", err);
      showNotification("Failed to download CSV template.", "error");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // CORE CALCULATION PROCESSOR
  // ─────────────────────────────────────────────────────────────
  const processRows = (
    rows: RawCsvRow[],
    targetPlatform: AuditPlatform = platform
  ): AuditedItem[] => {
    return rows
      .filter((row) => {
        return (
          row.sku !== undefined ||
          row.name !== undefined ||
          row.title !== undefined ||
          row.item !== undefined ||
          row.sellingPrice !== undefined ||
          row.price !== undefined
        );
      })
      .map((row, index) => {
        const sku = String(row.sku ?? `SKU-${index + 1}`).trim();
        const name = String(row.name ?? row.title ?? row.item ?? `Product #${index + 1}`).trim();
        const sellingPrice = parseNumeric(row.sellingPrice ?? row.price, 0);
        const cogs = parseNumeric(row.cogs ?? row.cost, 0);
        const shippingCharged = parseNumeric(row.shippingCharged ?? row.shipping_charged, 0);
        const actualShippingCost = parseNumeric(row.actualShipping ?? row.actual_shipping ?? row.shippingCost ?? row.shipping_cost, 0);
        const packagingCost = parseNumeric(row.packaging ?? row.packaging_cost, 0);
        const miscCost = parseNumeric(row.misc ?? row.labor, 0);

        if (targetPlatform === "etsy") {
          const etsyInputs: EtsyInputs = {
            sellingPrice,
            cogs,
            shippingCharged,
            actualShippingCost,
            packagingCost,
            miscCost,
            offsiteAdsRate: etsyOffsiteAdsRate,
            quantity: 1,
          };
          const res = calculateEtsyProfit(etsyInputs);

          return {
            id: `${sku}-${index}`,
            sku,
            name,
            sellingPrice,
            cogs,
            shippingCharged,
            actualShippingCost,
            packagingCost,
            miscCost,
            grossRevenue: res.grossRevenue,
            totalCosts: res.totalCosts,
            totalFees: res.totalFees,
            netProfit: res.netProfit,
            netMarginPercent: res.netMarginPercent,
            isBleeding: res.netProfit < 0,
            platform: "etsy",
            breakdown: res,
          };
        } else if (targetPlatform === "tiktok") {
          const tikTokInputs: TikTokInputs = {
            sellingPrice,
            cogs,
            shippingCost: actualShippingCost,
            packagingCost,
            miscCost,
            affiliateCommissionRate: tiktokCommissionRate,
            adSpendPerSale: tiktokAdSpend,
            returnRate: tiktokReturnRate,
          };
          const res = calculateTikTokProfit(tikTokInputs);

          return {
            id: `${sku}-${index}`,
            sku,
            name,
            sellingPrice,
            cogs,
            shippingCharged,
            actualShippingCost,
            packagingCost,
            miscCost,
            grossRevenue: res.grossRevenue,
            totalCosts: res.totalCosts,
            totalFees: res.totalFees,
            netProfit: res.netProfit,
            netMarginPercent: res.netMarginPercent,
            isBleeding: res.netProfit < 0,
            platform: "tiktok",
            breakdown: res,
          };
        } else if (targetPlatform === "ebay") {
          const ebayInputs: EbayInputs = {
            sellingPrice,
            cogs,
            shippingCharged,
            actualShippingCost,
            packagingCost,
            miscCost,
            finalValueFeeRate: ebayFvfRate,
            promotedListingRate: ebayPromotedRate,
            storeSubscriptionMonthlyCost: 21.95,
            insertionFee: 0,
            returnRate: 0.03,
          };
          const res = calculateEbayProfit(ebayInputs);

          return {
            id: `${sku}-${index}`,
            sku,
            name,
            sellingPrice,
            cogs,
            shippingCharged,
            actualShippingCost,
            packagingCost,
            miscCost,
            grossRevenue: res.grossRevenue,
            totalCosts: res.totalCosts,
            totalFees: res.totalFees,
            netProfit: res.netProfit,
            netMarginPercent: res.netMarginPercent,
            isBleeding: res.netProfit < 0,
            platform: "ebay",
            breakdown: res,
          };
        } else if (targetPlatform === "shopify") {
          const shopifyInputs: ShopifyInputs = {
            sellingPrice,
            cogs,
            shippingCharged,
            actualShippingCost,
            packagingCost,
            miscCost,
            planTier: shopifyPlanTier,
            isThirdPartyPaymentGateway: false,
            monthlyAppsCost: 89,
            adSpendPerSale: shopifyAdSpend,
            returnRate: 0.04,
          };
          const res = calculateShopifyProfit(shopifyInputs);

          return {
            id: `${sku}-${index}`,
            sku,
            name,
            sellingPrice,
            cogs,
            shippingCharged,
            actualShippingCost,
            packagingCost,
            miscCost,
            grossRevenue: res.grossRevenue,
            totalCosts: res.totalCosts,
            totalFees: res.totalFees,
            netProfit: res.netProfit,
            netMarginPercent: res.netMarginPercent,
            isBleeding: res.netProfit < 0,
            platform: "shopify",
            breakdown: res,
          };
        } else {
          const amazonInputs: AmazonInputs = {
            sellingPrice,
            cogs,
            fulfillmentMode: "fba",
            referralFeeRate: amazonReferralRate,
            fbaFee: amazonFbaFee,
            storageAndInboundFee: 0.65,
            shippingCharged,
            actualShippingCost,
            packagingCost,
            miscCost,
            adSpendPerSale: 0,
            returnRate: 0.03,
          };
          const res = calculateAmazonProfit(amazonInputs);

          return {
            id: `${sku}-${index}`,
            sku,
            name,
            sellingPrice,
            cogs,
            shippingCharged,
            actualShippingCost,
            packagingCost,
            miscCost,
            grossRevenue: res.grossRevenue,
            totalCosts: res.totalCosts,
            totalFees: res.totalFees,
            netProfit: res.netProfit,
            netMarginPercent: res.netMarginPercent,
            isBleeding: res.netProfit < 0,
            platform: "amazon",
            breakdown: res,
          };
        }
      });
  };

  // ─────────────────────────────────────────────────────────────
  // 2. PAPAPARSE UPLOAD HANDLER
  // ─────────────────────────────────────────────────────────────
  const parseCsvFile = (file: File) => {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      showNotification("Please upload a valid .csv file.", "error");
      return;
    }

    const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB guard
    if (file.size > MAX_FILE_SIZE_BYTES) {
      showNotification("File size exceeds the 5MB safety limit. Please upload a smaller CSV.", "error");
      return;
    }

    setIsParsing(true);
    setFileName(file.name);

    Papa.parse<RawCsvRow>(file, {
      header: true,
      skipEmptyLines: "greedy",
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        setIsParsing(false);
        if (results.errors && results.errors.length > 0) {
          console.warn("CSV parsing warnings:", results.errors);
        }

        if (!results.data || results.data.length === 0) {
          showNotification("The uploaded CSV is empty or formatted incorrectly.", "error");
          return;
        }

        const MAX_AUDIT_ROWS = 5000;
        let dataToProcess = results.data;
        if (dataToProcess.length > MAX_AUDIT_ROWS) {
          dataToProcess = dataToProcess.slice(0, MAX_AUDIT_ROWS);
          showNotification(
            `Catalog capped to first ${MAX_AUDIT_ROWS.toLocaleString()} items for optimal browser performance.`,
            "info"
          );
        }

        const processed = processRows(dataToProcess, platform);
        if (processed.length === 0) {
          showNotification("No valid inventory rows found in the CSV.", "error");
          return;
        }

        setAuditedItems(processed);
        const bleedingCount = processed.filter((item) => item.isBleeding).length;
        if (bleedingCount > 0) {
          showNotification(
            `Audit completed: ${processed.length} SKUs analyzed. Detected ${bleedingCount} cash-bleeding items!`,
            "error"
          );
        } else {
          showNotification(
            `Audit completed: ${processed.length} SKUs analyzed. All items currently profitable!`,
            "success"
          );
        }
      },
      error: (err) => {
        setIsParsing(false);
        console.error("PapaParse error:", err);
        showNotification(`Error parsing CSV: ${err.message}`, "error");
      },
    });
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseCsvFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      parseCsvFile(file);
    }
  };

  const handleLoadDemoData = (targetPlatform: AuditPlatform = platform) => {
    setIsParsing(true);
    const config = PLATFORM_SAMPLE_CSV_CONFIG[targetPlatform] || PLATFORM_SAMPLE_CSV_CONFIG.etsy;
    setTimeout(() => {
      Papa.parse<RawCsvRow>(config.rows.join("\n"), {
        header: true,
        skipEmptyLines: "greedy",
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          setIsParsing(false);
          setFileName(config.filename);
          const processed = processRows(results.data, targetPlatform);
          setAuditedItems(processed);
          showNotification(`Sample ${config.name} catalog loaded into batch auditor.`, "success");
        },
      });
    }, 120);
  };

  const reauditCurrentData = (newPlatform: AuditPlatform) => {
    if (auditedItems.length === 0) return;
    const recomputed = auditedItems.map((item) => {
      const rawRow: RawCsvRow = {
        sku: item.sku,
        name: item.name,
        sellingPrice: item.sellingPrice,
        cogs: item.cogs,
        shippingCharged: item.shippingCharged,
        actualShipping: item.actualShippingCost,
        packaging: item.packagingCost,
        misc: item.miscCost,
      };
      return processRows([rawRow], newPlatform)[0] ?? item;
    });
    setAuditedItems(recomputed);
  };

  const handlePlatformChange = (newPlatform: AuditPlatform) => {
    setPlatform(newPlatform);
    if (fileName && fileName.startsWith("feespotter_")) {
      handleLoadDemoData(newPlatform);
    } else {
      reauditCurrentData(newPlatform);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 3. SUMMARY CALCULATIONS
  // ─────────────────────────────────────────────────────────────
  const summary = useMemo(() => {
    const totalCount = auditedItems.length;
    const profitable = auditedItems.filter((i) => i.netProfit >= 0);
    const bleeding = auditedItems.filter((i) => i.netProfit < 0);

    const profitableCount = profitable.length;
    const bleedingCount = bleeding.length;

    const totalProfit = profitable.reduce((acc, i) => acc + i.netProfit, 0);
    const totalLoss = bleeding.reduce((acc, i) => acc + Math.abs(i.netProfit), 0);
    const netTotalProfit = auditedItems.reduce((acc, i) => acc + i.netProfit, 0);
    const totalGrossRevenue = auditedItems.reduce((acc, i) => acc + i.grossRevenue, 0);

    const profitablePercent =
      totalCount > 0 ? (profitableCount / totalCount) * 100 : 0;
    const bleedingPercent =
      totalCount > 0 ? (bleedingCount / totalCount) * 100 : 0;

    const portfolioMargin =
      totalGrossRevenue > 0 ? (netTotalProfit / totalGrossRevenue) * 100 : 0;

    return {
      totalCount,
      profitableCount,
      bleedingCount,
      profitablePercent,
      bleedingPercent,
      totalProfit,
      totalLoss,
      netTotalProfit,
      totalGrossRevenue,
      portfolioMargin,
    };
  }, [auditedItems]);

  const filteredItems = useMemo(() => {
    return auditedItems.filter((item) => {
      if (filter === "bleeding" && !item.isBleeding) return false;
      if (filter === "profitable" && item.isBleeding) return false;

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSku = item.sku.toLowerCase().includes(query);
        const matchesName = item.name.toLowerCase().includes(query);
        return matchesSku || matchesName;
      }
      return true;
    });
  }, [auditedItems, filter, searchQuery]);

  // Teaser blur logic
  const isBlurred = !isPro && filteredItems.length > FREE_TIER_PREVIEW_LIMIT;
  const hiddenCount = isBlurred ? filteredItems.length - FREE_TIER_PREVIEW_LIMIT : 0;
  const hiddenBleedingCount = isBlurred
    ? filteredItems.slice(FREE_TIER_PREVIEW_LIMIT).filter((i) => i.isBleeding).length
    : 0;

  // ─────────────────────────────────────────────────────────────
  // 5. EXPORT OFFICIAL PROFIT AUDIT PDF
  // ─────────────────────────────────────────────────────────────
  const handleExportPdf = async () => {
    if (auditedItems.length === 0) {
      showNotification("Please upload a CSV or load demo inventory first.", "error");
      return;
    }

    // Paywall gate: Free users get prompted to upgrade to Pro
    if (!isPro) {
      if (onOpenProModal) {
        onOpenProModal();
      } else {
        showNotification("Exporting the official PDF audit is a Pro feature.", "info");
      }
      return;
    }

    try {
      setIsExportingPdf(true);

      const [{ jsPDF }, { default: autoTable }] = await Promise.all([
        import("jspdf"),
        import("jspdf-autotable"),
      ]);

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "a4",
      });

      // Header Banner
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, 842, 70, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("FeeSpotter™ Official Profit & Margin Audit", 40, 38);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Generated: ${new Date().toLocaleDateString()} | Platform: ${
          PLATFORM_SAMPLE_CSV_CONFIG[platform]?.name ?? "Marketplace"
        } | Source: ${fileName ?? "Batch Upload"}`,
        40,
        55
      );

      doc.setFontSize(10);
      doc.setTextColor(52, 211, 153);
      doc.text("VERIFIED PRO FINANCIAL AUDIT", 700, 38, { align: "right" });

      // KPI Metric Cards in PDF
      const cardY = 85;
      const cardHeight = 55;
      const cardWidth = 175;
      const cardSpacing = 16;
      let startX = 40;

      // Card 1
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(startX, cardY, cardWidth, cardHeight, 4, 4, "FD");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text("TOTAL SKUS AUDITED", startX + 12, cardY + 20);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text(`${summary.totalCount}`, startX + 12, cardY + 42);

      // Card 2
      startX += cardWidth + cardSpacing;
      doc.setFillColor(240, 253, 244);
      doc.setDrawColor(187, 247, 208);
      doc.roundedRect(startX, cardY, cardWidth, cardHeight, 4, 4, "FD");
      doc.setFontSize(9);
      doc.setTextColor(22, 101, 52);
      doc.setFont("helvetica", "normal");
      doc.text("PROFITABLE SKUS", startX + 12, cardY + 20);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(21, 128, 61);
      doc.text(
        `${summary.profitableCount} (${summary.profitablePercent.toFixed(1)}%)`,
        startX + 12,
        cardY + 42
      );

      // Card 3
      startX += cardWidth + cardSpacing;
      doc.setFillColor(255, 241, 242);
      doc.setDrawColor(254, 205, 211);
      doc.roundedRect(startX, cardY, cardWidth, cardHeight, 4, 4, "FD");
      doc.setFontSize(9);
      doc.setTextColor(159, 18, 57);
      doc.setFont("helvetica", "normal");
      doc.text("BLEEDING CASH SKUS", startX + 12, cardY + 20);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(190, 18, 60);
      doc.text(
        `${summary.bleedingCount} (${summary.bleedingPercent.toFixed(1)}%)`,
        startX + 12,
        cardY + 42
      );

      // Card 4
      startX += cardWidth + cardSpacing;
      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(startX, cardY, cardWidth, cardHeight, 4, 4, "FD");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.setFont("helvetica", "normal");
      doc.text("TOTAL NET CATALOG PROFIT", startX + 12, cardY + 20);
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(
        summary.netTotalProfit >= 0 ? 15 : 190,
        summary.netTotalProfit >= 0 ? 23 : 18,
        summary.netTotalProfit >= 0 ? 42 : 60
      );
      doc.text(
        `$${summary.netTotalProfit.toFixed(2)} (${summary.portfolioMargin.toFixed(1)}%)`,
        startX + 12,
        cardY + 42
      );

      let tableStartY = 155;
      if (summary.bleedingCount > 0) {
        doc.setFillColor(255, 241, 242);
        doc.setDrawColor(244, 63, 94);
        doc.roundedRect(40, 150, 762, 26, 4, 4, "FD");
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(190, 18, 60);
        doc.text(
          `ALERT: ${summary.bleedingCount} SKU(s) are losing money on every order due to marketplace fees & shipping. Immediate price adjustment recommended.`,
          48,
          166
        );
        tableStartY = 188;
      }

      const tableHead = [
        [
          "SKU",
          "Product Name",
          "Retail Price",
          "Shipping (Chg / Act)",
          "COGS + Pack + Misc",
          "Mktplace Fees",
          "Net Profit",
          "Net Margin",
          "Audit Verdict",
        ],
      ];

      const tableBody = auditedItems.map((item) => [
        item.sku,
        item.name,
        `$${item.sellingPrice.toFixed(2)}`,
        `+$${item.shippingCharged.toFixed(2)} / -$${item.actualShippingCost.toFixed(2)}`,
        `$${(item.cogs + item.packagingCost + item.miscCost).toFixed(2)}`,
        `$${item.totalFees.toFixed(2)}`,
        `${item.netProfit < 0 ? "-" : ""}$${Math.abs(item.netProfit).toFixed(2)}`,
        `${item.netMarginPercent.toFixed(1)}%`,
        item.isBleeding ? "BLEEDING CASH" : "PROFITABLE",
      ]);

      autoTable(doc, {
        head: tableHead,
        body: tableBody,
        startY: tableStartY,
        margin: { left: 40, right: 40, bottom: 40 },
        theme: "striped",
        headStyles: {
          fillColor: [15, 23, 42],
          textColor: [255, 255, 255],
          fontSize: 8.5,
          fontStyle: "bold",
          halign: "left",
        },
        styles: {
          fontSize: 8,
          cellPadding: 4.5,
          textColor: [51, 65, 85],
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252],
        },
        columnStyles: {
          0: { cellWidth: 70, fontStyle: "bold" },
          1: { cellWidth: 165 },
          2: { cellWidth: 70, halign: "right" },
          3: { cellWidth: 105, halign: "center" },
          4: { cellWidth: 70, halign: "right" },
          5: { cellWidth: 75, halign: "right" },
          6: { cellWidth: 65, halign: "right", fontStyle: "bold" },
          7: { cellWidth: 65, halign: "right" },
          8: { cellWidth: 80, halign: "center", fontStyle: "bold" },
        },
        didParseCell: (data) => {
          if (data.section === "body") {
            const rowItem = auditedItems[data.row.index];
            if (rowItem && rowItem.isBleeding) {
              data.cell.styles.fillColor = [255, 241, 242];
              data.cell.styles.textColor = [190, 18, 60];
              if (data.column.index === 6 || data.column.index === 8) {
                data.cell.styles.fontStyle = "bold";
              }
            } else if (data.column.index === 6) {
              data.cell.styles.textColor = [16, 185, 129];
            } else if (data.column.index === 8) {
              data.cell.styles.textColor = [5, 150, 105];
            }
          }
        },
        didDrawPage: (data) => {
          const pageCount = doc.internal.pages.length - 1;
          const pageCurrent = data.pageNumber;
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text(
            "FeeSpotter Official Audit Report • Confidential seller analytics • Not financial advice.",
            40,
            575
          );
          doc.text(`Page ${pageCurrent} of ${pageCount}`, 802, 575, {
            align: "right",
          });
        },
      });

      const safeFileName = `FeeSpotter_Audit_${platform}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      doc.save(safeFileName);
      setIsExportingPdf(false);
      showNotification("Official Profit Audit PDF generated & exported successfully!", "success");
    } catch (err) {
      setIsExportingPdf(false);
      console.error("PDF Export error:", err);
      showNotification("Failed to generate PDF. Check console for details.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm backdrop-blur-xl ${
            notification.type === "error"
              ? "bg-rose-950/90 text-rose-200 border-rose-800"
              : notification.type === "success"
              ? "bg-emerald-950/90 text-emerald-200 border-emerald-800"
              : "bg-zinc-900/95 text-zinc-200 border-zinc-700"
          }`}
        >
          {notification.type === "error" && (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          {notification.type === "success" && (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          {notification.type === "info" && (
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          )}
          <span className="flex-1">{notification.message}</span>
        </div>
      )}

      {/* Control Bar & Actions */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                Batch CSV Inventory Audit
              </h2>
              {isPro ? (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                  Pro Unlocked
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/80">
                  Free Preview
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Process hundreds of listings row-by-row to detect hidden deductions and pinpoint cash-bleeding SKUs.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Download Sample CSV */}
            <button
              onClick={handleDownloadSampleCsv}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700/60 transition-all cursor-pointer shadow-sm active:scale-95"
              title={`Download standard ${PLATFORM_SAMPLE_CSV_CONFIG[platform].name} CSV template with required column headers`}
            >
              <Download className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              Download {PLATFORM_SAMPLE_CSV_CONFIG[platform].name} Sample CSV
            </button>

            {/* Load Demo Data */}
            <button
              onClick={() => handleLoadDemoData(platform)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-zinc-800/80 hover:bg-zinc-700 text-cyan-300 border border-cyan-800/40 transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              Load {PLATFORM_SAMPLE_CSV_CONFIG[platform].name} Sample Data
            </button>

            {/* Export Official PDF Button */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf || auditedItems.length === 0}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all ${
                auditedItems.length === 0
                  ? "bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60"
                  : isPro
                  ? "bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 cursor-pointer shadow-emerald-950/60 active:scale-[0.98]"
                  : "bg-zinc-800 hover:bg-zinc-700 border border-emerald-500/40 text-emerald-300 cursor-pointer"
              }`}
            >
              {isPro ? (
                <FileText className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
              {isExportingPdf
                ? "Generating PDF..."
                : isPro
                ? "Export Official Profit Audit PDF"
                : "Export Official Profit Audit PDF (Pro)"}
            </button>
          </div>
        </div>

        {/* Platform & Engine Selector */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 max-w-full">
            <span className="text-zinc-400 font-medium shrink-0">Marketplace:</span>
            <div className="inline-flex flex-wrap sm:flex-nowrap bg-zinc-950 p-1 rounded-xl border border-zinc-800 overflow-x-auto max-w-full">
              <button
                onClick={() => handlePlatformChange("etsy")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  platform === "etsy"
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Etsy
              </button>
              <button
                onClick={() => handlePlatformChange("tiktok")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  platform === "tiktok"
                    ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                TikTok Shop
              </button>
              <button
                onClick={() => handlePlatformChange("amazon")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  platform === "amazon"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                Amazon (FBA)
              </button>
              <button
                onClick={() => handlePlatformChange("ebay")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  platform === "ebay"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/40 shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                eBay
              </button>
              <button
                onClick={() => handlePlatformChange("shopify")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  platform === "shopify"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-xs"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Shopify DTC
              </button>
            </div>
          </div>

          {/* Engine Parameters */}
          {platform === "etsy" ? (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Offsite Ads:</span>
              <select
                value={etsyOffsiteAdsRate}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) as 0 | 0.12 | 0.15;
                  setEtsyOffsiteAdsRate(val);
                  if (auditedItems.length > 0 && platform === "etsy") {
                    setAuditedItems((prev) =>
                      prev.map((item) => {
                        const inputs: EtsyInputs = {
                          sellingPrice: item.sellingPrice,
                          cogs: item.cogs,
                          shippingCharged: item.shippingCharged,
                          actualShippingCost: item.actualShippingCost,
                          packagingCost: item.packagingCost,
                          miscCost: item.miscCost,
                          offsiteAdsRate: val,
                          quantity: 1,
                        };
                        const res = calculateEtsyProfit(inputs);
                        return {
                          ...item,
                          grossRevenue: res.grossRevenue,
                          totalCosts: res.totalCosts,
                          totalFees: res.totalFees,
                          netProfit: res.netProfit,
                          netMarginPercent: res.netMarginPercent,
                          isBleeding: res.netProfit < 0,
                          breakdown: res,
                        };
                      })
                    );
                  }
                }}
                className="bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-2.5 py-1.5 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value={0}>0% (Standard / Organic)</option>
                <option value={0.12}>12% (Mandated Sellers)</option>
                <option value={0.15}>15% (Optional Sellers)</option>
              </select>
            </div>
          ) : platform === "tiktok" ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">Affiliate:</span>
                <select
                  value={tiktokCommissionRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTiktokCommissionRate(val);
                    if (auditedItems.length > 0 && platform === "tiktok") {
                      setAuditedItems((prev) =>
                        prev.map((item) => {
                          const inputs: TikTokInputs = {
                            sellingPrice: item.sellingPrice,
                            cogs: item.cogs,
                            shippingCost: item.actualShippingCost,
                            packagingCost: item.packagingCost,
                            miscCost: item.miscCost,
                            affiliateCommissionRate: val,
                            adSpendPerSale: tiktokAdSpend,
                            returnRate: tiktokReturnRate,
                          };
                          const res = calculateTikTokProfit(inputs);
                          return {
                            ...item,
                            grossRevenue: res.grossRevenue,
                            totalCosts: res.totalCosts,
                            totalFees: res.totalFees,
                            netProfit: res.netProfit,
                            netMarginPercent: res.netMarginPercent,
                            isBleeding: res.netProfit < 0,
                            breakdown: res,
                          };
                        })
                      );
                    }
                  }}
                  className="bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value={0.05}>5%</option>
                  <option value={0.1}>10% (Typical)</option>
                  <option value={0.15}>15%</option>
                  <option value={0.2}>20%</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">Return Rate:</span>
                <select
                  value={tiktokReturnRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setTiktokReturnRate(val);
                    if (auditedItems.length > 0 && platform === "tiktok") {
                      setAuditedItems((prev) =>
                        prev.map((item) => {
                          const inputs: TikTokInputs = {
                            sellingPrice: item.sellingPrice,
                            cogs: item.cogs,
                            shippingCost: item.actualShippingCost,
                            packagingCost: item.packagingCost,
                            miscCost: item.miscCost,
                            affiliateCommissionRate: tiktokCommissionRate,
                            adSpendPerSale: tiktokAdSpend,
                            returnRate: val,
                          };
                          const res = calculateTikTokProfit(inputs);
                          return {
                            ...item,
                            grossRevenue: res.grossRevenue,
                            totalCosts: res.totalCosts,
                            totalFees: res.totalFees,
                            netProfit: res.netProfit,
                            netMarginPercent: res.netMarginPercent,
                            isBleeding: res.netProfit < 0,
                            breakdown: res,
                          };
                        })
                      );
                    }
                  }}
                  className="bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value={0.02}>2%</option>
                  <option value={0.05}>5% (Standard)</option>
                  <option value={0.08}>8%</option>
                </select>
              </div>
            </div>
          ) : platform === "ebay" ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">Final Value Fee:</span>
                <select
                  value={ebayFvfRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setEbayFvfRate(val);
                    if (auditedItems.length > 0 && platform === "ebay") {
                      setAuditedItems((prev) =>
                        prev.map((item) => {
                          const inputs: EbayInputs = {
                            sellingPrice: item.sellingPrice,
                            cogs: item.cogs,
                            shippingCharged: item.shippingCharged,
                            actualShippingCost: item.actualShippingCost,
                            packagingCost: item.packagingCost,
                            miscCost: item.miscCost,
                            finalValueFeeRate: val,
                            promotedListingRate: ebayPromotedRate,
                            storeSubscriptionMonthlyCost: 21.95,
                            insertionFee: 0,
                            returnRate: 0.03,
                          };
                          const res = calculateEbayProfit(inputs);
                          return {
                            ...item,
                            grossRevenue: res.grossRevenue,
                            totalCosts: res.totalCosts,
                            totalFees: res.totalFees,
                            netProfit: res.netProfit,
                            netMarginPercent: res.netMarginPercent,
                            isBleeding: res.netProfit < 0,
                            breakdown: res,
                          };
                        })
                      );
                    }
                  }}
                  className="bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value={0.136}>13.60% (Standard Most Categories)</option>
                  <option value={0.067}>6.70% (Guitars & Musical Instruments)</option>
                  <option value={0.15}>15.0% (Jewelry & Watches)</option>
                  <option value={0.153}>15.30% (Books, Movies & Music)</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">Promoted Listings:</span>
                <select
                  value={ebayPromotedRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setEbayPromotedRate(val);
                    if (auditedItems.length > 0 && platform === "ebay") {
                      setAuditedItems((prev) =>
                        prev.map((item) => {
                          const inputs: EbayInputs = {
                            sellingPrice: item.sellingPrice,
                            cogs: item.cogs,
                            shippingCharged: item.shippingCharged,
                            actualShippingCost: item.actualShippingCost,
                            packagingCost: item.packagingCost,
                            miscCost: item.miscCost,
                            finalValueFeeRate: ebayFvfRate,
                            promotedListingRate: val,
                            storeSubscriptionMonthlyCost: 21.95,
                            insertionFee: 0,
                            returnRate: 0.03,
                          };
                          const res = calculateEbayProfit(inputs);
                          return {
                            ...item,
                            grossRevenue: res.grossRevenue,
                            totalCosts: res.totalCosts,
                            totalFees: res.totalFees,
                            netProfit: res.netProfit,
                            netMarginPercent: res.netMarginPercent,
                            isBleeding: res.netProfit < 0,
                            breakdown: res,
                          };
                        })
                      );
                    }
                  }}
                  className="bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value={0}>0% (Organic)</option>
                  <option value={0.03}>3% (Standard Boost)</option>
                  <option value={0.05}>5% (Medium Competition)</option>
                  <option value={0.08}>8% (High Competition)</option>
                </select>
              </div>
            </div>
          ) : platform === "shopify" ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">Plan Tier:</span>
                <select
                  value={shopifyPlanTier}
                  onChange={(e) => {
                    const val = e.target.value as "basic" | "shopify" | "advanced";
                    setShopifyPlanTier(val);
                    if (auditedItems.length > 0 && platform === "shopify") {
                      setAuditedItems((prev) =>
                        prev.map((item) => {
                          const inputs: ShopifyInputs = {
                            sellingPrice: item.sellingPrice,
                            cogs: item.cogs,
                            shippingCharged: item.shippingCharged,
                            actualShippingCost: item.actualShippingCost,
                            packagingCost: item.packagingCost,
                            miscCost: item.miscCost,
                            planTier: val,
                            isThirdPartyPaymentGateway: false,
                            monthlyAppsCost: 89,
                            adSpendPerSale: shopifyAdSpend,
                            returnRate: 0.04,
                          };
                          const res = calculateShopifyProfit(inputs);
                          return {
                            ...item,
                            grossRevenue: res.grossRevenue,
                            totalCosts: res.totalCosts,
                            totalFees: res.totalFees,
                            netProfit: res.netProfit,
                            netMarginPercent: res.netMarginPercent,
                            isBleeding: res.netProfit < 0,
                            breakdown: res,
                          };
                        })
                      );
                    }
                  }}
                  className="bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="basic">Basic ($39/mo, 2.9%+30¢)</option>
                  <option value="shopify">Shopify ($105/mo, 2.7%+30¢)</option>
                  <option value="advanced">Advanced ($399/mo, 2.5%+30¢)</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">Ad CAC:</span>
                <select
                  value={shopifyAdSpend}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setShopifyAdSpend(val);
                    if (auditedItems.length > 0 && platform === "shopify") {
                      setAuditedItems((prev) =>
                        prev.map((item) => {
                          const inputs: ShopifyInputs = {
                            sellingPrice: item.sellingPrice,
                            cogs: item.cogs,
                            shippingCharged: item.shippingCharged,
                            actualShippingCost: item.actualShippingCost,
                            packagingCost: item.packagingCost,
                            miscCost: item.miscCost,
                            planTier: shopifyPlanTier,
                            isThirdPartyPaymentGateway: false,
                            monthlyAppsCost: 89,
                            adSpendPerSale: val,
                            returnRate: 0.04,
                          };
                          const res = calculateShopifyProfit(inputs);
                          return {
                            ...item,
                            grossRevenue: res.grossRevenue,
                            totalCosts: res.totalCosts,
                            totalFees: res.totalFees,
                            netProfit: res.netProfit,
                            netMarginPercent: res.netMarginPercent,
                            isBleeding: res.netProfit < 0,
                            breakdown: res,
                          };
                        })
                      );
                    }
                  }}
                  className="bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value={0}>$0 (Pure Organic)</option>
                  <option value={5}>$5 / order (Low CAC)</option>
                  <option value={10}>$10 / order (Standard Meta/Google)</option>
                  <option value={18}>$18 / order (Aggressive Acquisition)</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">Referral:</span>
                <select
                  value={amazonReferralRate}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setAmazonReferralRate(val);
                    if (auditedItems.length > 0 && platform === "amazon") {
                      setAuditedItems((prev) =>
                        prev.map((item) => {
                          const inputs: AmazonInputs = {
                            sellingPrice: item.sellingPrice,
                            cogs: item.cogs,
                            fulfillmentMode: "fba",
                            referralFeeRate: val,
                            fbaFee: amazonFbaFee,
                            storageAndInboundFee: 0.65,
                            shippingCharged: item.shippingCharged,
                            actualShippingCost: item.actualShippingCost,
                            packagingCost: item.packagingCost,
                            miscCost: item.miscCost,
                            adSpendPerSale: 0,
                            returnRate: 0.03,
                          };
                          const res = calculateAmazonProfit(inputs);
                          return {
                            ...item,
                            grossRevenue: res.grossRevenue,
                            totalCosts: res.totalCosts,
                            totalFees: res.totalFees,
                            netProfit: res.netProfit,
                            netMarginPercent: res.netMarginPercent,
                            isBleeding: res.netProfit < 0,
                            breakdown: res,
                          };
                        })
                      );
                    }
                  }}
                  className="bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value={0.15}>15% (Standard)</option>
                  <option value={0.08}>8% (Electronics)</option>
                  <option value={0.17}>17% (Apparel &gt; $20)</option>
                  <option value={0.10}>10% (Apparel $15–$20)</option>
                  <option value={0.05}>5% (Apparel &lt; $15)</option>
                  <option value={0.12}>12% (Automotive)</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400">FBA Size:</span>
                <select
                  value={amazonFbaFee}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setAmazonFbaFee(val);
                    if (auditedItems.length > 0 && platform === "amazon") {
                      setAuditedItems((prev) =>
                        prev.map((item) => {
                          const inputs: AmazonInputs = {
                            sellingPrice: item.sellingPrice,
                            cogs: item.cogs,
                            fulfillmentMode: "fba",
                            referralFeeRate: amazonReferralRate,
                            fbaFee: val,
                            storageAndInboundFee: 0.65,
                            shippingCharged: item.shippingCharged,
                            actualShippingCost: item.actualShippingCost,
                            packagingCost: item.packagingCost,
                            miscCost: item.miscCost,
                            adSpendPerSale: 0,
                            returnRate: 0.03,
                          };
                          const res = calculateAmazonProfit(inputs);
                          return {
                            ...item,
                            grossRevenue: res.grossRevenue,
                            totalCosts: res.totalCosts,
                            totalFees: res.totalFees,
                            netProfit: res.netProfit,
                            netMarginPercent: res.netMarginPercent,
                            isBleeding: res.netProfit < 0,
                            breakdown: res,
                          };
                        })
                      );
                    }
                  }}
                  className="bg-zinc-950 text-zinc-200 border border-zinc-800 rounded-xl px-2 py-1.5 text-xs focus:outline-none cursor-pointer"
                >
                  <option value={3.22}>Small Std ($3.22)</option>
                  <option value={3.86}>Large 1lb ($3.86)</option>
                  <option value={4.75}>Large 2lb ($4.75)</option>
                  <option value={5.4}>Large 3lb ($5.40)</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? "border-emerald-400 bg-emerald-950/20 scale-[1.01]"
            : "border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/70 hover:border-zinc-700"
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".csv,text/csv"
          className="hidden"
        />
        <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center text-zinc-400 shadow-inner">
          <UploadCloud className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {fileName ? (
              <span className="text-emerald-400 flex items-center gap-1.5 justify-center">
                <CheckCircle2 className="w-4 h-4" /> Active file: {fileName}
              </span>
            ) : (
              <span>
                <span className="sm:hidden text-emerald-400 underline font-bold">
                  Tap to upload CSV
                </span>
                <span className="hidden sm:inline">
                  Click to browse or drag and drop your inventory CSV
                </span>
              </span>
            )}
          </p>
          <p className="text-xs text-zinc-500 mt-1 max-w-xl mx-auto">
            Expected {PLATFORM_SAMPLE_CSV_CONFIG[platform].name} headers: <code className="text-zinc-300 font-mono">{PLATFORM_SAMPLE_CSV_CONFIG[platform].expectedHeadersDesc}</code>
          </p>
        </div>
        {isParsing && (
          <div className="flex items-center gap-2 text-xs text-emerald-400 mt-1 animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Processing inventory records...
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. SUMMARY KPI HEADER (Always shows real full numbers!)
         ───────────────────────────────────────────────────────────── */}
      {auditedItems.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Total SKUs */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between text-zinc-400 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Total SKUs Audited
                </span>
                <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                  {summary.totalCount}
                </span>
                <span className="text-xs text-zinc-500">items</span>
              </div>
              <div className="mt-2 text-xs text-zinc-400 flex justify-between border-t border-zinc-800/80 pt-2">
                <span>Gross Revenue</span>
                <span className="font-semibold text-white tabular-nums">
                  ${summary.totalGrossRevenue.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Profitable SKUs */}
            <div className="bg-zinc-900/70 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
              <div className="flex items-center justify-between text-emerald-400 mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Profitable SKUs
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tabular-nums">
                  {summary.profitableCount}
                </span>
                <span className="text-xs font-semibold text-emerald-500/90">
                  ({summary.profitablePercent.toFixed(1)}%)
                </span>
              </div>
              <div className="mt-2 text-xs text-emerald-300 flex justify-between border-t border-zinc-800/80 pt-2">
                <span>Total Net Profit</span>
                <span className="font-bold tabular-nums">
                  +${summary.totalProfit.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bleeding Cash SKUs */}
            <div
              className={`rounded-2xl p-4 sm:p-5 shadow-sm relative overflow-hidden transition-all ${
                summary.bleedingCount > 0
                  ? "bg-rose-950/30 border border-rose-500/50 shadow-rose-950/20"
                  : "bg-zinc-900/70 border border-zinc-800"
              }`}
            >
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${
                  summary.bleedingCount > 0 ? "bg-rose-600" : "bg-zinc-700"
                }`}
              />
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    summary.bleedingCount > 0 ? "text-rose-400" : "text-zinc-400"
                  }`}
                >
                  Bleeding Cash SKUs
                </span>
                <AlertTriangle
                  className={`w-4 h-4 ${
                    summary.bleedingCount > 0 ? "text-rose-400" : "text-zinc-500"
                  }`}
                />
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-2xl sm:text-3xl font-extrabold tabular-nums ${
                    summary.bleedingCount > 0 ? "text-rose-400" : "text-zinc-400"
                  }`}
                >
                  {summary.bleedingCount}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    summary.bleedingCount > 0 ? "text-rose-400/90" : "text-zinc-500"
                  }`}
                >
                  ({summary.bleedingPercent.toFixed(1)}%)
                </span>
              </div>
              <div className="mt-2 text-xs text-rose-300 flex justify-between border-t border-zinc-800/80 pt-2">
                <span>Loss Per Order</span>
                <span className="font-bold tabular-nums">
                  -${summary.totalLoss.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Catalog Margin Distribution Bar */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 sm:p-4 space-y-2">
            <div className="flex flex-wrap justify-between items-center text-xs gap-2">
              <span className="text-zinc-400">
                Portfolio Net Profit:{" "}
                <span
                  className={`font-bold ${
                    summary.netTotalProfit >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  ${summary.netTotalProfit.toFixed(2)} ({summary.portfolioMargin.toFixed(1)}% Margin)
                </span>
              </span>
              <span className="text-zinc-500 text-[11px]">
                {summary.profitableCount} Profitable / {summary.bleedingCount} Losing Money
              </span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${summary.profitablePercent}%` }}
                className="bg-emerald-500 h-full transition-all duration-500"
                title={`Profitable: ${summary.profitablePercent.toFixed(1)}%`}
              />
              <div
                style={{ width: `${summary.bleedingPercent}%` }}
                className="bg-rose-500 h-full transition-all duration-500"
                title={`Bleeding Cash: ${summary.bleedingPercent.toFixed(1)}%`}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. DATA DISPLAY WITH TEASER BLUR FOR FREE USERS
         ───────────────────────────────────────────────────────────── */}
      {auditedItems.length > 0 && (
        <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl space-y-4">
          {/* Toolbar */}
          <div className="p-3.5 sm:p-4 border-b border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-950/40">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-zinc-800 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setFilter("all")}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === "all"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All ({auditedItems.length})
              </button>
              <button
                onClick={() => setFilter("bleeding")}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filter === "bleeding"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-rose-400 hover:text-rose-300"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Bleeding Only ({summary.bleedingCount})
              </button>
              <button
                onClick={() => setFilter("profitable")}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  filter === "profitable"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-emerald-400 hover:text-emerald-300"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Profitable ({summary.profitableCount})
              </button>
            </div>

            {/* View Mode Toggle & Search */}
            <div className="flex items-center gap-2">
              <div className="inline-flex bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "cards"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Card View (Mobile Friendly)"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-1.5 rounded-lg transition-all ${
                    viewMode === "table"
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Table View (Full Columns)"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="relative flex-1 md:w-56">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Filter SKU or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900 text-xs text-white placeholder-zinc-500 pl-8 pr-3 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-zinc-600"
                />
              </div>
            </div>
          </div>

          {/* Cards View */}
          {viewMode === "cards" ? (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 relative">
              {filteredItems.length === 0 ? (
                <div className="col-span-full py-10 text-center text-zinc-500 text-xs">
                  No listings match the filter.
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isBleeding = item.netProfit < 0;
                  const isItemBlurred = !isPro && index >= FREE_TIER_PREVIEW_LIMIT;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border p-4 transition-all relative ${
                        isItemBlurred
                          ? "filter blur-[5px] select-none pointer-events-none opacity-40 bg-zinc-950 border-zinc-800"
                          : isBleeding
                          ? "bg-rose-950/30 text-rose-100 border-rose-500/40 shadow-md shadow-rose-950/20"
                          : "bg-zinc-950/60 border-zinc-800/80 text-zinc-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="truncate">
                          <span
                            className={`font-mono text-xs font-bold ${
                              isBleeding ? "text-rose-300/80" : "text-zinc-400"
                            }`}
                          >
                            {item.sku}
                          </span>
                          <h4
                            className={`text-sm font-bold truncate ${
                              isBleeding ? "text-white" : "text-white"
                            }`}
                            title={item.name}
                          >
                            {item.name}
                          </h4>
                        </div>
                        {isBleeding ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-500/40 shrink-0">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            BLEEDING CASH
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            PROFITABLE
                          </span>
                        )}
                      </div>

                      <div
                        className={`grid grid-cols-2 gap-2 text-xs py-2 my-2 border-y ${
                          isBleeding
                            ? "border-rose-900/40 text-rose-200"
                            : "border-zinc-800 text-zinc-400"
                        }`}
                      >
                        <div>
                          <span className="opacity-70 text-[10px] block">Selling Price</span>
                          <span className="font-semibold tabular-nums">
                            ${item.sellingPrice.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="opacity-70 text-[10px] block">
                            Shipping (Chg / Act)
                          </span>
                          <span className="font-semibold tabular-nums">
                            +${item.shippingCharged.toFixed(2)} / -${item.actualShippingCost.toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="opacity-70 text-[10px] block">
                            COGS + Pack + Misc
                          </span>
                          <span className="font-semibold tabular-nums">
                            ${(item.cogs + item.packagingCost + item.miscCost).toFixed(2)}
                          </span>
                        </div>
                        <div>
                          <span className="opacity-70 text-[10px] block">Total Fees</span>
                          <span className="font-semibold tabular-nums">
                            ${item.totalFees.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <div>
                          <span className="text-[10px] block opacity-70">Net Profit</span>
                          <span
                            className={`text-base font-black tabular-nums flex items-center gap-1 ${
                              isBleeding ? "text-rose-400" : "text-emerald-400"
                            }`}
                          >
                            {isBleeding ? (
                              <TrendingDown className="w-4 h-4 text-rose-400" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {item.netProfit < 0 ? "-" : "+"}$
                            {Math.abs(item.netProfit).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] block opacity-70">Net Margin</span>
                          <span
                            className={`text-base font-bold tabular-nums ${
                              isBleeding ? "text-rose-400" : "text-emerald-400"
                            }`}
                          >
                            {item.netMarginPercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-x-auto no-scrollbar relative">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/70 text-zinc-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4 sticky left-0 bg-zinc-950/95 z-10 shadow-xs">
                      SKU / Product
                    </th>
                    <th className="py-3 px-3">Audit Status</th>
                    <th className="py-3 px-3 text-right">Selling Price</th>
                    <th className="py-3 px-3 text-center">Shipping (Chg / Act)</th>
                    <th className="py-3 px-3 text-right">COGS + Pack + Misc</th>
                    <th className="py-3 px-3 text-right">Mktplace Fees</th>
                    <th className="py-3 px-4 text-right">Net Profit</th>
                    <th className="py-3 px-3 text-right">Net Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-zinc-500">
                        No SKUs match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => {
                      const isBleeding = item.netProfit < 0;
                      const isRowBlurred = !isPro && index >= FREE_TIER_PREVIEW_LIMIT;

                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors font-medium ${
                            isRowBlurred
                              ? "filter blur-[5px] select-none pointer-events-none opacity-40 bg-zinc-950 text-zinc-500"
                              : isBleeding
                              ? "bg-rose-950/30 text-rose-100 hover:bg-rose-950/45"
                              : "text-zinc-200 hover:bg-zinc-800/30"
                          }`}
                        >
                          <td
                            className={`py-3 px-4 sticky left-0 z-10 ${
                              isRowBlurred
                                ? "bg-zinc-950"
                                : isBleeding
                                ? "bg-[#1f0a10]"
                                : "bg-zinc-900/90"
                            }`}
                          >
                            <div className="font-bold text-sm tracking-tight text-white">
                              {item.sku}
                            </div>
                            <div
                              className={`text-xs truncate max-w-[180px] sm:max-w-[260px] lg:max-w-[360px] xl:max-w-[480px] ${
                                isBleeding ? "text-rose-300/80" : "text-zinc-400"
                              }`}
                              title={item.name}
                            >
                              {item.name}
                            </div>
                          </td>

                          <td className="py-3 px-3 whitespace-nowrap">
                            {isBleeding ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-black uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-500/40">
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                BLEEDING CASH
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                PROFITABLE
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-3 text-right tabular-nums font-semibold">
                            ${item.sellingPrice.toFixed(2)}
                          </td>

                          <td className="py-3 px-3 text-center tabular-nums text-xs whitespace-nowrap">
                            <span
                              className={
                                isBleeding ? "text-rose-300" : "text-zinc-300"
                              }
                            >
                              +${item.shippingCharged.toFixed(2)}
                            </span>
                            <span className="mx-1 text-zinc-500">/</span>
                            <span
                              className={
                                isBleeding ? "text-rose-400 font-bold" : "text-zinc-400"
                              }
                            >
                              -${item.actualShippingCost.toFixed(2)}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right tabular-nums">
                            ${(item.cogs + item.packagingCost + item.miscCost).toFixed(2)}
                          </td>

                          <td className="py-3 px-3 text-right tabular-nums font-semibold">
                            ${item.totalFees.toFixed(2)}
                          </td>

                          <td className="py-3 px-4 text-right tabular-nums">
                            <span
                              className={`text-sm font-black inline-flex items-center gap-1 ${
                                isBleeding ? "text-rose-400" : "text-emerald-400"
                              }`}
                            >
                              {isBleeding ? (
                                <TrendingDown className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              ) : (
                                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                              {item.netProfit < 0 ? "-" : "+"}$
                              {Math.abs(item.netProfit).toFixed(2)}
                            </span>
                          </td>

                          <td className="py-3 px-3 text-right tabular-nums font-bold">
                            <span
                              className={
                                isBleeding ? "text-rose-400" : "text-emerald-400"
                              }
                            >
                              {item.netMarginPercent.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              TEASER BLUR OVERLAY CARD (SUNK COST CONVERSION HOOK)
             ───────────────────────────────────────────────────────────── */}
          {isBlurred && (
            <div className="p-4 sm:p-6 bg-gradient-to-t from-zinc-950 via-zinc-950/95 to-transparent border-t border-zinc-800/80 -mt-24 sm:-mt-32 relative z-20 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-950/60">
                <Lock className="w-6 h-6" />
              </div>

              <div className="max-w-md space-y-1">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {hiddenCount} More Listings Calculated
                  {hiddenBleedingCount > 0 && (
                    <span className="text-rose-400 block text-sm sm:text-base font-bold mt-0.5">
                      (Includes {hiddenBleedingCount} Cash-Bleeding SKUs)
                    </span>
                  )}
                </h3>
                <p className="text-xs text-zinc-400">
                  Your inventory data has already been audited. Don&apos;t leave money on the table — upgrade to FeeSpotter Pro to unblur all listings and export your official PDF report.
                </p>
              </div>

              <button
                onClick={onOpenProModal}
                className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-950/80 transition-all cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Zap className="w-4 h-4" />
                Unlock All SKUs with Pro ($5/mo or $50/yr)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BatchCsvAudit;
