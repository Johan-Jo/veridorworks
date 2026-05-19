import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";
import toIco from "to-ico";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = readFileSync(join(root, "favicon.svg"));

const icoSizes = [16, 32, 48];
const pngBuffers = await Promise.all(
  icoSizes.map((size) => sharp(svg).resize(size, size).png().toBuffer())
);

writeFileSync(join(root, "favicon.ico"), await toIco(pngBuffers));

await sharp(svg).resize(180, 180).png().toFile(join(root, "apple-touch-icon.png"));

console.log("Wrote favicon.ico and apple-touch-icon.png");
