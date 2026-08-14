import { readFileSync } from "node:fs";

/** Read hrefs straight out of content.ts — no build step, no TS import. */
const source = readFileSync("src/content.ts", "utf8");
const urls = [...new Set(source.match(/https:\/\/[^"'\s)]+/g) ?? [])];

if (urls.length === 0) {
  console.error("no external links found in src/content.ts — did the file move?");
  process.exit(1);
}

/**
 * Statuses that mean "this host is blocking a bot", not "this page is gone".
 * LinkedIn has been observed returning both 999 and 429 for the same live
 * profile URL. Failing CI on these would make the check cry wolf until it
 * gets ignored — which is worse than not having it.
 *
 * The job here is catching typos and removed pages: 404, 410, DNS failures.
 */
const BOT_BLOCKED = new Set([429, 999]);

let dead = 0;
let blocked = 0;

for (const url of urls) {
  try {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": "link-check" },
    });

    if (res.ok) {
      console.log(`ok      ${res.status} ${url}`);
    } else if (BOT_BLOCKED.has(res.status)) {
      console.log(`blocked ${res.status} ${url} (anti-bot, not a dead link)`);
      blocked++;
    } else {
      console.log(`DEAD    ${res.status} ${url}`);
      dead++;
    }
  } catch (err) {
    console.log(`DEAD    err   ${url} — ${err.message}`);
    dead++;
  }
}

const healthy = urls.length - dead;
console.log(
  `\n${healthy}/${urls.length} links healthy` +
    (blocked > 0 ? ` (${blocked} bot-blocked, not counted as failures)` : ""),
);
process.exit(dead > 0 ? 1 : 0);
