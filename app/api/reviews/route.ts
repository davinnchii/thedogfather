import { NextResponse } from "next/server";

export interface ApiTestimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

interface GoogleReview {
  name?: string;
  text?: string | null;
  rating?: number;
  authorAttribution?: { displayName?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
}

interface GooglePlaceDetailsResponse {
  reviews?: GoogleReview[];
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

  try {
    const url = new URL(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`
    );
    url.searchParams.set("languageCode", "no");

    const res = await fetch(url.toString(), {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[Reviews API] Google Places error:", res.status, errText);
      return NextResponse.json(
        { error: "Failed to fetch reviews", testimonials: [] },
        { status: 200 }
      );
    }

    const data = (await res.json()) as GooglePlaceDetailsResponse;
    const reviews = data.reviews ?? [];

    const testimonials: ApiTestimonial[] = reviews
      .filter((r) => r.text && r.rating != null)
      .map((r, index) => ({
        id: `google-${index}-${r.publishTime ?? index}`,
        name: r.authorAttribution?.displayName ?? "Anonym",
        role: r.relativePublishTimeDescription
          ? `Google · ${r.relativePublishTimeDescription}`
          : "Google",
        content: r.text!,
        rating: Math.round(Number(r.rating)),
      }));

    return NextResponse.json({ testimonials });
  } catch (err) {
    console.error("[Reviews API] error:", err);
    return NextResponse.json(
      { error: "Failed to fetch reviews", testimonials: [] },
      { status: 200 }
    );
  }
}
