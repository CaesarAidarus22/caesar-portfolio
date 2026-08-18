import { spawn } from "child_process";
import { mkdir } from "fs/promises";
import path from "path";
import { chromium } from "playwright-core";

const root = process.cwd();
const screenshotDir = path.join(root, "screenshots");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = process.env.PORT || "3013";
const url = `http://127.0.0.1:${port}`;

async function waitForVisibleImages(page) {
  await page.waitForFunction(() =>
    Array.from(document.images)
      .filter((image) => {
        const rect = image.getBoundingClientRect();
        return rect.bottom > -200 && rect.top < window.innerHeight + 200;
      })
      .every((image) => image.complete && image.naturalWidth > 0),
  );
}

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  throw new Error("Timed out waiting for the local Next.js server.");
}

async function main() {
  await mkdir(screenshotDir, { recursive: true });

  const server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "dev",
      "--hostname",
      "0.0.0.0",
      "--port",
      port,
    ],
    {
      cwd: root,
      stdio: "ignore",
      windowsHide: true,
    },
  );

  try {
    await waitForServer();

    const browser = await chromium.launch({
      executablePath: chromePath,
      args: [
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-dev-shm-usage",
        "--headless=new",
        "--no-sandbox",
        "--no-proxy-server",
      ],
    });
    const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load");
    await page.locator("text=Muhammad").waitFor({ state: "visible" });
    await waitForVisibleImages(page);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(screenshotDir, "hero.png") });
    await page.locator(".home-profile-card").click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(screenshotDir, "hero-flipped.png") });
    await page.locator(".home-profile-card").click();

    await page.setViewportSize({ width: 1440, height: 1500 });
    await page.evaluate(() => {
      const target = document.getElementById("projects");
      if (target) {
        window.scrollTo({ top: target.offsetTop - 110, behavior: "auto" });
      }
    });
    await waitForVisibleImages(page);
    await page.waitForTimeout(1400);
    await page.screenshot({
      path: path.join(screenshotDir, "featured-projects.png"),
    });

    await page.setViewportSize({ width: 820, height: 1180 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load");
    await page.locator("text=Muhammad").waitFor({ state: "visible" });
    await waitForVisibleImages(page);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(screenshotDir, "tablet.png") });

    await page.setViewportSize({ width: 390, height: 1100 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load");
    await page.locator("text=Muhammad").waitFor({ state: "visible" });
    await waitForVisibleImages(page);
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(screenshotDir, "mobile.png") });
    await page.locator(".home-profile-card").click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(screenshotDir, "mobile-flipped.png") });

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.locator("#experience").evaluate((element) => {
      element.scrollIntoView({ block: "start", behavior: "auto" });
    });
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollBy({ top: -180, behavior: "auto" }));
    await page.waitForTimeout(100);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(screenshotDir, "journey-desktop.png") });

    await page.keyboard.press("Control+k");
    await page.locator("#command-input").fill("github");
    await page.screenshot({ path: path.join(screenshotDir, "command-palette.png") });
    await page.keyboard.press("Escape");
    await page.locator(".command-dialog").waitFor({ state: "detached" });
    await page.locator(".ai-companion-cta").click();
    await page.locator("#ask-caesar-input").fill("Caesar bisa Python?");
    await page.locator("#ask-caesar-input").press("Enter");
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, "ask-caesar.png") });

    await page.goto(`${url}/projects/smart-insect-identifier`, { waitUntil: "networkidle" });
    await waitForVisibleImages(page);
    await page.screenshot({ path: path.join(screenshotDir, "case-study-smart-insect.png") });

    await page.goto(`${url}/projects/yolo-queue-detection`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(screenshotDir, "case-study-yolo.png") });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${url}/projects/campusfind`, { waitUntil: "networkidle" });
    await waitForVisibleImages(page);
    await page.screenshot({ path: path.join(screenshotDir, "case-study-mobile.png") });

    await page.goto(url, { waitUntil: "networkidle" });
    await page.locator(".ai-companion-cta").click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotDir, "ask-caesar-mobile.png") });

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${url}/about`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load");
    await page.locator("text=Beyond").first().waitFor({ state: "visible" });
    await waitForVisibleImages(page);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(screenshotDir, "about-desktop.png") });
    await page.locator(".flip-profile-card").click();
    await page.waitForTimeout(850);
    await page.screenshot({ path: path.join(screenshotDir, "about-flipped.png") });
    await page.locator(".about-story").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(screenshotDir, "about-bento-desktop.png") });
    await page.locator(".about-social").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(screenshotDir, "about-social-desktop.png") });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${url}/about`, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("load");
    await page.locator("text=Beyond").first().waitFor({ state: "visible" });
    await waitForVisibleImages(page);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(screenshotDir, "about-mobile.png") });
    await page.locator(".about-story").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(screenshotDir, "about-bento-mobile.png") });
    await page.locator(".about-social").scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.screenshot({ path: path.join(screenshotDir, "about-social-mobile.png") });

    await browser.close();
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
