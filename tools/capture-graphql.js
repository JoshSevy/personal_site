const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

(async () => {
  const outDir = path.resolve(__dirname, '..', 'tmp');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const resultsFile = path.join(outDir, 'graphql-captures.json');

  const base = process.env.SMOKE_BASE || 'http://localhost:4200';
  const routes = process.env.SMOKE_ROUTES ? process.env.SMOKE_ROUTES.split(',') : ['/blog','/resume','/admin'];

  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  const captures = [];

  // Map of requestId -> requestData to correlate response
  const requestMap = new Map();

  page.on('request', async (req) => {
    try {
      const url = req.url();
      const method = req.method();
      if (method === 'POST') {
        const postData = req.postData();
        let parsed = null;
        try { parsed = postData ? JSON.parse(postData) : null; } catch(e) { parsed = null; }
        if ((parsed && parsed.query) || /graphq/i.test(url)) {
          const id = req.timing ? JSON.stringify(req.timing()) + Math.random() : Math.random().toString();
          requestMap.set(req._requestId || id, {
            url, method, postData: parsed || postData,
            timestamp: Date.now(),
            headers: req.headers()
          });
        }
      }
    } catch (e) {
      // ignore
    }
  });

  page.on('response', async (res) => {
    try {
      const req = res.request();
      const url = req.url();
      const method = req.method();
      if (method === 'POST') {
        let match = false;
        // try to find matching request in map by URL and approximate time
        for (const [key, val] of requestMap.entries()) {
          if (val.url === url) { match = key; break; }
        }
        const body = await (async () => {
          try { return await res.json(); } catch(e) { try { return await res.text(); } catch(e2) { return null; } }
        })();

        if ((body && body.errors) || /graphq/i.test(url) || match) {
          const entry = {
            url,
            status: res.status(),
            ok: res.ok(),
            timestamp: Date.now(),
            request: requestMap.get(match) || { url, method },
            responseBody: body
          };
          captures.push(entry);
          // keep map small
          if (match) requestMap.delete(match);
        }
      }
    } catch (e) {
      // ignore
    }
  });

  for (const route of routes) {
    const url = new URL(route, base).toString();
    console.log(`Visiting ${url}`);
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(800);
    } catch (e) {
      console.error('Navigation error', e.message);
    }
    const safe = route === '/' ? 'root' : route.replace(/[^a-z0-9-]/gi, '_').replace(/^_+|_+$/g, '');
    const shot = path.join(outDir, `graphql-${safe}.png`);
    await page.screenshot({ path: shot, fullPage: true }).catch(() => {});
  }

  await browser.close();

  fs.writeFileSync(resultsFile, JSON.stringify(captures, null, 2));
  console.log('WROTE', resultsFile);
  if (captures.length === 0) console.log('No GraphQL requests/responses captured.');
  else console.log('Captured', captures.length, 'entries.');
  process.exit(0);
})().catch(err => {
  console.error('ERROR', err);
  process.exit(2);
});

