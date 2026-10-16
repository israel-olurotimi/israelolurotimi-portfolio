import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, {
  encoding: 'utf8',
  maxBuffer: 128 * 1024 * 1024
});
const paths = git('log', '--all', '--name-only', '--pretty=format:')
  .split('\n').map(path => path.trim()).filter(Boolean);
const secretPath = /(^|\/)(?:\.env(?:\..+)?|id_rsa(?:\.pub)?|[^/]+\.(?:pem|p12|pfx|key))$/i;
const trackedSecrets = [...new Set(paths.filter(path => secretPath.test(path)))];
if (trackedSecrets.length) {
  console.error('Potential credential files found in Git history. Review and rotate any exposed credentials.');
  process.exitCode = 1;
}

const patches = git('log', '--all', '--format=', '--no-ext-diff', '-p', '--',
  '*.html', '*.js', '*.mjs', '*.ts', '*.tsx', '*.json', '*.yml', '*.yaml', '*.txt');
const secretToken = /(?:ghp_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{20,}|sk_live_[a-zA-Z0-9]{20,}|sk_test_[a-zA-Z0-9]{20,}|AKIA[0-9A-Z]{16})/;
let found = false;
for (const line of patches.split('\n')) {
  if (line.startsWith('+') && !line.startsWith('+++') && secretToken.test(line.slice(1))) {
    found = true;
    break;
  }
}
if (found) {
  console.error('Potential credential token detected in Git history. Review privately and rotate if real.');
  process.exitCode = 1;
}
if (!trackedSecrets.length && !found) {
  console.log('No high-confidence credential patterns or credential-like paths detected in accessible Git history.');
}
