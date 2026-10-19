"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { ShaderInstance, createSharedDevice } from "shaders/js";
type OwnedGPU = NonNullable<Awaited<ReturnType<typeof createSharedDevice>>>;
import {
  pageShaderPreset,
  type ShaderPage,
  type ShaderTheme,
} from "@/lib/page-shader-preset";
import { useMotionPreference } from "./motion-preference";

/** Decorative full-page WebGPU. Native content/controls are never drawn into it. */
export function PageShaderBackground({ page }: { page: ShaderPage }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const queue = useRef<Promise<void>>(Promise.resolve());
  const { ready, reduced } = useMotionPreference();
  const [theme, setTheme] = useState<ShaderTheme>("dark");

  useEffect(() => {
    const changed = () =>
      setTheme(
        document.documentElement.dataset.theme === "light" ? "light" : "dark",
      );
    changed();
    const observer = new MutationObserver(changed);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scene = root.current,
      element = canvas.current;
    const main = scene?.parentElement;
    if (!scene || !element || !main || !ready || reduced) return;
    if (!("gpu" in navigator) || !navigator.gpu) {
      scene.dataset.state = "unsupported";
      return;
    }

    let alive = true,
      visible = false,
      starting = false,
      failed = false,
      revision = 0;
    let instance: ShaderInstance | null = null;
    let ownedGPU: OwnedGPU | null = null;
    const releasedDevices = new WeakSet<OwnedGPU["device"]>();
    function releaseGPU(gpu: OwnedGPU | null) {
      if (!gpu || releasedDevices.has(gpu.device)) return;
      releasedDevices.add(gpu.device);
      gpu.device.destroy();
    }
    const testimonialScene =
      page === "testimonials"
        ? main.querySelector<HTMLElement>(".testimonial-scene")
        : null;
    let frame = 0;
    const contrast = matchMedia("(prefers-contrast: more)");
    const forced = matchMedia("(forced-colors: active)");
    const transparency = matchMedia("(prefers-reduced-transparency: reduce)");
    const allowed = () =>
      alive &&
      visible &&
      !document.hidden &&
      !failed &&
      (!testimonialScene ||
        testimonialScene.dataset.testimonialsActive === "true") &&
      !contrast.matches &&
      !forced.matches &&
      !transparency.matches;
    function stop() {
      revision++;
      cancelAnimationFrame(frame);
      instance?.destroy();
      instance = null;
      releaseGPU(ownedGPU);
      ownedGPU = null;
      scene!.dataset.state = "fallback";
    }
    function resize() {
      if (!instance) return;
      const { width, height } = scene!.getBoundingClientRect();
      const scale = Math.min(1, 960 / width, 720 / height);
      // CSS still covers the viewport. Bound render dimensions independently.
      const logicalWidth = Math.max(1, Math.round(width * scale));
      const logicalHeight = Math.max(1, Math.round(height * scale));
      instance.resize(logicalWidth, logicalHeight);
      // The SDK applies its device pixel ratio. Bound the resulting buffer too,
      // including high-density phones, rather than only its CSS dimensions.
      const overflow = Math.max(1, element!.width / 960, element!.height / 720);
      if (overflow > 1)
        instance.resize(
          Math.max(1, Math.floor(logicalWidth / overflow)),
          Math.max(1, Math.floor(logicalHeight / overflow)),
        );
    }
    function reconcile() {
      if (!allowed()) {
        stop();
        return;
      }
      if (instance || starting) return;
      starting = true;
      const ticket = ++revision;
      delete scene!.dataset.reason;
      scene!.dataset.state = "loading";
      queue.current = queue.current
        .catch(() => {})
        .then(async () => {
          if (!allowed() || ticket !== revision) return;
          const { createShader, createSharedDevice } = await import(
            "shaders/js"
          );
          if (!allowed() || ticket !== revision) return;
          const gpu = await createSharedDevice({
            powerPreference: "low-power",
          });
          if (!gpu) {
            if (alive && ticket === revision) {
              failed = true;
              stop();
              scene!.dataset.reason = "no-device";
            }
            return;
          }
          if (!allowed() || ticket !== revision) {
            releaseGPU(gpu);
            return;
          }
          ownedGPU = gpu;
          const value = await createShader(
            element!,
            pageShaderPreset(page, theme),
            {
              gpu,
              disableTelemetry: true,
              enablePerformanceTracking: false,
              colorSpace: "srgb",
              observeElement: false,
              onError: (reason) => {
                if (!alive || ticket !== revision) return;
                scene!.dataset.reason = reason;
                failed = true;
                stop();
              },
              onReady: () => {
                frame = requestAnimationFrame(() => {
                  if (allowed() && ticket === revision)
                    scene!.dataset.state = "ready";
                });
              },
            },
          );
          if (!allowed() || ticket !== revision) {
            value.destroy();
            releaseGPU(gpu);
            if (ownedGPU === gpu) ownedGPU = null;
            return;
          }
          instance = value;
          resize();
        })
        .catch(() => {
          if (!alive || ticket !== revision) return;
          failed = true;
          stop();
          scene!.dataset.reason = "initialization-failed";
        })
        .finally(() => {
          starting = false;
          if (allowed() && !instance) reconcile();
        });
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      reconcile();
    });
    intersection.observe(main);
    const testimonialState = new MutationObserver(reconcile);
    if (testimonialScene)
      testimonialState.observe(testimonialScene, {
        attributes: true,
        attributeFilter: ["data-testimonials-active"],
      });
    const sizing = new ResizeObserver(resize);
    sizing.observe(scene);
    document.addEventListener("visibilitychange", reconcile);
    for (const preference of [contrast, forced, transparency])
      preference.addEventListener("change", reconcile);
    return () => {
      alive = false;
      stop();
      intersection.disconnect();
      testimonialState.disconnect();
      sizing.disconnect();
      document.removeEventListener("visibilitychange", reconcile);
      for (const preference of [contrast, forced, transparency])
        preference.removeEventListener("change", reconcile);
    };
  }, [page, theme, ready, reduced]);

  return (
    <div
      ref={root}
      className="page-shader-background"
      data-page-shader={page}
      data-state="fallback"
      aria-hidden="true"
      style={
        {
          "--shader-dark-image": `url("/shaders/${page}-dark.webp")`,
          "--shader-light-image": `url("/shaders/${page}-light.webp")`,
        } as CSSProperties
      }
    >
      <canvas ref={canvas} className="page-shader-canvas" />
    </div>
  );
}
