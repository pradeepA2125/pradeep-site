import puppeteer from "puppeteer-core";

/**
 * Dev helper: full-page screenshots + an overflow audit against the preview
 * server. Not part of CI — this is for looking at the thing while building it.
 *
 *   npm run preview        (in another shell)
 *   node scripts/shoot.mjs
 */
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const URL = process.env.SHOOT_URL ?? "http://localhost:4173/";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844, deviceScaleFactor: 2, isMobile: true },
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1, isMobile: false },
];

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--disable-gpu"],
});

for (const vp of VIEWPORTS) {
  const page = await browser.newPage();
  await page.setViewport(vp);
  await page.goto(URL, { waitUntil: "networkidle0", timeout: 60_000 });
  // Reveal-on-scroll sections need a pass down the page before capture.
  //
  // behavior:"instant" is required: the stylesheet sets scroll-behavior:smooth,
  // so plain scrollTo calls animate, and firing them in quick succession just
  // restarts the animation each time — the page never reaches the bottom and
  // everything below the first section captures blank.
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollTo({ top: y, behavior: "instant" });
        y += window.innerHeight / 2;
        if (y < document.body.scrollHeight) setTimeout(step, 60);
        else {
          window.scrollTo({ top: 0, behavior: "instant" });
          // sections fade in over 700ms; capturing sooner shows them blank
          setTimeout(resolve, 1400);
        }
      };
      step();
    });
  });

  const audit = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      // ignore intentionally scaled/absolute hero art
      if (r.right > docW + 1 || r.left < -1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className || "").toString().slice(0, 70),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
        });
      }
    }
    return {
      docW,
      scrollW: document.documentElement.scrollWidth,
      bodyScrollW: document.body.scrollWidth,
      offenders: offenders.slice(0, 10),
    };
  });

  console.log(`\n=== ${vp.name} (${vp.width}px) ===`);
  console.log(`clientWidth=${audit.docW} scrollWidth=${audit.scrollW}`);
  if (audit.offenders.length === 0) console.log("no overflowing elements");
  else
    for (const o of audit.offenders)
      console.log(`  OVERFLOW <${o.tag}> w=${o.width} [${o.left}..${o.right}] ${o.cls}`);

  await page.screenshot({ path: `/tmp/site-${vp.name}.png`, fullPage: true });
  console.log(`wrote /tmp/site-${vp.name}.png`);
  await page.close();
}

await browser.close();
