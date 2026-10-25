import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
const source = readFileSync(new URL('../assets/js/portfolio.js', import.meta.url), 'utf8');
const start = source.indexOf('    const W = "/api/scores"');
const code = source.slice(start, source.indexOf('\n  })(),', start));
function board(fetchImpl) {
  const nodes = new Map(), intervals = [], calls = [];
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, { hidden: false, textContent: '', innerHTML: '', value: 'QA', handlers: {}, addEventListener(type, fn) { this.handlers[type] = fn; }, querySelectorAll() { return this.controls || []; } });
    return nodes.get(id);
  };
  node('sub').controls = [{ disabled: false }, { disabled: false }];
  const context = vm.createContext({ e: node, localStorage: {}, document: { hidden: false, addEventListener() {} }, addEventListener() {}, setInterval(fn, ms) { intervals.push({ fn, ms }); }, setTimeout() { return 1; }, clearTimeout() {}, AbortController, C: true, u: [7,3], v: 4, f: 0, g: 0, performance: { now: () => 30000 }, fetch: async (url, options = {}) => { calls.push({ url, options }); return fetchImpl(url, options); } });
  vm.runInContext(code, context);
  return { node, intervals, calls, context, run: script => vm.runInContext(script, context) };
}
const ok = scores => ({ ok: true, json: async () => ({ scores }) });

test('shared leaderboard refreshes visible clients and pauses while hidden', async () => {
  let scores = [{ id: 'abc', n: 'AAA', s: 1200 }];
  const b = board(() => ok(scores));
  await b.run('re()');
  assert.equal(b.node('lbglobal').textContent, '01200');
  assert.match(b.node('lbl').innerHTML, /AAA/);
  assert.equal(b.intervals[0].ms, 15000);
  scores = [{ id: 'def', n: 'BBB', s: 1500 }];
  b.intervals[0].fn();
  await b.run('pendingFetch');
  assert.match(b.node('lbl').innerHTML, /BBB/);
  assert.equal(b.node('lbglobal').textContent, '01500');
  const count = b.calls.length;
  b.context.document.hidden = true;
  b.intervals[0].fn();
  assert.equal(b.calls.length, count);
  assert.ok(b.calls.every(call => call.options.cache === 'no-store'));
});

test('offline state keeps cached scores and labels the unavailable global best', async () => {
  let offline = false;
  const b = board(() => { if (offline) throw new Error('network'); return ok([{id:'abc',n:'AAA',s:1200}]); });
  await b.run('re()');
  offline = true;
  await b.run('re()');
  assert.equal(b.node('lbs').textContent, 'OFFLINE');
  assert.equal(b.node('lbglobal').textContent, '--');
  assert.match(b.node('lbl').innerHTML, /AAA/);
  assert.match(b.node('lbhelp').textContent, /out of date/);
});

test('failed save preserves form for retry and prevents concurrent submissions', async () => {
  let release;
  const b = board((url, options) => options.method === 'POST' ? new Promise(resolve => { release = () => resolve({ok:false}); }) : ok([]));
  await b.run('re()');
  b.run('J = 1000');
  const first = b.node('sub').handlers.submit({ preventDefault() {} });
  await Promise.resolve();
  await b.node('sub').handlers.submit({ preventDefault() {} });
  assert.equal(b.calls.filter(call => call.options.method === 'POST').length, 1);
  release(); await first;
  assert.equal(b.node('sub').hidden, false);
  assert.equal(b.node('lbs').textContent, 'NOT SAVED. TRY AGAIN');
  assert.ok(b.node('sub').controls.every(control => !control.disabled));
});

test('personal best persists independently of leaderboard rank and score deletion', () => {
  const b = board(() => ok([]));
  b.run('recordPersonalBest(1400); recordPersonalBest(900)');
  assert.equal(b.node('lbpersonal').textContent, '01400');
  assert.equal(JSON.parse(b.context.localStorage.io_best), 1400);
});
