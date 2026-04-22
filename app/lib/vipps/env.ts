function stripTrailingSlashes(s: string) {
  return s.replace(/\/+$/, "");
}

/**
 * Public site base URL, used for ePayment returnUrl. Prefer SITE_URL in env.
 */
export function getPublicSiteUrl(): string {
  const fromEnv = process.env.SITE_URL;
  if (fromEnv) return stripTrailingSlashes(fromEnv);
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export function getVippsApiBase(): string {
  return (
    process.env.VIPPS_API_BASE?.trim() || "https://apitest.vipps.no"
  );
}

export function isVippsConfigured(): boolean {
  return Boolean(
    process.env.VIPPS_CLIENT_ID &&
      process.env.VIPPS_CLIENT_SECRET &&
      process.env.VIPPS_SUBSCRIPTION_KEY &&
      process.env.VIPPS_MSN,
  );
}

export type VippsServerCreds = {
  clientId: string;
  clientSecret: string;
  subscriptionKey: string;
  msn: string;
};

/** Server-only credentials for API calls (never expose to the client). */
export function getVippsServerCreds(): VippsServerCreds | null {
  if (!isVippsConfigured()) return null;
  return {
    clientId: process.env.VIPPS_CLIENT_ID!,
    clientSecret: process.env.VIPPS_CLIENT_SECRET!,
    subscriptionKey: process.env.VIPPS_SUBSCRIPTION_KEY!,
    msn: process.env.VIPPS_MSN!.replace(/\D/g, ""),
  };
}

/**
 * Default amount in minor units (øre). Vipps docs often use 1000 = 10.00 NOK for testing.
 */
export function getVippsDefaultAmountOre(): number {
  const raw = process.env.VIPPS_DEFAULT_AMOUNT_ORE;
  if (!raw) return 1000;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 1000;
}

/** Optional: MSISDN without + (e.g. 4790000000) to prefill in MT / test. */
export function getVippsTestPhoneMsisdn(): string | undefined {
  const p = process.env.VIPPS_TEST_USER_MSISDN?.trim();
  return p || undefined;
}

export function getVippsPaymentDescription(): string {
  return (
    process.env.VIPPS_PAYMENT_DESCRIPTION?.trim() || "Betaling – The Dogfather"
  );
}
