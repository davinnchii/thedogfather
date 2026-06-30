import { readdir } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const IMAGE_DIR = path.join(process.cwd(), "public/utdanning");
const IMAGE_PATTERN = /\.(jpe?g|png|webp)$/i;

async function orientImages() {
  let files = [];
  try {
    files = await readdir(IMAGE_DIR);
  } catch {
    console.error(
      `Mappen ${IMAGE_DIR} finnes ikke. Opprett den og legg inn diploma1.jpg og diploma2.jpg.`
    );
    process.exit(1);
  }

  const images = files.filter((file) => IMAGE_PATTERN.test(file));
  if (images.length === 0) {
    console.error("Ingen bilder funnet i public/utdanning/");
    process.exit(1);
  }

  for (const file of images) {
    const filePath = path.join(IMAGE_DIR, file);
    const tmpPath = `${filePath}.tmp`;

    await sharp(filePath)
      .rotate()
      .withMetadata({ orientation: 1 })
      .jpeg({ quality: 90, mozjpeg: true })
      .toFile(tmpPath);

    fs.renameSync(tmpPath, filePath);

    const final = await sharp(filePath).metadata();
    console.log(
      `Orientering oppdatert: ${file} (${final.width}x${final.height})`
    );
  }
}

orientImages().catch((error) => {
  console.error(error);
  process.exit(1);
});
