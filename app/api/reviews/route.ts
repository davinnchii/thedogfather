import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

export interface ApiTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  image?: string;
}

type GoogleText = {
  text?: string;
  languageCode?: string;
};

interface GoogleReview {
  name?: string;
  text?: GoogleText | null;
  rating?: number;
  authorAttribution?: { displayName?: string; photoUri?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
}

interface GooglePlaceDetailsResponse {
  reviews?: GoogleReview[];
}

type ReviewsCachePayload = {
  testimonials: ApiTestimonial[];
  fetchedAt: string;
};

const DEFAULT_CACHE_SECONDS = 60 * 60 * 24 * 2; // 2 days

// In-memory fallback (useful for local/dev, and as a safety net if Next cache isn't warm).
let memoryCache:
  | { fetchedAtMs: number; payload: ReviewsCachePayload }
  | null = null;

async function fetchGoogleReviews(): Promise<ReviewsCachePayload> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId || !apiKey) {
    return { testimonials: [], fetchedAt: new Date().toISOString() };
  }

  const url = new URL(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`
  );
  url.searchParams.set("languageCode", "no");

  const res = await fetch(url.toString(), {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews",
    },
    // Google API response is safe to cache server-side.
    cache: "force-cache",
  });


  if (!res.ok) {
    throw new Error(`[Reviews API] Google Places error: ${res.status}`);
  }

  const data = (await res.json()) as GooglePlaceDetailsResponse;
  const reviews = data.reviews ?? [];

  const testimonials: ApiTestimonial[] = reviews
    .filter((r) => (r.text?.text?.trim() ?? "").length > 0 && r.rating != null)
    .map((r, index) => ({
      id: `google-${index}-${r.publishTime ?? index}`,
      name: r.authorAttribution?.displayName ?? "Anonym",
      role: r.relativePublishTimeDescription
        ? `Google · ${r.relativePublishTimeDescription}`
        : "Google",
      content: r.text!.text!.trim(),
      rating: Math.round(Number(r.rating)),
      image: r.authorAttribution?.photoUri,
    }));

  return { testimonials, fetchedAt: new Date().toISOString() };
}

export async function GET() {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId || !apiKey) {
    return NextResponse.json(
      { error: "Google Places not configured", testimonials: [] },
      { status: 200 }
    );
  }

  const cacheSeconds = Math.max(
    60,
    Number(process.env.GOOGLE_REVIEWS_CACHE_SECONDS ?? DEFAULT_CACHE_SECONDS)
  );

  try {
    // 1) Fast-path: memory cache (best effort)
    if (memoryCache && Date.now() - memoryCache.fetchedAtMs < cacheSeconds * 1000) {      
      return NextResponse.json({
        ...memoryCache.payload,
        cache: { strategy: "memory", ttlSeconds: cacheSeconds },
      });
    }

    // 2) Next.js data cache (persists across requests on the same deployment/runtime)
    const getCached = unstable_cache(fetchGoogleReviews, ["google-places-reviews"], {
      revalidate: cacheSeconds,
      tags: ["google-reviews"],
    });

    const payload = await getCached();
    memoryCache = { fetchedAtMs: Date.now(), payload };

    return NextResponse.json({
      ...payload,
      cache: { strategy: "next-data-cache", revalidateSeconds: cacheSeconds },
    });
  } catch {
    console.error("[Reviews API] error");

    // If we have stale memory cached data, serve it rather than returning empty.
    if (memoryCache) {
      return NextResponse.json({
        ...memoryCache.payload,
        warning: "Served cached reviews due to upstream error",
        cache: { strategy: "stale-memory", ttlSeconds: cacheSeconds },
      });
    }

    return NextResponse.json(
      { error: "Failed to fetch reviews", testimonials: [] },
      { status: 200 }
    );
  }
}
