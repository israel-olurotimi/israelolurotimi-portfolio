import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

test('tracked source contains no recognizable credential files or token patterns', () => {
  const files = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean);
  const credentialFile = /(^|\/)(?:\.env(?:\..+)?|[^/]+\.(?:pem|p12|pfx|key))$/i;
  const token = /(?:ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|sk_live_[A-Za-z0-9]{20,}|sk_test_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16})/;

  for (const path of files) {
    assert.ok(!credentialFile.test(path), `Credential-like file is tracked: ${path}`);
    if (!/\.(?:html|mjs|js|json|webmanifest|md|txt|yaml|yml|xml|css|svg|ts|tsx)$/i.test(path)) continue;
    const content = readFileSync(path, 'utf8');
    assert.ok(!token.test(content), `Potential secret in tracked file: ${path}`);
  }
});
