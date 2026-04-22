import { NextResponse } from "next/server";
import type { CalendlyConfigPublic, CalendlyEventTypePublic } from "@/app/constants/calendly";

const CALENDLY_API_BASE = "https://api.calendly.com";

/** Calendly API user (from GET /users/me) */
interface CalendlyUser {
  resource: {
    uri: string;
    name: string;
    scheduling_url: string;
    slug: string;
    email?: string;
  };
}

/** Calendly API event type (from GET /event_types) */
interface CalendlyEventTypeResource {
  uri: string;
  name: string;
  slug: string;
  scheduling_url: string;
  duration: number;
  active: boolean;
}

export async function GET() {
  const token = process.env.CALENDLY_API_TOKEN ?? process.env.CALENDLY_API_KEY;

  if (!token?.trim()) {
    return NextResponse.json(
      {
        error: "Calendly is not configured",
      },
      { status: 503 }
    );
  }

  try {
    // 1. Get current user (to get URI and main scheduling URL)
    const userRes = await fetch(`${CALENDLY_API_BASE}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // cache 5 min
    });

    if (!userRes.ok) {
      console.error("[Calendly API] users/me error:", userRes.status);
      return NextResponse.json(
        { error: "Failed to load Calendly user" },
        { status: 502 }
      );
    }

    const userJson = (await userRes.json()) as CalendlyUser;
    const userUri = userJson.resource?.uri;
    const schedulingUrl = userJson.resource?.scheduling_url ?? "";

    if (!userUri) {
      return NextResponse.json(
        { error: "Invalid Calendly user response" },
        { status: 502 }
      );
    }

    // 2. Get event types for this user
    const eventTypesRes = await fetch(
      `${CALENDLY_API_BASE}/event_types?user=${encodeURIComponent(userUri)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!eventTypesRes.ok) {
      console.error("[Calendly API] event_types error:", eventTypesRes.status);
      return NextResponse.json(
        { error: "Failed to load event types" },
        { status: 502 }
      );
    }

    const eventTypesJson = (await eventTypesRes.json()) as {
      collection: Array<CalendlyEventTypeResource | { resource: CalendlyEventTypeResource }>;
      pagination?: { next: string | null };
    };

    const rawCollection = eventTypesJson.collection ?? [];
    const eventTypes: CalendlyEventTypePublic[] = rawCollection
      .map((item) => ("resource" in item ? item.resource : item) as CalendlyEventTypeResource)
      .filter((et) => et.active !== false)
      .map((et) => ({
        uri: et.uri,
        slug: et.slug,
        name: et.name,
        schedulingUrl: et.scheduling_url,
        duration: et.duration ?? 0,
      }));

    const payload: CalendlyConfigPublic = {
      schedulingUrl: schedulingUrl || `https://calendly.com/${userJson.resource?.slug ?? "thedogfather"}`,
      eventTypes,
    };

    return NextResponse.json(payload);
  } catch (err) {
    console.error("[Calendly API] unexpected error:", err);
    return NextResponse.json(
      { error: "Calendly request failed" },
      { status: 500 }
    );
  }
}
