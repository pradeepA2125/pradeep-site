import puppeteer from "puppeteer-core";
import fs from "fs";
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ["--hide-scrollbars", "--use-angle=metal"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.emulateMediaFeatures([
  { name: "prefers-reduced-motion", value: "reduce" },
]);
await page.goto("http://localhost:4173/", {
  waitUntil: "networkidle0",
  timeout: 60000,
});
await new Promise((r) => setTimeout(r, 2500));
await page.screenshot({ path: "/tmp/site-rm-1.png" });
await new Promise((r) => setTimeout(r, 1500));
await page.screenshot({ path: "/tmp/site-rm-2.png" });
const same =
  Buffer.compare(
    fs.readFileSync("/tmp/site-rm-1.png"),
    fs.readFileSync("/tmp/site-rm-2.png"),
  ) === 0;
console.log("reduced-motion frames identical:", same);
await browser.close();
