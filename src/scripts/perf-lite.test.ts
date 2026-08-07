// Run with: node --experimental-strip-types --test src/scripts/perf-lite.test.ts
// (no test framework in this repo yet — Node's built-in runner covers one pure
// function, ponytail rung 3: stdlib does it.)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fpsFromSample, shouldGoStatic, PERF_LITE_FPS_THRESHOLD } from './perf-lite.ts';

test('fps is computed over intervals, not frames', () => {
  // 20 frames in 1s = 19 intervals of ~52.6ms, not 20fps.
  assert.equal(fpsFromSample(20, 1000), 19);
  assert.equal(fpsFromSample(2, 500), 2);
});

test('fps below the threshold triggers static mode', () => {
  assert.equal(shouldGoStatic(PERF_LITE_FPS_THRESHOLD - 1), true);
});

test('fps at or above the threshold does not trigger static mode', () => {
  assert.equal(shouldGoStatic(PERF_LITE_FPS_THRESHOLD), false);
  assert.equal(shouldGoStatic(60), false);
});
