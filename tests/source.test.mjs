import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const source = (path) => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const html = source('index.html');

test('portfolio declares canonical website and favicon', () => {
  assert.match(html, /rel="canonical" href="https:\/\/www\.israelolurotimi\.com\/"/);
  assert.match(html, /rel="icon"[^>]+href="\/icon-192\.png"/);
  assert.ok(existsSync(new URL('../icon-192.png', import.meta.url)));
});

test('crawlers can discover the sitemap', () => {
  assert.match(source('robots.txt'), /Sitemap: https:\/\/www\.israelolurotimi\.com\/sitemap\.xml/);
  assert.match(source('sitemap.xml'), /<urlset\b/);
});

test('API credentials are read from server environment', () => {
  for (const file of ['api/nowplaying.js', 'api/reads.js', 'api/scores.mjs']) {
    const api = source(file);
    assert.match(api, /process\.env\./, file);
    assert.doesNotMatch(api, /(?:sk_live_|sk_test_|ghp_|github_pat_)[A-Za-z0-9_-]{12,}/, file);
  }
});

test('deployment has baseline security headers', () => {
  const config = JSON.parse(source('vercel.json'));
  const rules = config.headers.flatMap(item => item.headers ?? []);
  for (const name of ['X-Content-Type-Options', 'Referrer-Policy', 'X-Frame-Options']) {
    assert.ok(rules.some(item => item.key === name), name);
  }
});

test('install metadata references bundled icons', () => {
  const manifest = JSON.parse(source('manifest.webmanifest'));
  for (const icon of manifest.icons) {
    assert.ok(existsSync(new URL('..' + icon.src, import.meta.url)), icon.src);
  }
});

test('external interaction bundles and fonts resolve from site root', () => {
  for (const path of ['/assets/css/portfolio.css', '/assets/js/portfolio.js', '/assets/js/interface-sound.js']) {
    assert.ok(html.includes('"' + path + '"'), 'HTML must load ' + path);
    assert.ok(existsSync(new URL('..' + path, import.meta.url)), 'Missing ' + path);
  }
  const css = source('assets/css/portfolio.css');
  for (const weight of [400, 600, 700, 900]) {
    assert.ok(css.includes('url(/assets/fonts/goldplay-' + weight + '.woff)'), 'Goldplay font URL ' + weight);
    assert.ok(existsSync(new URL('../assets/fonts/goldplay-' + weight + '.woff', import.meta.url)));
  }
});


test('deployment prevents third-party framing and unneeded browser permissions', () => {
  const config = JSON.parse(source('vercel.json'));
  const headers = config.headers.flatMap(rule => rule.headers ?? []);
  const value = name => headers.find(header => header.key === name)?.value ?? '';
  assert.match(value('Content-Security-Policy'), /frame-ancestors 'none'/);
  assert.match(value('Content-Security-Policy'), /object-src 'none'/);
  assert.match(value('Content-Security-Policy'), /base-uri 'self'/);
  assert.match(value('Permissions-Policy'), /camera=\(\)/);
  assert.match(value('Permissions-Policy'), /microphone=\(\)/);
  assert.match(value('Permissions-Policy'), /geolocation=\(\)/);
});
