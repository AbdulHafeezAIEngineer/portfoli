import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { chromium } from '@playwright/test';

// Starts only isolated local production processes. AI replies are explicitly mocked;
// this test does not claim provider quality, authentication or billing is verified.
const base = 'http://127.0.0.1:3012';
const bots = [
  ['veldt', 'Veldt Support', 'VELDT STORE'],
  ['northline', 'Northline Assistant', 'NORTHLINE STUDIO'],
  ['solenne', 'Solenne Concierge', 'SOLENNE RETREAT'],
];
let server;
async function start(connected) {
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3012'], {
    env: { ...process.env, NODE_ENV: 'production', CONTENT_SOURCE: 'files', OPENAI_API_KEY: '', ELVORA_CHAT_API_KEY: connected ? 'ui-fixture-not-a-real-key' : '', CHAT_ENABLED: 'true', GEMINI_API_KEY: '', CHAT_PROVIDER: 'auto', CHAT_ALLOW_IN_MEMORY_LIMITER: 'true' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let diagnostic = '';
  server.stdout.on('data', (b) => { diagnostic += b; });
  server.stderr.on('data', (b) => { diagnostic += b; });
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw Error(diagnostic);
    try { if ((await fetch(base + '/ai-bots')).ok) return; } catch {}
    await new Promise(r => setTimeout(r, 250));
  }
  throw Error('Local production app did not become ready: ' + diagnostic);
}
async function stop() {
  if (server && server.exitCode === null) {
    const done = once(server, 'exit');
    server.kill('SIGTERM');
    await done;
  }
}
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
fs.mkdirSync('docs/business-assistants', { recursive: true });
try {
  await start(false);
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await page.goto(base + '/ai-bots');
  await page.getByRole('button', { name: 'Reject All', exact: true }).click();
  for (const [id, name, title] of bots) {
    await page.getByRole('button', { name: 'Open chat preview: ' + name, exact: true }).click();
    await page.getByText("Live replies aren't connected yet.", { exact: false }).waitFor();
    const field = page.getByLabel('Your message', { exact: true });
    assert.equal(await field.isEditable(), true);
    await field.fill('Can you help me?');
    assert.equal(await page.getByRole('button', { name: 'Send message', exact: true }).isEnabled(), true);
    await page.getByRole('button', { name: 'Send message', exact: true }).click();
    await page.locator('.chat-error').waitFor();
    assert.equal(await field.inputValue(), 'Can you help me?');
    assert.equal(await field.isEditable(), true);
    const source = await page.request.get(base + '/api/bot-knowledge?botId=' + id);
    assert.equal(source.status(), 200);
    assert.ok((await source.text()).includes(title));
    const missing = await page.request.post(base + '/api/chat', { data: { botId: id, messages: [{ role: 'user', content: 'Hello' }] } });
    assert.equal(missing.status(), 503);
    await page.keyboard.press('Escape');
  }
  await page.close();
  await stop();
  console.log('PASS missing-key state: 3 assistants, editable typing, real send/retry with preserved draft, real API 503, public knowledge available.');
  await start(true);
  let scenarios = 0;
  for (const width of [360, 390, 768, 1440]) {
    for (const theme of ['dark', 'light']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 768, hasTouch: width < 768 });
      await context.addInitScript(theme => {
        localStorage.setItem('portfolio-theme', theme);
        localStorage.setItem('elvora-motion', 'reduced');
      }, theme);
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const calls = [];
      await page.route('**/api/chat', async route => {
        const body = route.request().postDataJSON();
        calls.push(body);
        await route.fulfill({ json: { reply: `Local UI test fixture for ${body.botId}.`, truncated: false } });
      });
      await page.goto(base + '/ai-bots');
      await page.getByRole('button', { name: 'Reject All', exact: true }).click();
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('.bot-feature, .bot-extra').count(), 5);
      assert.equal(await page.locator('.bot-extra-real').count(), 1);
      for (const [id, name] of bots) {
        const trigger = page.getByRole('button', { name: 'Open chat preview: ' + name, exact: true });
        await trigger.click();
        const dialog = page.locator('.chat-dialog[open]');
        await dialog.waitFor();
        assert.equal(await dialog.locator('.chat-header img[alt="Elvora"]').count(), 1);
        assert.equal(await dialog.locator('iframe').count(), 0);
        const input = page.getByLabel('Your message', { exact: true });
        await dialog.locator('.chat-starters button').first().click();
        assert.ok((await input.inputValue()).length > 0);
        await page.getByRole('button', { name: 'Send message', exact: true }).click();
        await page.getByText(`Local UI test fixture for ${id}.`, { exact: true }).waitFor();
        assert.equal(calls.at(-1).botId, id);
        assert.equal(calls.at(-1).messages.length, 1, 'Each bot has separate history');
        await input.fill('Can you explain that in simpler words?');
        await input.press('Enter');
        await page.getByRole('button', { name: 'Clear conversation', exact: true }).waitFor();
        await page.waitForFunction(() => document.querySelectorAll('.message-assistant').length === 3);
        assert.equal(calls.at(-1).messages.length, 3, 'Follow-up includes this bot’s previous turn');
        assert.ok(await dialog.getByRole('link', { name: 'View demo knowledge', exact: true }).isVisible());
        const bounds = await dialog.locator('.chat-panel').boundingBox();
        assert.ok(bounds.x >= 0 && bounds.x + bounds.width <= width + 1);
        if ([390, 1440].includes(width) && theme === 'dark')
          await page.screenshot({ path: `docs/business-assistants/${id}-${width}.png` });
        await page.getByRole('button', { name: 'Clear conversation', exact: true }).click();
        assert.equal(await dialog.locator('.message-user').count(), 0);
        await page.keyboard.press('Escape');
        assert.ok(await trigger.evaluate(e => e === document.activeElement));
        scenarios++;
      }
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
      assert.deepEqual(errors, []);
      await context.close();
    }
  }
  console.log(`PASS ${scenarios} desktop/mobile/theme scenarios: starters, separate histories, follow-ups, own avatars, source links, clear and keyboard close. Replies were mocked.`);
} finally {
  await browser.close();
  await stop();
}
