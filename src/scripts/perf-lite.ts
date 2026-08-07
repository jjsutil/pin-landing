// Pure decision logic for I-004's static/"perf-lite" mode, split out from main.ts so
// it's testable without a DOM (see perf-lite.test.ts). main.ts wires this to
// prefers-reduced-motion + a short FPS self-benchmark and toggles the `perf-lite`
// class on <html>; global.css reads that class instead of a media query, since
// there's no media feature for "this hardware is slow".

// Frames-per-second floor under which the page switches to static mode. 30fps (half
// of a typical 60Hz refresh) is a reasoned starting point, not a measurement — real
// low-end hardware never behaves quite like the spec says. Recalibrate this one
// constant once someone benchmarks on an actual weak machine; it's the only place
// the number lives.
export const PERF_LITE_FPS_THRESHOLD = 30;

// How many requestAnimationFrame callbacks the self-benchmark samples before deciding.
export const PERF_LITE_SAMPLE_FRAMES = 20;

// Gap between two consecutive frames above which the sample is thrown away and the
// benchmark restarts. A backgrounded tab freezes requestAnimationFrame, and the huge
// delta that shows up on return would read as ~0fps on perfectly capable hardware.
// 500ms is well past anything real rendering produces (even 5fps is 200ms/frame).
export const PERF_LITE_MAX_FRAME_GAP_MS = 500;

// N sampled frames span N-1 intervals; dividing by N would overstate the fps ~5% at
// PERF_LITE_SAMPLE_FRAMES=20 and bias the decision away from static mode at the edge.
export function fpsFromSample(frames: number, elapsedMs: number): number {
  return ((frames - 1) * 1000) / elapsedMs;
}

export function shouldGoStatic(measuredFps: number): boolean {
  return measuredFps < PERF_LITE_FPS_THRESHOLD;
}
