import { spawn } from "child_process";
import { chromium } from "playwright-core";

const root = process.cwd();
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const port = process.env.PORT || "3011";
const url = `http://127.0.0.1:${port}`;

const viewports = [
  { name: "1920x1080", width: 1920, height: 1080 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "430x932", width: 430, height: 932 },
  { name: "390x844", width: 390, height: 844 },
];

const projectSlugs = [
  "smart-insect-identifier", "campusfind", "gabutbot", "nubofind",
  "nlp-speech-pipeline", "yolo-queue-detection",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("Timed out waiting for the local Next.js server.");
}

function createServer() {
  return spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "dev", "--hostname", "0.0.0.0", "--port", port],
    { cwd: root, stdio: "ignore", windowsHide: true },
  );
}

async function inspectRoute(page, route, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  await page.goto(`${url}${route}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").waitFor({ state: "visible" });
  await page.waitForTimeout(250);

  const images = page.locator("img");
  for (let index = 0; index < await images.count(); index += 1) {
    await images.nth(index).scrollIntoViewIfNeeded({ timeout: 8000 });
  }

  const report = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    viewportWidth: window.innerWidth,
    launcher: (() => {
      const mascot = document.querySelector(".ai-companion");
      const cta = document.querySelector(".ai-companion-cta");
      if (!mascot || !cta) return null;
      const mascotRect = mascot.getBoundingClientRect();
      const ctaRect = cta.getBoundingClientRect();
      return {
        separated:
          mascotRect.bottom <= ctaRect.top || ctaRect.bottom <= mascotRect.top ||
          mascotRect.right <= ctaRect.left || ctaRect.right <= mascotRect.left,
        insideViewport:
          mascotRect.top >= 0 && ctaRect.bottom <= window.innerHeight &&
          mascotRect.left >= 0 && ctaRect.right <= window.innerWidth,
      };
    })(),
    images: Array.from(document.images).map((image) => ({
      alt: image.alt,
      loaded: image.complete && image.naturalWidth > 0,
      optimized: image.src.startsWith(location.origin)
        ? image.currentSrc.includes("/_next/image") || !image.src.match(/\.(png|jpe?g|webp)$/i)
        : true,
    })),
  }));

  assert(report.bodyWidth <= report.viewportWidth + 1, `${viewport.name} ${route} has horizontal overflow (${report.bodyWidth} > ${report.viewportWidth})`);
  if (route === "/") {
    assert(report.launcher?.separated, `${viewport.name} mascot overlaps the Ask Caesar CTA`);
    assert(report.launcher?.insideViewport, `${viewport.name} mascot launcher leaves the viewport`);
  }
  for (const image of report.images) {
    assert(image.loaded, `${viewport.name} ${route} failed to load image: ${image.alt}`);
    assert(image.optimized, `${viewport.name} ${route} bypasses Next Image: ${image.alt}`);
  }
  console.log(`OK ${viewport.name} ${route} images=${report.images.length}`);
}

async function verifyInteractions(page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: "networkidle" });

  assert(await page.locator("html").getAttribute("lang") === "id", "Document language is not Indonesian-first");
  assert(await page.locator("#experience").count() === 1, "Journey anchor is missing");
  assert(await page.locator("#contact").count() === 1, "Contact anchor is missing");
  assert(await page.locator('a[href^="/projects/"]').count() >= 9, "Project links are missing");
  assert(await page.locator('a[href="/cv.pdf"]').count() === 0, "Dead CV link is still present");
  assert(!(await page.locator("body").innerText()).includes("Live Demo"), "Live Demo returned");
  assert(await page.locator(".ask-caesar-trigger").count() === 0, "Home renders a duplicate standalone Ask Caesar trigger");

  const homeCard = page.locator(".home-profile-card");
  assert(await homeCard.count() === 1, "Home profile flip card is missing");
  const faceGeometry = await page.locator(".home-profile-card__face").evaluateAll((faces) =>
    faces.map((face) => {
      const rect = face.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }),
  );
  assert(
    Math.abs(faceGeometry[0].width - faceGeometry[1].width) < 1 &&
      Math.abs(faceGeometry[0].height - faceGeometry[1].height) < 1,
    "Home card front and back dimensions differ",
  );
  await homeCard.click();
  assert(await homeCard.getAttribute("aria-pressed") === "true", "Pointer did not flip the Home card");
  assert((await page.locator(".home-profile-card__back").textContent()).includes("Building with purpose"), "Professional identity back panel is missing");
  await homeCard.focus();
  await page.keyboard.press("Enter");
  assert(await homeCard.getAttribute("aria-pressed") === "false", "Keyboard did not toggle the Home card");

  await page.locator(".ai-companion").click();
  await page.locator(".ask-caesar-panel").waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const launcher = document.querySelector(".ai-companion-shell");
    return launcher && getComputedStyle(launcher).visibility === "hidden";
  });
  assert(await page.locator(".ai-companion-shell").evaluate((element) => getComputedStyle(element).visibility === "hidden"), "Launcher remains visible over open chat");
  await page.getByRole("button", { name: "Close Ask Caesar" }).click();
  await page.locator(".ask-caesar-panel").waitFor({ state: "detached" });

  const commandTrigger = page.locator(".site-navbar__command");
  await commandTrigger.focus();
  await page.keyboard.press("Control+k");
  await page.locator(".command-dialog").waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await page.waitForFunction(() => document.activeElement?.classList.contains("site-navbar__command"));
  assert(await commandTrigger.evaluate((element) => element === document.activeElement), "Command palette did not restore focus");

  await page.keyboard.press("Control+k");
  await page.locator("#command-input").fill("github");
  const githubResults = await page.locator(".command-group button:not(.is-disabled)").allTextContents();
  assert(githubResults.some((value) => value.includes("GitHub Activity")), "GitHub Activity search result missing");
  assert(githubResults.some((value) => value.includes("GitHub Profile")), "GitHub Profile search result missing");
  await page.keyboard.press("Escape");

  await page.keyboard.press("Control+k");
  await page.locator("#command-input").fill("insect");
  await page.keyboard.press("Enter");
  await page.waitForURL("**/projects/smart-insect-identifier");
  assert(await page.getByRole("heading", { name: "Smart Insect Identifier & AI Insights" }).count() === 1, "Palette project navigation failed");

  await page.goto(url, { waitUntil: "networkidle" });
  await page.locator(".ai-companion-cta").click();
  const chatInput = page.locator("#ask-caesar-input");
  const languageButtons = page.locator(".ask-language-toggle button");
  assert(await languageButtons.count() === 3, "AUTO / ID / EN controls are missing");
  assert((await page.locator(".ask-suggestions").innerText()).includes("Siapa Caesar?"), "AUTO suggestions are missing Indonesian prompts");
  await languageButtons.filter({ hasText: "ID" }).click();
  assert((await page.locator(".ask-suggestions").innerText()).includes("Caesar itu siapa?"), "ID suggestions did not update");
  await languageButtons.filter({ hasText: "EN" }).click();
  assert((await page.locator(".ask-suggestions").innerText()).includes("Who is Caesar?"), "EN suggestions did not update");
  await languageButtons.filter({ hasText: "AUTO" }).click();

  const ask = async (question, expected, language) => {
    const assistants = page.locator(".ask-message--assistant");
    const previousCount = await assistants.count();
    await chatInput.fill(question);
    await chatInput.press("Enter");
    await page.waitForFunction(
      (count) => document.querySelectorAll(".ask-message--assistant").length > count,
      previousCount,
    );
    const response = assistants.last();
    const responseText = await response.innerText();
    assert(responseText.includes(expected), `Chat response failed for "${question}": ${responseText}`);
    assert(await response.getAttribute("lang") === language, `Language detection failed for "${question}"`);
    return response;
  };

  await ask("Siapa Caesar?", "mahasiswa Informatika", "id");
  await ask("Who is Caesar?", "studies Informatics", "en");
  await ask("Project Caesar apa saja?", "Caesar membangun project", "id");
  await ask("What has Caesar built?", "Caesar builds across", "en");
  await ask("Skill utama Caesar apa?", "Area utamanya", "id");
  await ask("What are his main skills?", "His main areas", "en");
  await ask("Tech stack Caesar?", "Tech stack yang sering digunakan", "id");
  await ask("What tech stack does he use?", "His stack includes", "en");
  await ask("Caesar kuliah di mana?", "Universitas Syiah Kuala", "id");
  await ask("Where does Caesar study?", "Syiah Kuala University", "en");
  await ask("Caesar bisa Python?", "menggunakan Python", "id");
  await ask("Does Caesar use Python?", "uses Python", "en");
  await ask("Project AI Caesar apa aja?", "Project AI Caesar", "id");
  const followUp = await ask("Yang pertama pakai teknologi apa?", "EfficientNetB0", "id");
  assert(await followUp.locator('a[href="/projects/smart-insect-identifier"]').count() === 1, "Contextual case-study action is incorrect");
  const typoResponse = await ask("Gitub Caesar?", "Profil GitHub Caesar", "id");
  assert(await typoResponse.locator(`a[href="https://github.com/CaesarAidarus22"]`).count() === 1, "GitHub action URL is incorrect");
  await ask("Makanan favorit Caesar apa?", "belum punya informasi", "id");
  await ask("Can you write my homework?", "specifically here", "en");

  await languageButtons.filter({ hasText: "ID" }).click();
  await ask("Who is Caesar?", "adalah mahasiswa", "id");
  await languageButtons.filter({ hasText: "EN" }).click();
  await ask("Siapa Caesar?", "studies Informatics", "en");
  await page.getByRole("button", { name: "Close Ask Caesar" }).click();
  await page.locator(".ask-caesar-panel").waitFor({ state: "detached" });

  await page.keyboard.press("Control+k");
  await page.locator("#command-input").fill("Ask Caesar");
  await page.keyboard.press("Enter");
  await page.locator(".command-dialog").waitFor({ state: "detached" });
  await page.locator(".ask-caesar-panel").waitFor({ state: "visible" });
  assert(await page.locator(".command-dialog").count() === 0, "Chat and command palette overlap");
  await page.getByRole("button", { name: "Close Ask Caesar" }).click();

  await page.locator('nav a[href="/about"]').click();
  await page.waitForURL("**/about");
  await page.locator(".about-page").waitFor({ state: "visible" });
  await page.waitForTimeout(380);
  assert(!(await page.locator(".page-transition").getAttribute("class")).includes("--cover"), "Transition overlay remained active");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.locator('a[href="/"]').last().click();
  await page.waitForURL((target) => target.pathname === "/");
  assert(!(await page.locator(".page-transition").getAttribute("class")).includes("--cover"), "Reduced-motion transition was not simplified");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  console.log("OK interactions keyboard chat palette transition");
}

async function verifyProjectsAndNotFound(page) {
  for (const slug of projectSlugs) {
    await page.goto(`${url}/projects/${slug}`, { waitUntil: "domcontentloaded" });
    await page.locator(".case-page").waitFor({ state: "visible" });
    assert(await page.locator(".case-project-nav a").count() === 2, `${slug} previous/next navigation missing`);
    assert(await page.locator('a:has-text("Live Demo")').count() === 0, `${slug} contains Live Demo`);
  }

  const response = await page.goto(`${url}/projects/not-a-real-project`, { waitUntil: "domcontentloaded" });
  assert(response?.status() === 404, "Unknown project did not return HTTP 404");
  await page.locator(".not-found-page").waitFor({ state: "visible" });
  assert((await page.locator("body").innerText()).includes("di luar peta"), "Custom 404 did not render");
  console.log("OK six project routes and project 404");
}

async function main() {
  const server = createServer();
  try {
    await waitForServer();
    const browser = await chromium.launch({
      executablePath: chromePath,
      args: ["--disable-gpu", "--disable-dev-shm-usage", "--no-sandbox", "--no-proxy-server"],
    });
    const page = await browser.newPage();
    page.setDefaultTimeout(12000);
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    for (const viewport of viewports) {
      await inspectRoute(page, "/", viewport);
      await inspectRoute(page, "/about", viewport);
    }
    for (const viewport of [viewports[1], viewports[6]]) {
      for (const slug of projectSlugs) await inspectRoute(page, `/projects/${slug}`, viewport);
    }

    await verifyProjectsAndNotFound(page);
    await verifyInteractions(page);
    assert(pageErrors.length === 0, `Browser page errors: ${pageErrors.join(" | ")}`);
    await browser.close();
    console.log("PASS responsive, route, image, and interaction verification");
  } finally {
    server.kill();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
