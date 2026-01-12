const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.resolve(__dirname, '..', 'tmp');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const base = process.env.SMOKE_BASE || 'http://localhost:4200';

  const routes = [
    '/',
    '/home',
    '/about',
    '/contact',
    '/blog',
    '/resume',
    '/admin',
    '/privacy-policy'
  ];

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const results = [];

  for (const route of routes) {
    const url = new URL(route, base).toString();
    const logs = [];
    page.removeAllListeners();
    page.on('console', msg => logs.push({ type: msg.type(), text: msg.text() }));
    page.on('pageerror', err => logs.push({ type: 'pageerror', text: err.message }));
    page.on('requestfailed', req => logs.push({ type: 'requestfailed', url: req.url(), failure: req.failure() && req.failure().errorText }));

    console.log(`Navigating to ${url} ...`);
    let response = null;
    try {
      response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    } catch (e) {
      logs.push({ type: 'navigation-error', text: e.message });
    }
    const status = response ? response.status() : null;

    // give some time for SPA to render
    await page.waitForTimeout(800);

    const routeSafe = route === '/' ? 'root' : route.replace(/[^a-z0-9-]/gi, '_').replace(/^_+|_+$/g, '');
    const screenshotPath = path.join(outDir, `smoke-${routeSafe}.png`);

    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});

    const title = await page.title().catch(() => '(no title)');
    const htmlSnippet = (await page.content()).slice(0, 2000);

    results.push({ route, url, status, title, logs, screenshot: screenshotPath, htmlSnippet });

    console.log(`-> ${route} status=${status} title=${title} logs=${logs.length} screenshot=${screenshotPath}`);
  }

  await browser.close();

  const outFile = path.join(outDir, 'navigation-results.json');
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2));
  console.log('WROTE:', outFile);
  console.log('SUMMARY:');
  results.forEach(r => console.log(`${r.route} -> status=${r.status} title=${r.title} logs=${r.logs.length} screenshot=${r.screenshot}`));

  process.exit(0);
})().catch(err => {
  console.error('SMOKE NAV ERROR:', err);
  process.exit(2);
});

