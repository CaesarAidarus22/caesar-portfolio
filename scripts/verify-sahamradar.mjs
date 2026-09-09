import { mkdir } from "fs/promises";
import { chromium } from "playwright-core";

const baseUrl = "http://127.0.0.1:3000";
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const viewports = [
  [1920, 1080], [1440, 900], [1366, 768], [1024, 768],
  [768, 1024], [430, 932], [390, 844],
];
const expectedTitles = [
  "SahamRadar", "Smart Insect Identifier & AI Insights", "CampusFind", "GabutBot",
  "NuboFind", "NLP Speech Code-Switching Pipeline", "YOLO Queue Detection System",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({
  executablePath: chromePath,
  args: ["--headless=new", "--no-sandbox", "--disable-dev-shm-usage", "--no-proxy-server"],
});
const page = await browser.newPage();
page.setDefaultTimeout(15000);
await mkdir(".impeccable/review", { recursive: true });

for (const [width, height] of viewports) {
  await page.setViewportSize({ width, height });
  await page.goto(`${baseUrl}/#projects`, { waitUntil: "domcontentloaded" });
  await page.locator(".project-showcase").first().waitFor({ state: "visible" });
  const cards = page.locator(".project-showcase");
  assert(await cards.count() === 7, `${width}x${height}: expected seven project showcases`);
  const titles = await cards.locator("h3").allTextContents();
  assert(JSON.stringify(titles) === JSON.stringify(expectedTitles), `${width}x${height}: project order is incorrect`);
  const numbers = await cards.locator("h3").evaluateAll((headings) => headings.map((heading) => heading.previousElementSibling?.textContent?.trim()));
  assert(JSON.stringify(numbers) === JSON.stringify(["01", "02", "03", "04", "05", "06", "07"]), `${width}x${height}: project numbering is incorrect`);
  const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth }));
  assert(metrics.scrollWidth <= metrics.viewport + 1, `${width}x${height}: homepage has horizontal overflow`);
  const image = cards.first().locator("img");
  assert(await image.evaluate((node) => node.complete && node.naturalWidth > 0 && Math.abs(node.naturalWidth / node.naturalHeight - 1.5) < 0.01), `${width}x${height}: SahamRadar image failed to load at the correct aspect ratio`);
}

for (const [width, height, name] of [[1440, 900, "desktop"], [390, 844, "mobile"]]) {
  await page.setViewportSize({ width, height });
  await page.goto(`${baseUrl}/projects/sahamradar`, { waitUntil: "domcontentloaded" });
  await page.locator(".case-page").waitFor({ state: "visible" });
  await page.waitForFunction(() => Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0));
  assert(await page.locator("h1", { hasText: "SahamRadar" }).count() === 1, `${name}: SahamRadar route did not render`);
  assert(await page.locator(".case-project-nav a").count() === 1, `${name}: SahamRadar should only have a next link`);
  assert((await page.locator(".case-project-nav").innerText()).includes("Smart Insect Identifier"), `${name}: next project is incorrect`);
  assert(!(await page.locator("body").innerText()).includes("Live Demo"), `${name}: forbidden Live Demo CTA is present`);
  assert(await page.locator('a:has-text("View repository")').count() === 0, `${name}: unverified GitHub CTA is present`);
  const metrics = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, viewport: innerWidth }));
  assert(metrics.scrollWidth <= metrics.viewport + 1, `${name}: case study has horizontal overflow`);
  await page.screenshot({ path: `.impeccable/review/${name}.png`, fullPage: true });
}

await browser.close();
console.log("PASS SahamRadar order, numbering, images, navigation, CTA, and responsive overflow checks");
