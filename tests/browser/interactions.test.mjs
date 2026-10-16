import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:8765';

async function open() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: 'reduce',
    serviceWorkers: 'block'
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(base, { waitUntil: 'load' });
  return { browser, page, errors };
}

test('externalized assets load and local fonts resolve', { timeout: 30000 }, async () => {
  const { browser, page, errors } = await open();
  try {
    for (const path of [
      '/assets/css/portfolio.css',
      '/assets/js/portfolio.js',
      '/assets/js/interface-sound.js',
      '/assets/fonts/goldplay-400.woff'
    ]) {
      const response = await page.request.get(base + path);
      assert.equal(response.status(), 200, path);
    }
    const activeStyle = await page.evaluate(() =>
      [...document.styleSheets].some(sheet => sheet.href?.includes('/assets/css/portfolio.css'))
    );
    assert.equal(activeStyle, true, 'External stylesheet is applied');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('zoom shortcuts preserve in-page zoom controls', { timeout: 30000 }, async () => {
  const { browser, page, errors } = await open();
  try {
    const level = page.locator('#zv');
    assert.equal((await level.textContent()).trim(), '100%');
    await page.keyboard.down('Control');
    await page.keyboard.press('=');
    await page.keyboard.up('Control');
    assert.equal((await level.textContent()).trim(), '110%');
    await page.keyboard.down('Control');
    await page.keyboard.press('-');
    await page.keyboard.up('Control');
    assert.equal((await level.textContent()).trim(), '100%');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('Revolve coin rotates on controlled pointer drag', { timeout: 45000 }, async () => {
  const { browser, page, errors } = await open();
  try {
    await page.locator('#revolve [data-cs]').first().evaluate(button => button.click());
    const coin = page.locator('#cs .cn').first();
    await coin.waitFor({ state: 'visible', timeout: 10000 });
    await coin.scrollIntoViewIfNeeded();
    const before = await coin.locator('.cw').evaluate(element =>
      parseFloat(element.style.getPropertyValue('--ry'))
    );
    const box = await coin.boundingBox();
    assert.ok(box && box.width > 0, 'Coin remains visible');
    const startX = box.x + box.width / 2, y = box.y + box.height / 2;
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(startX + 80, y, { steps: 6 });
    await page.mouse.up();
    const after = await coin.locator('.cw').evaluate(element =>
      parseFloat(element.style.getPropertyValue('--ry'))
    );
    assert.ok(Number.isFinite(before) && Number.isFinite(after));
    assert.ok(Math.abs(after - before) >= 20 && Math.abs(after - before) <= 35,
      '80px pointer drag should rotate the coin at approximately 0.35 degrees/pixel');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
