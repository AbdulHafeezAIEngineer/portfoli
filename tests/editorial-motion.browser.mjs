import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base))
  throw new Error("Local test URL required.");
const browser = await chromium.launch({
  executablePath:
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const errors = [];
try {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "no-preference",
    });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    const thirdParty = [];
    page.on("request", (request) => {
      if (/botpress|api\.openai|cdn\.botpress/.test(request.url()))
        thirdParty.push(request.url());
    });
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    await page.getByLabel("Animation preference").selectOption("full");
    await page.waitForFunction(
      () => document.documentElement.dataset.motionReveals === "enabled",
    );
    await page.locator("#work .work-filters").scrollIntoViewIfNeeded();
    await page.locator("#work .work-filters").waitFor();
    await page.waitForFunction(() =>
      document
        .querySelector("#work .motion-reveal")
        ?.classList.contains("is-revealed"),
    );
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => (document.documentElement.dataset.theme = value),
        theme,
      );
      for (const category of [
        "Website concepts",
        "AI chatbots & demos",
        "All",
      ]) {
        await page
          .getByRole("tab", {
            name: new RegExp(category.replaceAll("/", "\\/")),
          })
          .click();
        const selected = page.getByRole("tab", { selected: true });
        assert.match(
          await selected.innerText(),
          new RegExp(category.replaceAll("/", "\\/")),
        );
        const panel = page.getByRole("tabpanel");
        if (category === "Website concepts")
          assert.equal(await panel.locator(".project-card").count(), 4);
        if (category === "AI chatbots & demos")
          assert.equal(await panel.locator(".bot-card").count(), 4);
        assert.equal(await page.locator(".interface-study-card").count(), 0);
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          `No overflow: ${width}/${theme}/${category}`,
        );
      }
    }
    // Fresh visitors get On, including when the OS asks for reduced motion.
    assert.equal(
      await page.getByLabel("Animation preference").inputValue(),
      "full",
    );
    assert.equal(
      await page.getByLabel("Animation preference").locator("option").count(),
      2,
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForFunction(
      () => document.documentElement.dataset.motionReveals === "enabled",
    );
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
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForFunction(
      () =>
        document.querySelector('[aria-label="Animation preference"]')?.value ===
        "reduced",
    );
    assert.equal(
      thirdParty.length,
      0,
      "No optional bot traffic before consent or demo interaction.",
    );
    if (width < 1024) {
      const button = page.locator(".menu-toggle");
      await button.click();
      assert.equal(await button.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("Escape");
      assert.equal(await button.getAttribute("aria-expanded"), "false");
    }
    console.log(
      `PASS ${width}px: both themes, categories, default On, manual Off persistence, no overflow or unsolicited AI traffic.`,
    );
    await context.close();
  }
  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const tp = await touch.newPage();
  await tp.goto(base, { waitUntil: "domcontentloaded" });
  await tp.getByRole("button", { name: "Reject All", exact: true }).click();
  await tp.getByLabel("Animation preference").selectOption("full");
  assert.equal(
    await tp.evaluate(() =>
      document.documentElement.classList.contains("lenis"),
    ),
    false,
  );
  assert.equal(
    await tp
      .locator(".project-view-cursor")
      .evaluate((el) => getComputedStyle(el).display),
    "none",
  );
  await tp.getByRole("tab", { name: /AI chatbots & demos/ }).click();
  await tp.locator("#ai-bots .bot-card").first().waitFor();
  assert.equal(await tp.locator("#ai-bots .bot-card").count(), 4);
  await tp.locator("#contact button[type=submit]").click();
  assert.equal(await tp.locator("#contact [aria-invalid=true]").count(), 3);
  assert.equal(
    await tp.locator("#contact-website").getAttribute("tabindex"),
    "-1",
  );
  await touch.close();
  console.log(
    "PASS touch-native scroll, no custom cursor, four pre-rendered AI demos and retained form validation/honeypot.",
  );
  const nojs = await browser.newContext({ javaScriptEnabled: false });
  const page = await nojs.newPage();
  await page.goto(base, { waitUntil: "domcontentloaded" });
  assert.match(
    await page.locator("h1").getAttribute("aria-label"),
    /Thoughtful websites/,
  );
  assert.equal(await page.locator(".project-card").count(), 4);
  assert.ok(await page.locator("#contact").innerText());
  await nojs.close();
  assert.deepEqual(errors, [], "No browser runtime or hydration errors.");
  console.log("PASS no-JavaScript content and zero runtime/hydration errors.");
} finally {
  await browser.close();
}
