import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw Error("Local app required");
const routes = [
  ["/ai-websites", "#work", ".project-card", 4],
  ["/ai-bots", "#ai-bots", ".bot-card", 4],
  ["/bunch-of-work", "#work-bunch", ".dome-tile", 54],
  ["/about", "#experience"],
  ["/journey", "#journey"],
  ["/technical-domains", "#fundamentals", ".domain-card", 5],
  ["/skills", "#skills"],
  ["/certificates", "#certification"],
  ["/testimonials", "#testimonials", ".testimonial-card", 4],
  ["/services", "#services"],
  ["/contact", "#contact"],
];
const b = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [390, 1440]) {
    const page = await b.newPage({
      viewport: { width, height: 900 },
      isMobile: width < 768,
      hasTouch: width < 768,
    });
    const errors = [],
      external = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (req) => {
      if (/botpress|api\.openai/.test(req.url())) external.push(req.url());
    });
    await page.goto(base);
    await page.getByRole("button", { name: "Reject All", exact: true }).click();
    assert.equal(
      await page.locator("main > section").count(),
      2,
      "Home stays concise",
    );
    assert.equal(
      await page
        .locator(".project-card, .bot-card, .testimonial-card, .dome-tile")
        .count(),
      0,
    );
    assert.equal(await page.locator(".home-feature").count(), 3);
    assert.equal(
      await page
        .getByRole("navigation", { name: "More about Elvora", exact: true })
        .getByRole("link")
        .count(),
      3,
    );
    assert.ok(await page.locator(".home-purpose").isVisible());
    assert.match(
      await page.locator(".hero-intro").innerText(),
      /Elvora is my space/,
    );
    assert.ok(
      await page
        .locator(".home-purpose")
        .evaluate((el) =>
          Boolean(
            el.compareDocumentPosition(
              document.querySelector(".home-feature-grid"),
            ) & Node.DOCUMENT_POSITION_FOLLOWING,
          ),
        ),
    );
    assert.equal(
      await page.locator(".editorial-footer .footer-wordmark-window").count(),
      1,
    );
    assert.equal(
      await page.locator(".editorial-footer .footer-waves path").count(),
      3,
    );
    assert.equal(await page.locator(".compact-footer").count(), 0);
    for (const [path, id, selector, count] of routes) {
      // Navigate through an actual link so route effects and persisted preferences are exercised.
      // Exercise the actual header for principal pages and ordered About tabs for profile pages.
      const principal = [
        "/ai-websites",
        "/ai-bots",
        "/bunch-of-work",
        "/about",
        "/testimonials",
        "/contact",
      ].includes(path);
      if (principal) {
        if (width < 1200) {
          await page
            .getByRole("button", { name: "Open navigation", exact: true })
            .click();
          await page.locator(`#mobile-navigation a[href="${path}"]`).click();
        } else
          await page.locator(`.desktop-nav a[href="${path}"]`).first().click();
      } else if (path === "/services")
        await page.locator('.footer-quick-links a[href="/services"]').click();
      else {
        if (
          !(await page
            .getByRole("navigation", { name: "About Me pages" })
            .count())
        )
          await page.goto(base + "/about");
        await page.locator(`.page-tabs a[href="${path}"]`).click();
      }
      await page.waitForURL(base + path);
      assert.ok(await page.locator(id).isVisible(), path);
      assert.equal(
        await page.locator("h1").count(),
        1,
        path + " has one main heading",
      );
      if (selector)
        assert.equal(await page.locator(selector).count(), count, path);
      assert.equal(
        await page.locator("link[rel=canonical]").getAttribute("href"),
        "https://www.elvoraai.online" + path,
      );
      assert.equal(
        await page.locator("[data-reveal]:not(.is-revealed)").count(),
        0,
        "New page content is ready",
      );
      for (const theme of ["light", "dark"]) {
        await page.evaluate(
          (t) => (document.documentElement.dataset.theme = t),
          theme,
        );
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
          path + " / " + theme,
        );
      }
      assert.equal(
        await page.locator(".editorial-footer .footer-wordmark-window").count(),
        1,
      );
      assert.equal(
        await page.locator(".editorial-footer .footer-emblem").count(),
        1,
      );
      if (path === "/ai-websites") {
        assert.ok(await page.locator("#workflow").isVisible());
        assert.equal(await page.locator("#workflow .workflow-step").count(), 5);
        assert.ok(
          await page
            .locator("#work")
            .evaluate((el) =>
              Boolean(
                el.compareDocumentPosition(
                  document.querySelector("#workflow"),
                ) & Node.DOCUMENT_POSITION_FOLLOWING,
              ),
            ),
        );
        assert.equal(
          await page.locator("#workflow-title").evaluate((el) => el.tagName),
          "H2",
        );
        assert.equal(
          await page
            .locator(
              ".curated-project-index, .project-footer, .curated-format, .project-industry, .device-view",
            )
            .count(),
          0,
          "No project clutter",
        );
        for (const stage of await page.locator(".device-stage").all())
          assert.equal(
            await stage.evaluate((el) => getComputedStyle(el).backgroundImage),
            "none",
          );
      }
      if (path === "/about") {
        assert.equal(
          await page.locator(".domain-card").count(),
          0,
          "Domains have their own page",
        );
        assert.deepEqual(
          await page
            .getByRole("navigation", { name: "About Me pages" })
            .getByRole("link")
            .allTextContents(),
          [
            "About Me",
            "My Journey",
            "Technical Domains",
            "Skills & Tools",
            "Certificates",
          ],
        );
      }
      if (path === "/ai-bots") {
        assert.equal(
          await page.locator("#bot-build .workflow-step").count(),
          5,
        );
        assert.equal(
          await page.locator("#embed-methods .embed-card").count(),
          3,
        );
        assert.equal(
          await page.locator("#embed-title").evaluate((el) => el.tagName),
          "H2",
        );
        assert.ok(
          await page
            .locator("#bot-build")
            .evaluate((el) =>
              Boolean(
                el.compareDocumentPosition(
                  document.querySelector("#embed-methods"),
                ) & Node.DOCUMENT_POSITION_FOLLOWING,
              ),
            ),
        );
        await page
          .getByRole("navigation", { name: "AI Bots sections" })
          .getByRole("link", { name: "How I Embed Bots", exact: true })
          .click();
        await page.waitForURL("**/ai-bots#embed-methods");
        await page.waitForFunction(
          () =>
            document.querySelector("#embed-methods").getBoundingClientRect()
              .top < innerHeight,
        );
      }
      if (path === "/testimonials") {
        assert.equal(await page.locator('[data-sample="true"]').count(), 4);
        await page.screenshot({
          path: `docs/pages-testimonials-${width}.png`,
          fullPage: true,
        });
      }
    }
    await page.goto(base + "/about");
    if (width < 1200) {
      const menu = page.getByRole("button", {
        name: "Open navigation",
        exact: true,
      });
      await menu.click();
      const mobile = page.locator("#mobile-navigation");
      assert.equal(await mobile.getByRole("link").count(), 12);
      await page.keyboard.press("Escape");
      assert.equal(await menu.getAttribute("aria-expanded"), "false");
      assert.ok(await menu.evaluate((el) => el === document.activeElement));
      await menu.click();
      await mobile
        .getByRole("link", { name: "Skills & Tools", exact: true })
        .click();
      await page.waitForURL("**/skills");
      assert.ok(await mobile.isHidden());
    } else {
      const button = page.getByRole("button", {
        name: "Explore About Me",
        exact: true,
      });
      await button.click();
      assert.equal(await page.locator("#about-navigation a").count(), 5);
      await page.keyboard.press("Escape");
      assert.equal(await button.getAttribute("aria-expanded"), "false");
      await button.click();
      await page
        .locator("#about-navigation")
        .getByRole("link", { name: "Skills & Tools", exact: true })
        .click();
      await page.waitForURL("**/skills");
    }
    await page.getByLabel("Animation preference").selectOption("reduced");
    await page
      .locator('.footer-quick-links a[href="/ai-websites"]')
      .first()
      .click();
    await page.waitForURL("**/ai-websites");
    assert.equal(
      await page.getByLabel("Animation preference").inputValue(),
      "reduced",
    );
    assert.equal(await page.locator(".showcase-video video").count(), 0);
    await page.getByLabel("Animation preference").selectOption("full");
    if (width === 390) {
      const card = page.locator(".project-card").first();
      await card.scrollIntoViewIfNeeded();
      await page.waitForFunction(
        () =>
          document.querySelector(".project-card").dataset.deviceVisible ===
          "true",
      );
      assert.equal(
        await card
          .locator(".device-float")
          .evaluate((el) => getComputedStyle(el).animationPlayState),
        "running",
      );
      const before = await card
        .locator(".device-composition")
        .evaluate((el) => getComputedStyle(el).transform);
      await page.evaluate(() => scrollBy({ top: 140, behavior: "instant" }));
      await page.waitForTimeout(600);
      const after = await card
        .locator(".device-composition")
        .evaluate((el) => getComputedStyle(el).transform);
      assert.notEqual(after, "none", "Touch devices have a real 3D transform");
      assert.notEqual(
        before,
        after,
        "3D position responds to native mobile scrolling",
      );
      await page.getByLabel("Animation preference").selectOption("reduced");
      assert.equal(
        await card
          .locator(".device-float")
          .evaluate((el) => getComputedStyle(el).animationName),
        "none",
      );
    }
    await page.goto(base + "/#work");
    await page.waitForURL("**/ai-websites");
    await page.goto(base + "/#embed-methods");
    await page.waitForURL("**/ai-bots#embed-methods");
    await page.goto(base + "/how-i-build");
    await page.waitForURL("**/ai-websites#workflow");
    await page.goto(base + "/ai-bots/how-i-embed-bots");
    await page.waitForURL("**/ai-bots#embed-methods");
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);
    await page.close();
    console.log(
      `PASS ${width}px: 11 subject pages, real navigation, isolated content, canonical URLs, clean previews, theme layout, keyboard menus, saved Motion Off, mobile 3D and legacy links.`,
    );
  }
  const page = await b.newPage({ javaScriptEnabled: false });
  for (const [path, id] of routes) {
    const response = await page.goto(base + path);
    assert.equal(response.status(), 200);
    assert.ok(await page.locator(id).isVisible());
  }
  const xml = await (await page.request.get(base + "/sitemap.xml")).text();
  for (const [path] of routes)
    assert.ok(
      xml.includes("https://www.elvoraai.online" + path),
      path + " in sitemap",
    );
  await page.close();
  console.log(
    "PASS all subject pages render without JavaScript and appear in the sitemap.",
  );
} finally {
  await b.close();
}
