/**
 * Centralized site URL helper.
 * Uses NEXT_PUBLIC_SITE_URL or VERCEL_PROJECT_PRODUCTION_URL if available,
 * otherwise falls back to https://feespotter.com.
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`.replace(/\/$/, "");
  }
  return "https://feespotter.com";
}
