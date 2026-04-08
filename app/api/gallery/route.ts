import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
const VIDEO_EXT = [".mov", ".mp4"];

export interface GalleryItemResponse {
  id: string;
  title: string;
  image?: string;
  video?: string;
}

function toTitle(filename: string): string {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ")
    .trim() || "Galleri";
}

export async function GET() {
  try {
    if (!fs.existsSync(GALLERY_DIR)) {
      return NextResponse.json({ items: [] });
    }
    const files = fs.readdirSync(GALLERY_DIR);
    const items: GalleryItemResponse[] = files
      .filter((name) => {
        const ext = path.extname(name).toLowerCase();
        return [...IMAGE_EXT, ...VIDEO_EXT].includes(ext);
      })
      .map((name, index) => {
        const ext = path.extname(name).toLowerCase();
        const isVideo = VIDEO_EXT.includes(ext);
        return {
          id: String(index + 1),
          title: toTitle(name),
          ...(isVideo
            ? { video: `/gallery/${name}` }
            : { image: `/gallery/${name}` }),
        };
      });
    return NextResponse.json({ items });
  } catch (err) {
    console.error("[Gallery API] error reading folder:", err);
    return NextResponse.json(
      { error: "Failed to load gallery", items: [] },
      { status: 500 }
    );
  }
}
