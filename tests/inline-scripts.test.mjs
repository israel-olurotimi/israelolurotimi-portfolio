import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('inline browser JavaScript parses without syntax errors', () => {
  let checked = 0;
  const tags = html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi);
  for (const [, attributes, source] of tags) {
    if (!source.trim() || /\bsrc\s*=/.test(attributes) ||
        /type\s*=\s*["']application\/ld\+json/i.test(attributes)) continue;
    assert.doesNotThrow(() => new Script(source, { filename: `inline-script-${checked + 1}.js` }));
    checked++;
  }
  assert.ok(checked > 0, 'Expected inline scripts to validate');
});
