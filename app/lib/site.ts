/** Canonical public origin for SEO, sitemap, and absolute URLs. */
export function getSiteUrl(): string {
  const fromEnv = process.env.SITE_URL?.trim().replace(/\/$/, "");
  return fromEnv || "https://www.thedogfather.no";
}
