import { NextResponse } from "next/server";
import { createVippsEpayment } from "@/app/lib/vipps/client";
import {
  getPublicSiteUrl,
  getVippsDefaultAmountOre,
  getVippsPaymentDescription,
  getVippsServerCreds,
  isVippsConfigured,
} from "@/app/lib/vipps/env";

export const runtime = "nodejs";

const MAX_ORE = 1_000_000_00; // 1 000 000.00 NOK

function normalizePhoneMsisdn(input: string | undefined): string | undefined {
  if (!input || typeof input !== "string") return undefined;
  const d = input.replace(/\D/g, "");
  if (d.length === 8) return `47${d}`;
  if (d.length === 10 && d.startsWith("47")) return d;
  if (d.length === 11 && d.startsWith("47")) return d;
  if (d.length === 9 && d.startsWith("47")) return d;
  return undefined;
}

type Body = {
  amountOre?: number;
  phoneNumber?: string;
};

export async function POST(request: Request) {
  if (!isVippsConfigured()) {
    return NextResponse.json(
      {
        error: "Vipps er ikke konfigurert. Legg inn VIPPS_*-variabler på serveren.",
      },
      { status: 503 },
    );
  }

  const creds = getVippsServerCreds();
  if (!creds) {
    return NextResponse.json(
      { error: "Vipps er ikke konfigurert på serveren." },
      { status: 503 },
    );
  }

  let body: Body = {};
  try {
    const text = await request.text();
    if (text) body = JSON.parse(text) as Body;
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const rawAmount = body.amountOre;
  const amountOre =
    typeof rawAmount === "number" && Number.isFinite(rawAmount) && rawAmount > 0
      ? Math.floor(rawAmount)
      : getVippsDefaultAmountOre();

  if (amountOre < 1 || amountOre > MAX_ORE) {
    return NextResponse.json({ error: "Ugyldig beløp" }, { status: 400 });
  }

  const publicBaseUrl = getPublicSiteUrl();
  const description = getVippsPaymentDescription();
  const phoneMsisdn = normalizePhoneMsisdn(body.phoneNumber);

  try {
    const { redirectUrl, reference } = await createVippsEpayment(
      {
        publicBaseUrl,
        amountOre,
        phoneMsisdn,
        paymentDescription: description,
      },
      creds,
    );
    return NextResponse.json({ redirectUrl, reference });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ukjent feil";
    console.error("[vipps] create payment", message);
    return NextResponse.json(
      { error: "Kunne ikke starte Vipps-betaling. Prøv igjen senere." },
      { status: 502 },
    );
  }
}
