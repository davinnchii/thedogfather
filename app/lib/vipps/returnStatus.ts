import { fetchVippsPaymentDetails } from "./client";
import { getVippsServerCreds, type VippsServerCreds } from "./env";

/** Our create-payment reference format: `df-` + UUID */
const REF_PATTERN = /^df-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseStates(
  state: string | string[] | undefined,
): string[] {
  if (!state) return [];
  return Array.isArray(state) ? state : [state];
}

/** Vipps can return a history; use the last entry as the current state. */
function currentState(states: string[]): string {
  if (states.length === 0) return "UNKNOWN";
  return states[states.length - 1] ?? "UNKNOWN";
}

export type VippsReturnView =
  | { kind: "no_ref" }
  | { kind: "invalid_ref" }
  | { kind: "unconfigured" }
  | { kind: "not_found" }
  | { kind: "lookup_error" }
  | { kind: "success"; reference: string; state: string }
  | { kind: "incomplete"; reference: string; state: string }
  | {
      kind: "failed";
      reference: string;
      state: string;
      reason: "aborted" | "expired" | "cancelled" | "terminated" | "other";
    };

function classify(
  reference: string,
  stateCode: string,
):
  | { kind: "success"; reference: string; state: string }
  | { kind: "incomplete"; reference: string; state: string }
  | {
      kind: "failed";
      reference: string;
      state: string;
      reason: "aborted" | "expired" | "cancelled" | "terminated" | "other";
    } {
  const s = stateCode.toUpperCase();
  if (s === "AUTHORIZED") {
    return { kind: "success", reference, state: s };
  }
  if (s === "CREATED") {
    return { kind: "incomplete", reference, state: s };
  }
  if (s === "ABORTED") {
    return { kind: "failed", reference, state: s, reason: "aborted" };
  }
  if (s === "EXPIRED") {
    return { kind: "failed", reference, state: s, reason: "expired" };
  }
  if (s === "CANCELLED") {
    return { kind: "failed", reference, state: s, reason: "cancelled" };
  }
  if (s === "TERMINATED") {
    return { kind: "failed", reference, state: s, reason: "terminated" };
  }
  return { kind: "failed", reference, state: s, reason: "other" };
}

export async function resolveVippsReturnView(
  ref: string | undefined,
): Promise<VippsReturnView> {
  if (!ref || !ref.trim()) {
    return { kind: "no_ref" };
  }
  const trimmed = ref.trim();
  if (!REF_PATTERN.test(trimmed)) {
    return { kind: "invalid_ref" };
  }

  const creds: VippsServerCreds | null = getVippsServerCreds();
  if (!creds) {
    return { kind: "unconfigured" };
  }

  try {
    const details = await fetchVippsPaymentDetails(trimmed, creds);
    const states = parseStates(details.state);
    const s = currentState(states);
    return classify(details.reference || trimmed, s);
  } catch (e) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return { kind: "not_found" };
    }
    return { kind: "lookup_error" };
  }
}
