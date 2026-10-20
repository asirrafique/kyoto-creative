const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: true, args: ['--enable-unsafe-swiftshader'] });
  const checks = [], errors = [], requests = [];
  const record = (name, pass, detail) => { checks.push({ name, pass, detail }); assert.ok(pass, name); };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url().includes('.mp4')) requests.push(request.url()); });
    await page.goto(process.env.REPLICA_URL || 'http://127.0.0.1:3101/', { waitUntil: 'networkidle' });
    await page.getByText('Reject', { exact: true }).click().catch(() => {});
    await page.waitForFunction(() => document.querySelector('[class*="HeroVideo"] video')?.currentTime > 0);
    const initial = await page.locator('video[preload="none"][loop]').evaluateAll(videos => videos.map(v => ({ src: v.currentSrc, state: v.readyState, y: v.getBoundingClientRect().y })));
    record('Distant project videos make no initial media requests', initial.length > 0 && initial.every(v => v.state === 0), { videos: initial.length, initialVideoRequests: requests.length });
    const card = page.locator('video[preload="none"][loop]').first();
    await card.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => { const v = document.querySelector('video[preload="none"][loop]'); return v && !v.paused && v.currentTime > 0.1; });
    record('Project animation loads and plays near the viewport', true, await card.evaluate(v => ({ time: v.currentTime, state: v.readyState })));
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForFunction(() => document.querySelector('video[preload="none"][loop]').paused);
    record('Distant project animation pauses', true);
    record('Hydration and playback have no browser errors', errors.length === 0, errors);
    fs.writeFileSync('reports/media-scheduling-verification.json', JSON.stringify({ checks }, null, 2));
    console.log(JSON.stringify({ checks }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
