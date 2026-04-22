import { randomUUID } from "node:crypto";
import { getVippsApiBase, getVippsTestPhoneMsisdn } from "./env";

function stripTrailingSlashes(s: string) {
  return s.replace(/\/+$/, "");
}

type AccessTokenResponse = {
  access_token: string;
  expires_in: string | number;
  token_type?: string;
};

type CreatePaymentResponse = {
  redirectUrl?: string;
  reference?: string;
  state?: string;
};

const SYSTEM_NAME = "dog-site";
const SYSTEM_VERSION = "0.1.0";
const PLUGIN_NAME = "nextjs-hero";
const PLUGIN_VERSION = "1.0.0";

let accessTokenCache: { token: string; expiresAtMs: number } | null = null;

function vippsHeaders(
  accessToken: string,
  idempotencyKey: string,
  msn: string,
  subscriptionKey: string,
) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
    "Ocp-Apim-Subscription-Key": subscriptionKey,
    "Merchant-Serial-Number": msn,
    "Idempotency-Key": idempotencyKey,
    "Vipps-System-Name": SYSTEM_NAME,
    "Vipps-System-Version": SYSTEM_VERSION,
    "Vipps-System-Plugin-Name": PLUGIN_NAME,
    "Vipps-System-Plugin-Version": PLUGIN_VERSION,
  } as const;
}

export async function fetchVippsAccessToken(
  baseUrl: string,
  clientId: string,
  clientSecret: string,
  subscriptionKey: string,
  msn: string,
): Promise<AccessTokenResponse> {
  /** Standard auth: keys in headers, no body — see Vipps access token docs. */
  const res = await fetch(`${baseUrl}/accesstoken/get`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      client_id: clientId,
      client_secret: clientSecret,
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Merchant-Serial-Number": msn,
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Vipps accesstoken: ${res.status} ${res.statusText}`);
  }
  return JSON.parse(text) as AccessTokenResponse;
}

async function getCachedAccessToken(
  baseUrl: string,
  clientId: string,
  clientSecret: string,
  subscriptionKey: string,
  msn: string,
): Promise<string> {
  const now = Date.now();
  if (accessTokenCache && now < accessTokenCache.expiresAtMs - 30_000) {
    return accessTokenCache.token;
  }
  const data = await fetchVippsAccessToken(
    baseUrl,
    clientId,
    clientSecret,
    subscriptionKey,
    msn,
  );
  const sec =
    typeof data.expires_in === "string"
      ? parseInt(data.expires_in, 10)
      : data.expires_in;
  const ttl = Number.isFinite(sec) ? sec * 1000 : 3_500_000;
  accessTokenCache = {
    token: data.access_token,
    expiresAtMs: now + Math.min(ttl, 3_500_000),
  };
  return data.access_token;
}

export type CreateEpaymentInput = {
  /** Public origin only, e.g. https://example.com (no path). Used to build returnUrl. */
  publicBaseUrl: string;
  amountOre: number;
  phoneMsisdn?: string;
  paymentDescription: string;
};

/**
 * Create an ePayment (WALLET, WEB_REDIRECT). Returns the user-facing Vipps URL.
 * @see https://developer.vippsmobilepay.com/docs/APIs/epayment-api/quick-start/
 */
export async function createVippsEpayment(
  input: CreateEpaymentInput,
  creds: {
    clientId: string;
    clientSecret: string;
    subscriptionKey: string;
    msn: string;
  },
): Promise<{ redirectUrl: string; reference: string }> {
  const base = getVippsApiBase();
  const accessToken = await getCachedAccessToken(
    base,
    creds.clientId,
    creds.clientSecret,
    creds.subscriptionKey,
    creds.msn,
  );

  const reference = `df-${randomUUID()}`;
  const returnUrl = `${stripTrailingSlashes(
    input.publicBaseUrl,
  )}/vipps/return?ref=${encodeURIComponent(reference)}`;
  const idempotencyKey = randomUUID();

  const body: Record<string, unknown> = {
    amount: { currency: "NOK", value: input.amountOre },
    paymentMethod: { type: "WALLET" },
    reference,
    returnUrl,
    userFlow: "WEB_REDIRECT",
    paymentDescription: input.paymentDescription,
  };

  const testPhone = input.phoneMsisdn || getVippsTestPhoneMsisdn();
  if (testPhone) {
    const digits = testPhone.replace(/\D/g, "");
    if (digits.length >= 8) {
      (body as { customer: { phoneNumber: string } }).customer = {
        phoneNumber: digits,
      };
    }
  }

  const res = await fetch(`${base}/epayment/v1/payments`, {
    method: "POST",
    headers: vippsHeaders(
      accessToken,
      idempotencyKey,
      creds.msn,
      creds.subscriptionKey,
    ),
    body: JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Vipps create payment: ${res.status} ${res.statusText}`);
  }
  const data = JSON.parse(text) as CreatePaymentResponse;
  if (!data.redirectUrl) {
    throw new Error("Vipps create payment: missing redirectUrl in response");
  }
  return { redirectUrl: data.redirectUrl, reference };
}

export type VippsPaymentDetailsResponse = {
  reference: string;
  state?: string | string[];
  amount?: { currency: string; value: number };
  pspReference?: string;
};

/**
 * Current payment state from GET /epayment/v1/payments/{reference}
 * @see https://developer.vippsmobilepay.com/docs/APIs/epayment-api/quick-start/
 */
export async function fetchVippsPaymentDetails(
  reference: string,
  creds: {
    clientId: string;
    clientSecret: string;
    subscriptionKey: string;
    msn: string;
  },
): Promise<VippsPaymentDetailsResponse> {
  const base = getVippsApiBase();
  const accessToken = await getCachedAccessToken(
    base,
    creds.clientId,
    creds.clientSecret,
    creds.subscriptionKey,
    creds.msn,
  );
  const idempotencyKey = randomUUID();
  const encoded = encodeURIComponent(reference);
  const res = await fetch(`${base}/epayment/v1/payments/${encoded}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Ocp-Apim-Subscription-Key": creds.subscriptionKey,
      "Merchant-Serial-Number": creds.msn,
      "Idempotency-Key": idempotencyKey,
      "Vipps-System-Name": SYSTEM_NAME,
      "Vipps-System-Version": SYSTEM_VERSION,
      "Vipps-System-Plugin-Name": PLUGIN_NAME,
      "Vipps-System-Plugin-Version": PLUGIN_VERSION,
    },
  });
  const text = await res.text();
  if (res.status === 404) {
    throw new Error("NOT_FOUND");
  }
  if (!res.ok) {
    throw new Error(`Vipps get payment: ${res.status} ${res.statusText}`);
  }
  return JSON.parse(text) as VippsPaymentDetailsResponse;
}
