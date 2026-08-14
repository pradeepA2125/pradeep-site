import puppeteer from "puppeteer-core";

/**
 * Dev helper: GPU-enabled capture of just the hero, so the WebGL scene can
 * actually be seen (shoot.mjs disables the GPU and captures the poster).
 *
 *   npm run preview        (in another shell)
 *   node scripts/shoot-hero.mjs [seconds-into-the-loop]
 */
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.env.SHOOT_URL ?? "http://localhost:4173/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--use-angle=metal"],
});

for (const vp of [
  { name: "hero-desktop", width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: "hero-mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
]) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60_000 });
  // wait for the canvas cross-fade (scene live) or give up after 6s
  await page
    .waitForSelector("canvas.opacity-100", { timeout: 6000 })
    .catch(() => console.log(`${vp.name}: canvas never went live (poster only)`));
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: `/tmp/site-${vp.name}.png` });
  console.log(`wrote /tmp/site-${vp.name}.png`);
  await page.close();
}

await browser.close();
