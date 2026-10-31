const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  const consoleLogs = [];
  const pageErrors = [];
  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => pageErrors.push(err.toString()));

  const url = 'http://127.0.0.1:3000/work';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'load', timeout: 15000 });
  await page.waitForTimeout(2000);

  const evaluation = await page.evaluate(() => {
    // Check project cards
    const cards = Array.from(document.querySelectorAll('[class*="ProjectCard_project"], [class*="projectCard"], [class*="archive"] a, .Filters_results__'));
    const allLinks = Array.from(document.querySelectorAll('a[href*="/work/"]'));
    const mount = document.querySelector('.work-react-archive-mount');
    const filters = Array.from(document.querySelectorAll('button[class*="Filters"]')).map(b => b.innerText);

    return {
      cardCount: cards.length,
      workLinksCount: allLinks.length,
      sampleWorkLinks: allLinks.slice(0, 5).map(a => ({ href: a.getAttribute('href'), text: a.innerText })),
      hasMount: !!mount,
      mountChildren: mount ? mount.children.length : 0,
      mountHTMLSnippet: mount ? mount.innerHTML.slice(0, 300) : null,
      filtersFound: filters,
      bodyTextLength: document.body ? document.body.innerText.length : 0
    };
  });

  console.log('Work page inspection:', JSON.stringify(evaluation, null, 2));

  // Take screenshot of work section
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'scripts/work-page-status.png' });
  console.log('Screenshot saved to scripts/work-page-status.png');

  if (pageErrors.length > 0) console.log('Page errors:', pageErrors);
  console.log('Console logs:', consoleLogs.slice(-15));

  await browser.close();
})();
