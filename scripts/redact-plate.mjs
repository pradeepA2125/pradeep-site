import sharp from "sharp";

/**
 * Blurs the motorcycle registration plate out of the source photograph.
 *
 * Run once, on import of a new bike photo:  node scripts/redact-plate.mjs
 *
 * A registration number on a public page is a small but real exposure, and
 * the grading pipeline deliberately does NOT do this — redaction should be a
 * visible, reviewable step, not something buried in a resize.
 *
 * Region measured against the 1800x4000 source. If the source photo changes,
 * these coordinates must be re-measured.
 */
const SRC = "assets-src/bike-original.jpg";
const OUT = "assets-src/bike.jpg";

const PLATE = { left: 1130, top: 2030, width: 570, height: 200 };

const meta = await sharp(SRC).metadata();
if (meta.width !== 1800 || meta.height !== 4000) {
  console.error(
    `source is ${meta.width}x${meta.height}, expected 1800x4000 — ` +
      "re-measure PLATE before running",
  );
  process.exit(1);
}

const blurred = await sharp(SRC).extract(PLATE).blur(28).toBuffer();

await sharp(SRC)
  .composite([{ input: blurred, left: PLATE.left, top: PLATE.top }])
  .jpeg({ quality: 94 })
  .toFile(OUT);

console.log(`redacted plate -> ${OUT}`);
