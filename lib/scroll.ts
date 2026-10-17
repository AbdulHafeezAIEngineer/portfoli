"use client";

type Metrics = {
  y: number;
  height: number;
  viewport: number;
  velocity: number;
};
const listeners = new Set<(metrics: Metrics) => void>();
let frame = 0;
let previousY = 0;
let previousTime = 0;
function update() {
  frame = 0;
  const now = performance.now();
  const y = window.scrollY;
  const elapsed = now - previousTime;
  const velocity =
    previousTime && elapsed < 200 ? (y - previousY) / Math.max(1, elapsed) : 0;
  previousY = y;
  previousTime = now;
  const metrics = {
    y,
    height: document.documentElement.scrollHeight,
    viewport: window.innerHeight,
    velocity,
  };
  for (const listener of listeners) listener(metrics);
}
function schedule() {
  if (!frame) frame = requestAnimationFrame(update);
}
/** One passive listener and one animation frame shared by all public scroll effects. */
export function subscribeScroll(listener: (metrics: Metrics) => void) {
  if (!listeners.size) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  listeners.add(listener);
  schedule();
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = 0;
    }
  };
}
