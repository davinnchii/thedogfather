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

interface GoogleReviewNew {
  name?: string;
  text?: GoogleText | null;
  rating?: number;
  authorAttribution?: { displayName?: string; photoUri?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
}

interface GoogleReviewLegacy {
  author_name?: string;
  profile_photo_url?: string;
  rating?: number;
  relative_time_description?: string;
  text?: string;
  time?: number;
}

interface GooglePlaceDetailsNewResponse {
  reviews?: GoogleReviewNew[];
}

interface GooglePlaceDetailsLegacyResponse {
  status?: string;
  error_message?: string;
  result?: {
    reviews?: GoogleReviewLegacy[];
  };
}

type ReviewsCachePayload = {
  testimonials: ApiTestimonial[];
  fetchedAt: string;
};

const DEFAULT_CACHE_SECONDS = 60 * 60 * 6; // 6 hours – fresher “latest reviews”

// In-memory fallback (useful for local/dev, and as a safety net if Next cache isn't warm).
let memoryCache:
  | { fetchedAtMs: number; payload: ReviewsCachePayload }
  | null = null;

function normalizePlaceId(placeId: string): string {
  return placeId.replace(/^places\//, "");
}

function mapLegacyReviews(reviews: GoogleReviewLegacy[]): ApiTestimonial[] {
  return reviews
    .filter((r) => (r.text?.trim() ?? "").length > 0 && r.rating != null)
    .sort((a, b) => (b.time ?? 0) - (a.time ?? 0))
    .map((r, index) => ({
      id: `google-${r.time ?? index}-${index}`,
      name: r.author_name ?? "Anonym",
      role: r.relative_time_description
        ? `Google · ${r.relative_time_description}`
        : "Google",
      content: r.text!.trim(),
      rating: Math.round(Number(r.rating)),
      image: r.profile_photo_url,
    }));
}

function mapNewReviews(reviews: GoogleReviewNew[]): ApiTestimonial[] {
  return reviews
    .filter((r) => (r.text?.text?.trim() ?? "").length > 0 && r.rating != null)
    .sort((a, b) => {
      const aTime = a.publishTime ? Date.parse(a.publishTime) : 0;
      const bTime = b.publishTime ? Date.parse(b.publishTime) : 0;
      return bTime - aTime;
    })
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
}

/** Prefer legacy Place Details with reviews_sort=newest (up to 5 latest). */
async function fetchLegacyNewestReviews(
  placeId: string,
  apiKey: string
): Promise<ApiTestimonial[]> {
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/details/json"
  );
  url.searchParams.set("place_id", normalizePlaceId(placeId));
  url.searchParams.set("fields", "reviews");
  url.searchParams.set("language", "no");
  url.searchParams.set("reviews_sort", "newest");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`[Reviews API] Legacy Places error: ${res.status}`);
  }

  const data = (await res.json()) as GooglePlaceDetailsLegacyResponse;
  if (data.status && data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(
      `[Reviews API] Legacy Places status: ${data.status}${
        data.error_message ? ` – ${data.error_message}` : ""
      }`
    );
  }

  return mapLegacyReviews(data.result?.reviews ?? []);
}

/** Fallback: Places API (New) – relevance-sorted, then sorted by publishTime. */
async function fetchNewApiReviews(
  placeId: string,
  apiKey: string
): Promise<ApiTestimonial[]> {
  const resourceName = placeId.startsWith("places/")
    ? placeId
    : `places/${placeId}`;
  const url = new URL(`https://places.googleapis.com/v1/${resourceName}`);
  url.searchParams.set("languageCode", "no");

  const res = await fetch(url.toString(), {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "reviews",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`[Reviews API] Google Places (New) error: ${res.status}`);
  }

  const data = (await res.json()) as GooglePlaceDetailsNewResponse;
  return mapNewReviews(data.reviews ?? []);
}

async function fetchGoogleReviews(): Promise<ReviewsCachePayload> {
  const placeId = process.env.GOOGLE_PLACE_ID;
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!placeId || !apiKey) {
    return { testimonials: [], fetchedAt: new Date().toISOString() };
  }

  let testimonials: ApiTestimonial[] = [];

  try {
    testimonials = await fetchLegacyNewestReviews(placeId, apiKey);
  } catch (legacyError) {
    console.warn("[Reviews API] newest sort failed, falling back", legacyError);
    testimonials = await fetchNewApiReviews(placeId, apiKey);
  }

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
    // Cache key includes "newest" so older relevance-sorted caches are not reused.
    const getCached = unstable_cache(
      fetchGoogleReviews,
      ["google-places-reviews-newest-v1"],
      {
        revalidate: cacheSeconds,
        tags: ["google-reviews"],
      }
    );

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
