import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { chromium } from 'playwright';
import { resolve, sep, extname } from 'node:path';

const root = resolve(process.cwd());
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.webp': 'image/webp',
  '.svg': 'image/svg+xml', '.pdf': 'application/pdf',
  '.woff': 'font/woff', '.mp4': 'video/mp4'
};

let server, browser, origin;
before(async () => {
  server = createServer(async (req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const path = resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    if (path !== root && !path.startsWith(root + sep)) {
      res.writeHead(403).end();
      return;
    }
    try {
      const file = await stat(path);
      if (!file.isFile()) throw new Error('Not a file');
      res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' });
      res.end(await readFile(path));
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  await new Promise((done) => server.listen(0, '127.0.0.1', done));
  origin = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch({ headless: true });
});

after(async () => {
  await browser?.close();
  await new Promise((done) => server?.close(done));
});

async function openPage({ width, height, reducedMotion = 'reduce', isMobile = false, hasTouch = false }) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion,
    isMobile,
    hasTouch,
    serviceWorkers: 'block'
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(origin + '/', { waitUntil: 'load' });
  await page.locator('#hero h1').waitFor({ state: 'visible', timeout: 10000 });
  return { context, page, errors };
}

test('desktop shell, CV link, navigation and main interactions', async () => {
  const { context, page, errors } = await openPage({ width: 1440, height: 900 });
  try {
    assert.match(await page.title(), /Israel Olurotimi/);
    assert.equal(await page.locator('#hero').count(), 1);
    assert.equal(await page.locator('#work').count(), 1);
    const cv = page.locator('#cvdl');
    assert.match(await cv.getAttribute('href'), /\.pdf$/i);
    const url = new URL(await cv.getAttribute('href'), origin);
    const response = await page.request.get(url.toString());
    assert.equal(response.status(), 200, 'CV download must exist');
    assert.match(response.headers()['content-type'] || '', /pdf/i);

    await page.locator('#moreB').click();
    assert.equal(await page.locator('#moreB').getAttribute('aria-expanded'), 'true');
    await page.locator('#lessB').click();
    assert.equal(await page.locator('#moreB').getAttribute('aria-expanded'), 'false');

    assert.deepEqual(errors, [], 'No browser script exceptions');
  } finally {
    await context.close();
  }
});

test('desktop pointer movement and archive controls do not throw', async () => {
  const { context, page, errors } = await openPage({ width: 1440, height: 900, reducedMotion: 'no-preference' });
  try {
    await page.mouse.move(140, 140);
    await page.mouse.move(560, 340, { steps: 8 });
    await page.mouse.move(950, 540, { steps: 8 });
    await page.waitForTimeout(180);
    assert.equal(await page.locator('#me').count(), 1);
    assert.deepEqual(errors, [], 'Desktop interactions must not throw');
  } finally {
    await context.close();
  }
});

test('mobile navigation renders without horizontal overflow or errors', async () => {
  const { context, page, errors } = await openPage({
    width: 390, height: 844, isMobile: true, hasTouch: true
  });
  try {
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 2);
    assert.equal(overflow, false, 'Mobile viewport must not overflow horizontally');
    assert.equal(await page.locator('#hero h1').isVisible(), true);
    assert.deepEqual(errors, [], 'Mobile interactions must not throw');
  } finally {
    await context.close();
  }
});

test('reduced motion does not prevent content from loading', async () => {
  const { context, page, errors } = await openPage({ width: 1280, height: 800 });
  try {
    assert.equal(await page.locator('details#soma').count(), 1);
    assert.equal(await page.locator('[data-cs]').count() > 0, true);
    assert.deepEqual(errors, []);
  } finally {
    await context.close();
  }
});
