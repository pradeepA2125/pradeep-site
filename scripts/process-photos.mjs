import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT = "public/img";

/** width/height must match src/content.ts exactly. */
const JOBS = [
  { in: "assets-src/train.jpg", out: "train.webp", width: 1600, height: 2133, quality: 74 },
  // bike and stump are dense foliage — high-frequency texture webp compresses
  // poorly. Right-sized for their actual display context rather than quality-
  // crushed: bike renders in a half-width column, and stump sits behind a 78%
  // scrim where 1600px of detail is simply thrown away.
  { in: "assets-src/bike.jpg", out: "bike.webp", width: 1000, height: 1778, quality: 70 },
  { in: "assets-src/mma.jpg", out: "mma.webp", width: 1600, height: 1200, quality: 74 },
  { in: "assets-src/stump.jpg", out: "stump.webp", width: 1200, height: 1125, quality: 70 },
];

/**
 * The dusk grade: cool the shadows, warm the highlights, pull the daylight
 * greens back so they sit inside the indigo/ember palette instead of punching
 * holes in it.
 *
 * NOTE: do not reach for sharp's .tint() here. It converts to greyscale and
 * re-tints the luminance, which destroys the image's colour entirely — it is
 * not a colour cast over the original. Chosen empirically over four other
 * candidates by rendering contact sheets and comparing.
 */
const GRADE = {
  saturation: 0.58,
  contrast: [1.1, -12], // sharp .linear(multiply, offset)
  coolShadows: { r: 42, g: 33, b: 64, alpha: 0.22 }, // over
  warmHighlights: { r: 232, g: 98, b: 60, alpha: 0.18 }, // soft-light
};

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  const { width, height } = job;

  let buf = await sharp(job.in)
    .resize(width, height, { fit: "cover", position: "attention" })
    .modulate({ saturation: GRADE.saturation })
    .linear(GRADE.contrast[0], GRADE.contrast[1])
    .toBuffer();

  buf = await sharp(buf)
    .composite([
      {
        input: {
          create: { width, height, channels: 4, background: GRADE.coolShadows },
        },
        blend: "over",
      },
    ])
    .toBuffer();

  buf = await sharp(buf)
    .composite([
      {
        input: {
          create: { width, height, channels: 4, background: GRADE.warmHighlights },
        },
        blend: "soft-light",
      },
    ])
    .toBuffer();

  const info = await sharp(buf)
    .webp({ quality: job.quality, effort: 6 })
    .toFile(`${OUT}/${job.out}`);

  console.log(
    `graded ${job.out} (${width}x${height}) ${Math.round(info.size / 1024)} KB`,
  );
}
