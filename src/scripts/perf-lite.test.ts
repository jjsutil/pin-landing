// Run with: node --experimental-strip-types --test src/scripts/perf-lite.test.ts
// (no test framework in this repo yet — Node's built-in runner covers one pure
// function, ponytail rung 3: stdlib does it.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { shouldGoStatic, PERF_LITE_FPS_THRESHOLD } from './perf-lite.ts';

test('fps below the threshold triggers static mode', () => {
  assert.equal(shouldGoStatic(PERF_LITE_FPS_THRESHOLD - 1), true);
});

test('fps at or above the threshold does not trigger static mode', () => {
  assert.equal(shouldGoStatic(PERF_LITE_FPS_THRESHOLD), false);
  assert.equal(shouldGoStatic(60), false);
});
