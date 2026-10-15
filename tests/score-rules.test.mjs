import test from 'node:test';
import assert from 'node:assert/strict';
import { validateScoreSubmission } from '../api/scores.mjs';

const valid = { n: 'MAR', you: 7, cl: 4, r: 12, ms: 52000, h: 0 };

test('accepts a completed seven-point game', () => {
  const result = validateScoreSubmission(valid);
  assert.equal(result.error, undefined);
  assert.equal(result.score, 7 * 100 - 4 * 35 + 12 * 15 + 500);
  assert.equal(result.n, 'MAR');
});

test('accepts a loss and hard-mode multiplier', () => {
  const result = validateScoreSubmission({ ...valid, you: 3, cl: 7, h: 1 });
  assert.equal(result.error, undefined);
  assert.equal(result.score, (3 * 100 - 7 * 35 + 12 * 15) * 2);
});

test('rejects incomplete, over-limit and tied final scores', () => {
  for (const [you, cl] of [[6, 2], [8, 1], [7, 7], [19, 0], [0, 0]]) {
    assert.equal(validateScoreSubmission({ ...valid, you, cl }).error, 'bad score', `${you}-${cl}`);
  }
});

test('rejects invalid difficulty and impossible timings', () => {
  for (const h of ['true', true, 2]) assert.equal(validateScoreSubmission({ ...valid, h }).error, 'bad score');
  assert.equal(validateScoreSubmission({ ...valid, ms: 500 }).error, 'too fast');
  assert.equal(validateScoreSubmission({ ...valid, ms: -5 }).error, 'bad score');
});

test('rejects malformed names and sanitizes initials', () => {
  assert.equal(validateScoreSubmission({ ...valid, n: 'a' }).error, 'bad score');
  assert.equal(validateScoreSubmission({ ...valid, n: 'ma*' }).n, 'MA');
});
