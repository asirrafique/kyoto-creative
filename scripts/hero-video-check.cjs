const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true,
    args: ['--enable-unsafe-swiftshader'],
  });
  const checks = [], errors = [];
  const record = (name, pass, detail) => checks.push({ name, pass, detail });
  try {
    const page = await browser.newPage({ viewport: { width: 1906, height: 966 } });
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:3101/', { waitUntil: 'networkidle' });
    await page.getByText('Reject', { exact: true }).click().catch(() => {});
    const preview = page.locator('div[class*="HeroVideo_video"]');
    const video = preview.locator('video');
    await page.waitForTimeout(1700);
    const initial = await video.evaluate(v => ({
      src: v.currentSrc, time: v.currentTime, paused: v.paused, muted: v.muted,
      loop: v.loop, inline: v.playsInline, fit: getComputedStyle(v).objectFit,
      radius: getComputedStyle(v).borderRadius,
    }));
    await page.waitForTimeout(500);
    record('Original preview loops silently inside the o',
      initial.src.includes('Short-Preview-homepage.mp4') && !initial.paused && initial.muted && initial.loop && initial.inline && initial.fit === 'cover' && initial.radius === '45%' && await video.evaluate(v => v.currentTime) > initial.time, initial);
    await page.screenshot({ path: 'reports/hero-video-preview.png' });
    await preview.click();
    await page.waitForFunction(() => document.querySelector('div[class*="HeroVideo_video"] video').readyState >= 3);
    await page.waitForTimeout(1500);
    const expanded = await video.evaluate(v => ({
      src: v.currentSrc, paused: v.paused, muted: v.muted, time: v.currentTime,
      width: v.getBoundingClientRect().width, height: v.getBoundingClientRect().height,
      radius: getComputedStyle(v).borderRadius,
    }));
    record('Original full showreel plays across the viewport', expanded.src.includes('00-Kota-Showreel-2025-Final.mp4') && !expanded.paused && !expanded.muted && expanded.width === 1906 && expanded.height === 966 && expanded.radius === '0px', expanded);
    await page.waitForTimeout(500);
    record('Full showreel playback advances', await video.evaluate(v => v.currentTime) > expanded.time);
    await page.screenshot({ path: 'reports/hero-video-fullscreen.png' });
    await page.locator('button[class*="HeroVideo_icon"]').click();
    await page.waitForTimeout(1400);
    record('Close control restores muted preview', await preview.getAttribute('data-fullscreen') === 'false' && await video.evaluate(v => v.muted && !v.paused && v.currentSrc.includes('Short-Preview-homepage.mp4')));
    await preview.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(1500);
    record('Keyboard opens the showreel', await preview.getAttribute('data-fullscreen') === 'true');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1400);
    record('Escape closes the showreel', await preview.getAttribute('data-fullscreen') === 'false');
    record('Closing resumes smooth page scrolling', await page.evaluate(() => !window.lenis.isStopped));
  } finally {
    await browser.close();
    fs.writeFileSync('reports/hero-video-verification.json', JSON.stringify({ checks, errors }, null, 2));
    console.log(JSON.stringify({ checks, errors }, null, 2));
  }
  assert.equal(errors.length, 0);
  assert.ok(checks.every(check => check.pass));
})().catch(error => { console.error(error); process.exitCode = 1; });
