import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const STATIC_IMAGE_EXT = /\.(jpg|jpeg|png|gif|webp|svg|ico)(\?.*)?$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public folder images: long cache
  if (STATIC_IMAGE_EXT.test(pathname)) {
    const res = NextResponse.next();
    res.headers.set(
      "Cache-Control",
      "public, max-age=2592000, stale-while-revalidate=86400"
    );
    return res;
  }

  return NextResponse.next();
}
