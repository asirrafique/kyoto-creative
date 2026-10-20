const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');

const origin = 'http://127.0.0.1:3101';
const checks = [], errors = [], failed = [];
const check = (name, pass, detail) => checks.push({ name, pass, detail });

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
    headless: true, args: ['--enable-unsafe-swiftshader'],
  });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    page.setDefaultTimeout(12000);
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400 && response.url().startsWith(origin)) failed.push([response.status(), response.url()]); });
    async function go(route) {
      await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1800);
      await page.evaluate(() => document.fonts.ready);
      await page.getByText('Reject', { exact: true }).click({ timeout: 500 }).catch(() => {});
    }

    await go('/');
    const faq = page.locator('[class*="FaqsList_faqsList"]').first();
    await faq.scrollIntoViewIfNeeded();
    const questions = faq.locator('label[class*="FaqsList_question"]');
    const answers = faq.locator('[class*="FaqsList_answer"]');
    const initial = await answers.first().evaluate(el => ({ height: el.offsetHeight, transition: getComputedStyle(el).transition }));
    await questions.first().click();
    await page.waitForTimeout(150);
    const early = await answers.first().evaluate(el => ({ height: el.getBoundingClientRect().height, opacity: +getComputedStyle(el).opacity }));
    await page.waitForTimeout(650);
    const opened = await answers.first().evaluate(el => ({ height: el.getBoundingClientRect().height, opacity: +getComputedStyle(el).opacity }));
    check('FAQ expands over 0.6 seconds with the original easing', initial.height === 0 && early.height > 0 && early.height < opened.height && initial.transition.includes('0.6s cubic-bezier(0.75, 0, 0.25, 1)'), { initial, early, opened });
    check('FAQ text fades after the opening delay', early.opacity === 0 && opened.opacity === 1);
    await questions.nth(1).click();
    await page.waitForTimeout(800);
    check('FAQ answers remain independently open', await questions.first().getAttribute('aria-expanded') === 'true' && await questions.nth(1).getAttribute('aria-expanded') === 'true');
    const icon = await questions.first().locator('[class*="FaqsList_icon"]').evaluate(el => getComputedStyle(el).transform);
    check('FAQ plus rotates into a cross', icon.includes('0.707107'));
    await questions.first().click();
    await page.waitForTimeout(150);
    const closing = await answers.first().evaluate(el => ({ height: el.getBoundingClientRect().height, opacity: +getComputedStyle(el).opacity }));
    await page.waitForTimeout(650);
    check('FAQ closes smoothly before the next row settles', closing.height > 0 && closing.opacity < 1 && await answers.first().evaluate(el => el.offsetHeight) === 0);
    await questions.nth(2).focus();
    await page.keyboard.press('Enter');
    check('FAQ keyboard controls expose expanded state', await questions.nth(2).getAttribute('aria-expanded') === 'true');
    await page.screenshot({ path: 'reports/faq-updated.png' });

    await go('/work');
    await page.waitForSelector('button[class*="Filters_trigger"]');
    const cards = page.locator('a[class*="ProjectCard_project"]');
    const allProjects = await cards.count();
    await page.getByRole('button', { name: 'Sectors', exact: true }).click();
    await page.getByRole('button', { name: 'Agencies', exact: true }).click();
    await page.waitForURL('**/work?sector=agencies');
    await page.waitForTimeout(1700);
    const agencyProjects = await cards.count();
    check('Work sector filter changes visible projects and URL', agencyProjects > 0 && agencyProjects < allProjects, { allProjects, agencyProjects });
    await page.getByRole('button', { name: 'Services', exact: true }).click();
    const options = await page.locator('button').allTextContents();
    const serviceName = options.find(text => /^Branding$|^Brand strategy$/.test(text));
    assert.ok(serviceName, 'Expected a project service option');
    await page.getByRole('button', { name: serviceName, exact: true }).click();
    await page.waitForTimeout(2200);
    check('Work supports combined sector and service filters', new URL(page.url()).searchParams.has('service') && new URL(page.url()).searchParams.has('sector'));
    await page.goBack();
    await page.waitForTimeout(1500);
    check('Back restores the previous filter', new URL(page.url()).searchParams.has('sector') && !new URL(page.url()).searchParams.has('service'));

    await go('/blog');
    await page.waitForSelector('button[class*="CategoryFilter_filter"]');
    await page.getByRole('button', { name: 'Culture', exact: true }).click();
    await page.waitForURL('**/blog?category=culture');
    await page.waitForTimeout(1600);
    const culturePosts = await page.locator('a[class*="PostCard_post"]').count();
    await page.getByRole('button', { name: 'Expertise', exact: true }).click();
    await page.waitForTimeout(2000);
    check('Blog categories combine and update the URL', new URL(page.url()).searchParams.get('category').split(',').length === 2);
    await page.getByRole('button', { name: 'All articles', exact: true }).click();
    await page.waitForTimeout(1500);
    const allPosts = await page.locator('a[class*="PostCard_post"]').count();
    check('All articles resets filtering and restores more posts', !new URL(page.url()).search && allPosts > culturePosts, { culturePosts, allPosts });

    await go('/');
    await page.locator('button[class*="PrimaryNavigation_icon"]').click();
    await page.locator('nav').getByRole('link', { name: 'Agency', exact: true }).click();
    await page.waitForURL('**/agency');
    await page.waitForTimeout(1800);
    check('Main menu navigates to a hydrated Agency page', await page.locator('h1,h2').count() > 0 && await page.locator('canvas').count() > 0);
    await page.locator('button[class*="PrimaryNavigation_icon"]').click();
    await page.locator('[class*="PrimaryNavigation_parent"]').click();
    await page.locator('nav').getByRole('link', { name: 'Web design & development', exact: true }).click();
    await page.waitForURL('**/service/web-design-development');
    await page.waitForTimeout(1600);
    check('Nested service menu reaches its own working page', await page.locator('h1,h2').count() > 0);

    await go('/contact');
    await page.getByPlaceholder('First name*', { exact: true }).fill('Replica');
    await page.getByPlaceholder('Last name*', { exact: true }).fill('Interaction Test');
    await page.getByPlaceholder('Email*', { exact: true }).fill('replica-test@example.com');
    await page.locator('input[name="privacy"]').check({ force: true });
    await page.getByRole('button', { name: 'Submit', exact: true }).click();
    await page.getByText('Your enquiry has been saved locally.', { exact: false }).waitFor();
    check('Contact submission saves and renders an honest local receipt', true);

    await go('/newsletter');
    await page.getByPlaceholder('First name*', { exact: true }).fill('Replica');
    await page.getByPlaceholder('Last name*', { exact: true }).fill('Newsletter Test');
    await page.getByPlaceholder('Email*', { exact: true }).fill('replica-test@example.com');
    await page.locator('input[name="privacy"]').check({ force: true });
    await page.locator('input[name="newsletter"]').check({ force: true });
    await page.getByRole('button', { name: 'Subscribe', exact: true }).click();
    await page.getByText('Your subscription has been saved locally.', { exact: false }).waitFor();
    check('Newsletter form saves locally and renders its success view', true);

    await go('/briefing');
    await page.getByPlaceholder('Email*', { exact: true }).fill('replica-test@example.com');
    await page.getByPlaceholder('Why are you downloading this brief?*').first().click();
    await page.getByText("I'm just curious", { exact: true }).click();
    await page.locator('input[name="privacy"]').check({ force: true });
    await page.getByRole('button', { name: 'Download Now', exact: true }).click();
    await page.getByText('Your design brief is ready!', { exact: true }).waitFor();
    const downloadLink = page.getByRole('link', { name: 'Download', exact: true });
    const response = await context.request.get(origin + await downloadLink.getAttribute('href'));
    const zip = await response.body();
    check('Briefing form unlocks a real downloadable ZIP', response.ok() && zip.subarray(0, 2).toString() === 'PK');
    const downloadPromise = page.waitForEvent('download');
    await downloadLink.click();
    const download = await downloadPromise;
    check('Download button starts a native file download without leaving the page', download.suggestedFilename() === 'Kota-Website-Briefing-Template.zip' && new URL(page.url()).pathname === '/briefing');

    const dirs = await fs.readdir('data/submissions');
    const submissions = await Promise.all(dirs.map(id => fs.readFile(path.join('data/submissions', id, 'submission.json'), 'utf8').then(JSON.parse)));
    check('Form submissions persist as local records', ['enquiry', 'newsletter', 'briefing'].every(kind => submissions.some(item => item.kind === kind && item.fields.email === 'replica-test@example.com')));
  } catch (error) { errors.push(error.stack); }
  finally {
    await browser.close();
    await fs.writeFile('reports/interconnected-verification.json', JSON.stringify({ checks, errors, failed }, null, 2));
    console.log(JSON.stringify({ checks, errors, failed }, null, 2));
  }
  assert.equal(errors.length, 0);
  assert.equal(failed.length, 0);
  assert.ok(checks.every(item => item.pass));
})().catch(error => { console.error(error); process.exitCode = 1; });
