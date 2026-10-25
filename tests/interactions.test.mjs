import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const source = readFileSync(new URL('../assets/js/portfolio.js', import.meta.url), 'utf8');

test('custom cursor follows exact coordinates without queued animation', () => {
  const handlers = {}, cursor = { style: {} };
  const code = source.slice(source.indexOf('const me ='), source.indexOf('const cur ='));
  vm.runInNewContext(code, { $: () => cursor, fine: true,
    addEventListener: (name, fn) => handlers[name] = fn,
    document: { addEventListener: (name, fn) => handlers[name] = fn },
  });
  handlers.pointermove({ pointerType: 'mouse', clientX: 713, clientY: 241 });
  assert.equal(cursor.style.transform, 'translate3d(713px,241px,0)');
  handlers.blur();
  assert.equal(cursor.style.opacity, 0);
});

test('closing or replacing a coin cancels every frame and observer', () => {
  const frames = new Set(), observers = new Set(), listeners = new Set();
  let sequence = 0;
  const code = source.slice(source.indexOf('const csDispose ='), source.indexOf('function csFx')) +
    source.slice(source.indexOf('function csCoin'), source.indexOf('\nif (', source.indexOf('function csCoin')));
  const scope = {
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame: () => { const id = ++sequence; frames.add(id); return id; },
    cancelAnimationFrame: id => frames.delete(id),
    addEventListener: (type, fn) => listeners.add(fn),
    removeEventListener: (type, fn) => listeners.delete(fn),
    IntersectionObserver: class { constructor() { observers.add(this); } observe() {} disconnect() { observers.delete(this); } },
    window: { IntersectionObserver: true },
    document: { hidden: false, getElementById: () => ({ classList: { contains: () => true } }) },
    root: { querySelector: () => ({ isConnected: true, style: { setProperty() {} }, querySelector: () => ({ style: { setProperty() {} } }), addEventListener() {} }), querySelectorAll: () => [] },
  };
  vm.createContext(scope);
  vm.runInContext(code, scope);
  for (let i = 0; i < 20; i++) {
    vm.runInContext('csCoin(root); csCleanup();', scope);
    assert.equal(frames.size, 0);
    assert.equal(observers.size, 0);
    assert.equal(listeners.size, 0);
  }
});
