import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseURL = process.env.PORTFOLIO_TEST_URL || 'http://127.0.0.1:8765';

async function openPage({ width = 1440, height = 900, reducedMotion = 'reduce', isMobile = false } = {}) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion,
    isMobile,
    hasTouch: isMobile,
    serviceWorkers: 'block',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
  return { browser, page, errors };
}

test('desktop loads portfolio, case study and CV without script errors', { timeout: 45000 }, async () => {
  const { browser, page, errors } = await openPage();
  try {
    assert.match(await page.title(), /Israel Olurotimi/);
    assert.equal(await page.locator('#work').count(), 1);
    assert.equal(await page.locator('#cs').count(), 1);
    const cv = page.locator('a[href*="/assets/downloads/Israel_Olurotimi_CV_Product_Design.pdf"]').first();
    const href = await cv.getAttribute('href');
    const downloadResponse = await page.request.get(new URL(href, baseURL).toString());
    assert.equal(downloadResponse.status(), 200);
    assert.match(downloadResponse.headers()['content-type'] || '', /pdf/);

    const caseButton = page.locator('#soma [data-cs]').first();
    assert.ok(await caseButton.count(), 'Expected the SOMA case-study button');
    await caseButton.evaluate(button => button.click());
    await page.waitForTimeout(250);
    assert.ok(await page.locator('#cs').evaluate(node => node.classList.contains('show')));
    await page.locator('#csx').evaluate(button => button.click());
    await page.waitForTimeout(250);
    assert.ok(!(await page.locator('#cs').evaluate(node => node.classList.contains('show'))));
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('mobile loads without page crashes or horizontal document overflow', { timeout: 30000 }, async () => {
  const { browser, page, errors } = await openPage({ width: 390, height: 844, isMobile: true });
  try {
    assert.equal(await page.locator('main').count(), 1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    assert.ok(overflow <= 3, 'Mobile document overflows by ' + overflow + 'px');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});

test('desktop pointer interactions remain responsive', { timeout: 30000 }, async () => {
  const { browser, page, errors } = await openPage({ reducedMotion: 'no-preference' });
  try {
    await page.mouse.move(100, 120);
    await page.waitForTimeout(200);
    const first = await page.locator('#me').evaluate(el => getComputedStyle(el).transform);
    await page.mouse.move(700, 380, { steps: 8 });
    await page.waitForTimeout(350);
    const second = await page.locator('#me').evaluate(el => getComputedStyle(el).transform);
    assert.notEqual(first, second, 'Cursor follower should respond to pointer movement');
    assert.deepEqual(errors, []);
  } finally {
    await browser.close();
  }
});
