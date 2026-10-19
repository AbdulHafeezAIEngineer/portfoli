import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "@playwright/test";

const base = process.env.PUBLIC_TEST_URL || "http://127.0.0.1:3008";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))
  throw Error("Use a local production app");
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
const metrics = (element) => {
  const style = getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    outline: style.outlineWidth,
    outlineStyle: style.outlineStyle,
    outlineColor: style.outlineColor,
    fontSize: style.fontSize,
  };
};
try {
  for (const width of [320, 390, 768, 1440]) {
    for (const theme of ["dark", "light"]) {
      const touch = width < 1000;
      const context = await browser.newContext({
        viewport: { width, height: 900 },
        isMobile: touch,
        hasTouch: touch,
      });
      await context.addInitScript((theme) => {
        localStorage.setItem("elvora-motion", "reduced");
        localStorage.setItem("portfolio-theme", theme);
      }, theme);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      let calls = 0;
      await page.route("**/api/chat", async (route) => {
        calls++;
        const payload = route.request().postDataJSON();
        assert.equal(payload.botId, "veldt");
        assert.equal(payload.messages.at(-1).content, "Do you build websites?");
        await route.fulfill({
          json: {
            reply: "Local UI fixture: yes, custom websites and chatbots.",
          },
        });
      });
      await page.goto(base + "/ai-bots");
      await page
        .getByRole("button", { name: "Reject All", exact: true })
        .click();
      await page.evaluate(() => document.fonts.ready);
      const trigger = page.getByRole("button", {
        name: "Open chat preview: Veldt Support",
        exact: true,
      });
      await trigger.click();
      const dialog = page.locator(".chat-dialog[open]");
      await dialog.waitFor();
      const input = page.getByLabel("Your message", { exact: true });
      await input.focus();
      const field = await input.evaluate(metrics);
      assert.equal(field.outline, "2px");
      assert.equal(field.outlineStyle, "solid");
      if (width <= 700) assert.equal(field.fontSize, "16px");
      const send = await page
        .getByRole("button", { name: "Send message" })
        .evaluate(metrics);
      assert.equal(send.width, touch ? 44 : 40);
      assert.equal(send.height, touch ? 44 : 40);
      await input.fill("Do you build websites?");
      await input.press("Enter");
      await page
        .getByText("Local UI fixture: yes, custom websites and chatbots.", {
          exact: true,
        })
        .waitFor();
      assert.equal(calls, 1);
      await dialog.locator(".chat-privacy-details summary").focus();
      await page.keyboard.press("Tab");
      assert.ok(
        await page
          .getByRole("button", { name: "Clear conversation" })
          .evaluate((e) => e === document.activeElement),
        "Tab wraps within the dialog when send is disabled",
      );
      await page.keyboard.press("Escape");
      assert.ok(
        await trigger.evaluate((e) => e === document.activeElement),
        "Escape restores focus to the launching button",
      );

      await page
        .locator(".bot-extra-voice .bot-extra-open")
        .click();
      await dialog.waitFor();
      for (const name of [
        "Start voice input",
        "Read last reply",
        "Send message",
      ]) {
        const button = page.getByRole("button", { name, exact: true });
        if (await button.count()) {
          const size = await button.evaluate(metrics);
          if (touch) assert.ok(size.width >= 44 && size.height >= 44, name);
        }
      }
      assert.ok(
        await page
          .locator(".chat-panel")
          .evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
        "Chat fits without horizontal scrolling",
      );
      await page.keyboard.press("Escape");
      const cdp = await context.newCDPSession(page);
      await cdp.send("Emulation.setEmulatedMedia", {
        features: [
          { name: "prefers-reduced-transparency", value: "reduce" },
          { name: "prefers-contrast", value: "more" },
        ],
      });
      const appearance = await page.locator(".site-header").evaluate((e) => {
        const style = getComputedStyle(e);
        return {
          background: style.backgroundColor,
          blur: style.backdropFilter,
          border: style.borderBottomColor,
          solid: getComputedStyle(document.body).backgroundColor,
          muted: style.getPropertyValue("--muted").trim(),
          transparency: matchMedia("(prefers-reduced-transparency: reduce)")
            .matches,
          contrast: matchMedia("(prefers-contrast: more)").matches,
        };
      });
      assert.ok(appearance.transparency && appearance.contrast);
      assert.equal(appearance.blur, "none");
      assert.equal(appearance.background, appearance.solid);
      assert.equal(
        appearance.border,
        theme === "light" ? "rgb(107, 104, 128)" : "rgb(160, 156, 181)",
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      );
      assert.deepEqual(errors, []);
      results.push({
        width,
        theme,
        touch,
        send,
        field,
        appearance,
        mockedReply: true,
        focusRestored: true,
        pageErrors: errors,
      });
      if (width === 390 && theme === "dark") {
        await trigger.click();
        await dialog.waitFor();
        await input.focus();
        await page.screenshot({ path: "docs/apple-hig-mobile-chat.png" });
      }
      console.log(
        `PASS ${width}px ${theme}: chat, keyboard focus/return, touch sizing, contrast/transparency, no overflow`,
      );
      await context.close();
    }
  }
  fs.writeFileSync(
    "docs/apple-hig-browser-results.json",
    JSON.stringify(results, null, 2) + "\n",
  );
} finally {
  await browser.close();
}
