import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://feespotter.com";

  return [
    {
      url: baseUrl,
      lastModified: "2026-10-17",
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/etsy-fee-calculator`,
      lastModified: "2026-10-17",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tiktok-shop-fee-calculator`,
      lastModified: "2026-10-17",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/amazon-fba-fee-calculator`,
      lastModified: "2026-10-17",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ebay-fee-calculator`,
      lastModified: "2026-10-17",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shopify-fee-calculator`,
      lastModified: "2026-10-17",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2026-10-17",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: "2026-10-17",
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: "2026-10-17",
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
