import { NextResponse } from "next/server";
import { createVippsEpayment } from "@/app/lib/vipps/client";
import {
  getPublicSiteUrl,
  getVippsDefaultAmountOre,
  getVippsPaymentDescription,
  getVippsServerCreds,
} from "@/app/lib/vipps/env";
import { VIPPS_NOK_MAX_ORE, VIPPS_NOK_MIN_ORE } from "@/app/lib/vipps/amounts";

export const runtime = "nodejs";

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
  const creds = getVippsServerCreds();
  if (!creds) {
    return NextResponse.json(
      {
        error: "Vipps er ikke konfigurert. Legg inn VIPPS_*-variabler på serveren.",
      },
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

  if (amountOre < VIPPS_NOK_MIN_ORE || amountOre > VIPPS_NOK_MAX_ORE) {
    return NextResponse.json(
      {
        error: `Ugyldig beløp. NOK må være mellom ${VIPPS_NOK_MIN_ORE / 100} og ${VIPPS_NOK_MAX_ORE / 100}.`,
      },
      { status: 400 },
    );
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
