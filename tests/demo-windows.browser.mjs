import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
import conceptData from "../data/concepts.ts";
const { concepts, conceptUI: ui } = conceptData;
const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw Error("Local app required");
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      isMobile: width < 768,
      hasTouch: width < 768,
    });
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(base);
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    await page.goto(base + "/websites");
    assert.equal(await page.getByRole("tab").count(), 0);
    assert.equal(
      await page
        .locator(
          ".interface-study-card, .bot-card, .project-footer, .curated-project-index",
        )
        .count(),
      0,
    );
    assert.equal(await page.locator(".project-card").count(), 4);
    await page.waitForFunction(
      () =>
        [...document.querySelectorAll('main img[loading="eager"]')].every(
          (img) => img.complete && img.naturalWidth > 0,
        ),
      null,
      { polling: 100 },
    );
    assert.equal(
      await page.locator("[data-reveal]:not(.is-revealed)").count(),
      0,
    );
    for (const [slug, concept] of Object.entries(concepts)) {
      await page
        .getByRole("link", {
          name: `Explore website: ${concept.name}`,
          exact: true,
        })
        .click();
      await page.waitForURL(`**/demo/${slug}`);
      const content = page.getByRole("region", {
        name: `${concept.name} website content`,
        exact: true,
      });
      await content.waitFor();
      assert.equal(
        await page.locator(".gallery").count(),
        0,
        "Card opens interactive website directly",
      );
      assert.equal(
        await page
          .getByRole("navigation", { name: "Explore website concepts" })
          .getByRole("link")
          .count(),
        5,
      );
      await page
        .getByRole("button", { name: "Maximize preview window", exact: true })
        .click();
      assert.ok(
        await page
          .locator(".demo-window")
          .evaluate((el) => el.getBoundingClientRect().width >= innerWidth - 1),
      );
      await page.keyboard.press("Escape");
      assert.equal(
        await page
          .getByRole("button", { name: "Maximize preview window", exact: true })
          .getAttribute("aria-pressed"),
        "false",
      );
      await page.locator("#plan").scrollIntoViewIfNeeded();
      assert.ok(
        await content.evaluate((el) => el.scrollTop > 100),
        "Website scrolls inside the preview window",
      );
      assert.equal(
        await page.evaluate(() => scrollY),
        0,
        "Desktop background stays fixed",
      );
      const future = (d) =>
        new Date(Date.now() + d * 86400000).toISOString().slice(0, 10);
      if (slug === "solenne") {
        await page.locator("#solenne-arrival").fill(future(10));
        await page.locator("#solenne-departure").fill(future(12));
      } else if (slug === "aster")
        await page.locator("#aster-date").fill(future(10));
      else if (slug === "vanta") {
        await page.locator("#vanta-choice").selectOption(concept.filters[1]);
        await page
          .locator(".vanta-finishes label")
          .filter({ hasText: ui.finishes[1] })
          .click();
      } else
        await page.locator("#kovo-choice").selectOption(concept.filters[2]);
      await page.locator('.concept-plan-form button[type="submit"]').click();
      await page.locator(".concept-summary").waitFor();
      assert.ok(await page.locator(".concept-summary strong").innerText());
      await page.getByRole("button", { name: ui.reset, exact: true }).click();
      assert.equal(await page.locator(".concept-summary").count(), 0);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.ok(
        await content.evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
      );
      if (width === 1440 && slug === "solenne") {
        await content.evaluate((el) =>
          el.scrollTo({ top: 0, behavior: "instant" }),
        );
        await page
          .locator(".concept-hero img")
          .first()
          .evaluate((img) => img.decode());
        await page.screenshot({ path: "docs/ready-demo-window.png" });
      }
      await page
        .getByRole("link", { name: "Back to website", exact: true })
        .click();
      await page.waitForURL("**/websites");
    }
    await page.goto(base + "/studies/noma");
    await page
      .getByRole("region", { name: "noma website content", exact: true })
      .waitFor();
    assert.ok(await page.locator(".study-dashboard").count());
    assert.deepEqual(errors, []);
    await page.close();
    console.log(
      `PASS ${width}px: separate website page, unboxed cards, ready imagery, four direct framed websites, nested scrolling, maximize/Escape/back, sample forms/reset and retained study route.`,
    );
  }
} finally {
  await browser.close();
}
