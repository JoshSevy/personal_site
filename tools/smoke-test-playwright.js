const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.resolve(__dirname, '..', 'tmp');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const screenshotPath = path.join(outDir, 'smoke-screenshot.png');

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const logs = [];
  page.on('console', msg => {
    try { logs.push({type: msg.type(), text: msg.text()}); } catch(e) { /*ignore*/ }
  });
  page.on('pageerror', err => logs.push({type: 'pageerror', text: err.message}));
  page.on('requestfailed', req => logs.push({type: 'requestfailed', url: req.url(), failure: req.failure() && req.failure().errorText}));

  console.log('Navigating to http://localhost:4200/ ...');
  const response = await page.goto('http://localhost:4200/', { waitUntil: 'networkidle', timeout: 30000 }).catch(e => null);
  const status = response ? response.status() : null;

  await page.waitForTimeout(1000);
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const title = await page.title().catch(() => '(no title)');
  const htmlSnippet = (await page.content()).slice(0, 1000);

  await browser.close();

  console.log('RESULT_STATUS:', status);
  console.log('PAGE_TITLE:', title);
  console.log('CONSOLE_LOGS:', JSON.stringify(logs, null, 2));
  console.log('SCREENSHOT:', screenshotPath);
  console.log('HTML_SNIPPET:', htmlSnippet.replace(/\n/g, ' '));

  // exit 0
  process.exit(0);
})().catch(err => {
  console.error('SMOKE TEST ERROR:', err);
  process.exit(2);
});

