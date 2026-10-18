import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw Error("Local app required.");
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "no-preference",
      isMobile: width < 768,
      hasTouch: width < 768,
    });
    const page = await context.newPage(),
      errors = [],
      external = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (/botpress|api\.openai/.test(r.url())) external.push(r.url());
    });
    await page.goto(base);
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    assert.equal(
      await page.getByLabel("Animation preference").inputValue(),
      "full",
    );
    assert.equal(
      await page.getByLabel("Animation preference").locator("option").count(),
      2,
    );
    for (const path of [
      "/websites",
      "/ai-bots",
      "/about",
      "/skills",
      "/testimonials",
    ]) {
      await page.goto(base + path);
      for (const theme of ["dark", "light"]) {
        await page.evaluate(
          (t) => (document.documentElement.dataset.theme = t),
          theme,
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `${width}/${theme}/${path}`,
        );
      }
    }
    await page.goto(base + "/skills");
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(
      await page
        .locator(".tool-marquee > div")
        .evaluate((el) => getComputedStyle(el).animationName),
      "toolkit-travel",
    );
    await page.getByLabel("Animation preference").selectOption("reduced");
    await page.waitForFunction(
      () => !document.documentElement.dataset.motionReveals,
    );
    assert.equal(
      await page
        .locator(".tool-marquee > div")
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
    await page.reload();
    await page.waitForFunction(
      () =>
        document.querySelector('[aria-label="Animation preference"]').value ===
        "reduced",
    );
    if (width < 1200) {
      const button = page.locator(".menu-toggle");
      await button.click();
      assert.equal(await button.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await button.getAttribute("aria-expanded"), "false");
    }
    if (width === 390) {
      assert.equal(
        await page.evaluate(() =>
          document.documentElement.classList.contains("lenis"),
        ),
        false,
      );
      assert.equal(
        await page
          .locator(".project-view-cursor")
          .evaluate((el) => getComputedStyle(el).display),
        "none",
      );
      await page.goto(base + "/contact");
      await page.locator('#contact button[type="submit"]').click();
      assert.equal(
        await page.locator('#contact [aria-invalid="true"]').count(),
        3,
      );
      assert.equal(
        await page.locator("#contact-website").getAttribute("tabindex"),
        "-1",
      );
    }
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await context.close();
    console.log(
      `PASS ${width}px: separate page layouts in both themes, On default, saved Off, OS preference, responsive menus and consent intact.`,
    );
  }
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(base);
  assert.match(
    await page.locator("h1").getAttribute("aria-label"),
    /Thoughtful websites/,
  );
  await page.goto(base + "/websites");
  assert.equal(await page.locator(".project-card").count(), 4);
  await page.goto(base + "/contact");
  assert.ok(await page.locator("#contact").innerText());
  await page.close();
  console.log(
    "PASS touch form validation and server-rendered pages without JavaScript.",
  );
} finally {
  await browser.close();
}
