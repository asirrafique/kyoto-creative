import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';

const local = process.env.REPLICA_URL || 'http://127.0.0.1:3100';
const executablePath = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true, args: ['--enable-unsafe-swiftshader'] });
const results = { checks: [], errors: [], failedResources: [], comparisons: [] };
const check = (name, pass, detail) => results.checks.push({ name, pass, detail });

async function settle(page) {
  await page.waitForLoadState('load');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2200);
  await page.getByText('Reject', { exact: true }).click({ timeout: 800 }).catch(() => {});
}

async function metrics(page) {
  return page.evaluate(() => {
    const elements = [...document.querySelectorAll('header, h1, section, h2')];
    return {
      viewport: innerWidth,
      width: document.documentElement.scrollWidth,
      height: document.body.scrollHeight,
      elements: elements.map(el => {
        const box = el.getBoundingClientRect(), style = getComputedStyle(el);
        let x = 0, y = 0, parent = el;
        while (parent) { x += parent.offsetLeft || 0; y += parent.offsetTop || 0; parent = parent.offsetParent; }
        return { tag: el.tagName, class: el.className, x, y, w: el.offsetWidth, h: el.offsetHeight, font: style.fontFamily, size: style.fontSize, lineHeight: style.lineHeight, spacing: style.letterSpacing };
      }),
    };
  });
}

try {
  for (const viewport of [{ width: 1902, height: 950 }, { width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport, ignoreHTTPSErrors: true });
    const page = await context.newPage();
    page.on('pageerror', e => results.errors.push({ viewport, error: e.message }));
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(local)) results.failedResources.push({ status: response.status(), url: response.url() }); });
    await page.goto(local, { waitUntil: 'domcontentloaded' });
    await settle(page);
    const actual = await metrics(page);
    await page.screenshot({ path: 'reports/replica-' + viewport.width + '.png' });
    check('No horizontal overflow at ' + viewport.width, actual.width <= viewport.width, actual.width);
    const reference = await context.newPage();
    await reference.goto('https://kota.co.uk/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await settle(reference);
    const expected = await metrics(reference);
    await reference.screenshot({ path: 'reports/reference-' + viewport.width + '.png' });
    const differences = actual.elements.flatMap((el, i) => {
      const original = expected.elements[i];
      if (!original || original.class !== el.class) return [{ class: el.class, problem: 'Element order differs' }];
      return ['x', 'y', 'w', 'h', 'font', 'size', 'lineHeight', 'spacing'].flatMap(key => {
        const same = typeof el[key] === 'number' ? Math.abs(el[key] - original[key]) < 1 : el[key] === original[key];
        return same ? [] : [{ class: el.class, key, original: original[key], replica: el[key] }];
      });
    });
    results.comparisons.push({ viewport, actual, expected, differences });
    check('Typography and section geometry match at ' + viewport.width, differences.length === 0, differences);
    await reference.close();

    // Advance incrementally so pinned sections, lazy media, and ScrollTrigger
    // enter/leave callbacks execute just as they do during normal scrolling.
    const total = actual.height;
    for (let y = 0; y < total; y += viewport.height * 0.65) {
      await page.evaluate(y => window.scrollTo(0, y), y);
      await page.waitForTimeout(160);
    }
    await page.waitForTimeout(1500);
    const broken = await page.locator('img').evaluateAll(images => images.filter(img => img.currentSrc && !img.complete || img.currentSrc && img.complete && !img.naturalWidth).map(img => img.currentSrc));
    check('All revealed images load at ' + viewport.width, broken.length === 0, broken);
    await page.screenshot({ path: 'reports/replica-footer-' + viewport.width + '.png' });
    if (viewport.width === 1902) {
      for (const y of [1200, 2500, 3900, 5800, 7600, 9500, 11900, 13700, 15100]) {
        await page.evaluate(y => window.scrollTo(0, y), y);
        await page.waitForTimeout(800);
        await page.screenshot({ path: 'reports/scroll-' + y + '.png' });
      }
      const faq = page.locator('[class*="FaqsList_faqsList"]').getByText('How much does web design and development typically cost?', { exact: true });
      await faq.click();
      await page.waitForTimeout(500);
      const faqAnswer = page.getByText('The majority of our projects sit between', { exact: false });
      check('FAQ accordion opens', await faqAnswer.isVisible());
      await page.evaluate(() => { window.__replicaNavigationMarker = true; document.querySelector('a[href="/work"]').click(); });
      await page.waitForURL('**/work', { timeout: 20000 });
      await page.waitForTimeout(2000);
      check('Animated navigation retains the React document', await page.evaluate(() => window.__replicaNavigationMarker === true));
      check('Work route renders project content', await page.locator('body').innerText().then(t => /work|projects/i.test(t)));
      await page.screenshot({ path: 'reports/replica-work.png' });
      await page.goBack();
      await page.waitForTimeout(2000);
      check('Browser back returns home', new URL(page.url()).pathname === '/');
    }
    await context.close();
  }
} catch (error) {
  results.errors.push({ error: error.stack });
} finally {
  await fs.writeFile('reports/verification.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ checks: results.checks, errors: results.errors, failedResources: results.failedResources }, null, 2));
  await browser.close();
}
assert.equal(results.errors.length, 0, 'Browser errors occurred; see reports/verification.json');
assert.equal(results.failedResources.length, 0, 'Some resources did not load');
assert.ok(results.checks.every(x => x.pass), 'Some checks failed; see reports/verification.json');
