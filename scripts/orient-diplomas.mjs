import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const IMAGE_DIR = path.join(process.cwd(), "public/utdanning");
const IMAGE_PATTERN = /\.(jpe?g|png|webp)$/i;

async function orientImages() {
  let files = [];
  try {
    files = await readdir(IMAGE_DIR);
  } catch {
    console.error(`Mappen ${IMAGE_DIR} finnes ikke. Opprett den og legg inn diploma1.jpg og diploma2.jpg.`);
    process.exit(1);
  }

  const images = files.filter((file) => IMAGE_PATTERN.test(file));
  if (images.length === 0) {
    console.error("Ingen bilder funnet i public/utdanning/");
    process.exit(1);
  }

  for (const file of images) {
    const filePath = path.join(IMAGE_DIR, file);
    const buffer = await sharp(filePath).rotate().toBuffer();
    await sharp(buffer).toFile(filePath);
    console.log(`Orientering oppdatert: ${file}`);
  }
}

orientImages().catch((error) => {
  console.error(error);
  process.exit(1);
});
