"use client";

import { useEffect, useRef } from "react";
import type { LiquidGlass } from "@ybouane/liquidglass";
import { useMotionPreference } from "./motion-preference";

/** One small, decorative WebGL scene. Live controls and page content stay HTML. */
export function NavigationGlass() {
  const root = useRef<HTMLDivElement>(null);
  const texture = useRef<HTMLCanvasElement>(null);
  const lens = useRef<HTMLDivElement>(null);
  const { ready, reduced } = useMotionPreference();
  // Serialize asynchronous initialisation across preference changes/unmounts.
  const queue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    const scene = root.current;
    const background = texture.current;
    const pane = lens.current;
    const host = scene?.parentElement;
    if (!ready || reduced || !scene || !background || !pane || !host) return;

    let alive = true;
    let visible = false;
    let starting = false;
    let revision = 0;
    let instance: LiquidGlass | null = null;
    let rendererCanvas: HTMLCanvasElement | undefined;
    let frame = 0;
    let failed = false;
    const transparency = matchMedia("(prefers-reduced-transparency: reduce)");
    const contrast = matchMedia("(prefers-contrast: more)");
    const forcedColors = matchMedia("(forced-colors: active)");
    const allowed = () =>
      alive &&
      visible &&
      !document.hidden &&
      !transparency.matches &&
      !contrast.matches &&
      !forcedColors.matches;
    const config = {
      refraction: 0.48,
      blurAmount: 0.08,
      chromAberration: 0,
      edgeHighlight: 0.1,
      specular: 0.035,
      fresnel: 0.12,
      distortion: 0,
      cornerRadius: 22,
      zRadius: 12,
      tintStrength: 0,
      shadowOpacity: 0,
      floating: false,
      button: false,
    };
    pane.dataset.config = JSON.stringify(config);

    function contextLost() {
      failed = true;
      deactivate();
    }
    function release(value: LiquidGlass) {
      const gl = value.renderer.gl;
      value.renderer.canvas.removeEventListener(
        "webglcontextlost",
        contextLost,
      );
      value.destroy();
      // destroy() frees library resources; also release the browser's context.
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
    function deactivate() {
      revision++;
      cancelAnimationFrame(frame);
      scene!.dataset.state = "fallback";
      delete host!.dataset.glassReady;
      if (instance) {
        release(instance);
        instance = null;
      }
    }
    function drawTexture() {
      const width = scene!.clientWidth + 48;
      const height = scene!.clientHeight + 48;
      const dpr = devicePixelRatio || 1;
      background!.width = Math.max(1, Math.round(width * dpr));
      background!.height = Math.max(1, Math.round(height * dpr));
      const ctx = background!.getContext("2d");
      if (!ctx) return;
      ctx.scale(dpr, dpr);
      const style = getComputedStyle(scene!);
      ctx.fillStyle = style.getPropertyValue("--surface").trim();
      ctx.fillRect(0, 0, width, height);
      // A local, static texture gives the lens something to refract. Never
      // snapshot the page, contact form, chatbot, videos or private content.
      ctx.globalAlpha = 0.1;
      ctx.strokeStyle = style.getPropertyValue("--text").trim();
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(
        width * 0.75,
        height * 1.15,
        width * 0.65,
        height * 0.9,
        -0.25,
        0,
        Math.PI * 2,
      );
      ctx.stroke();
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = style.getPropertyValue("--accent").trim();
      ctx.beginPath();
      ctx.ellipse(
        width * 0.95,
        0,
        width * 0.35,
        height * 0.7,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.globalAlpha = 1;
      instance?.markChanged(background!);
    }
    function reconcile() {
      if (!allowed()) {
        deactivate();
        return;
      }
      if (instance || starting || failed) return;
      starting = true;
      const ticket = ++revision;
      queue.current = queue.current
        .catch(() => {})
        .then(async () => {
          if (!allowed() || ticket !== revision) return;
          const { LiquidGlass: Runtime } = await import("@ybouane/liquidglass");
          if (!allowed() || ticket !== revision) return;
          drawTexture();
          const before = new Set(document.body.children);
          // init creates its renderer synchronously, before its first await.
          const pending = Runtime.init({
            root: scene!,
            glassElements: [pane!],
          });
          rendererCanvas = Array.from(document.body.children).find(
            (child) => child instanceof HTMLCanvasElement && !before.has(child),
          ) as HTMLCanvasElement | undefined;
          rendererCanvas?.setAttribute("data-navigation-glass-renderer", "");
          const value = await pending;
          if (!allowed() || ticket !== revision) {
            release(value);
            return;
          }
          instance = value;
          for (const canvas of value.glassCanvases.values())
            canvas.setAttribute("aria-hidden", "true");
          rendererCanvas?.addEventListener("webglcontextlost", contextLost, {
            once: true,
          });
          frame = requestAnimationFrame(() => {
            if (!allowed() || instance !== value) return;
            scene!.dataset.state = "ready";
            host!.dataset.glassReady = "true";
          });
        })
        .catch(() => {
          failed = true;
          deactivate();
          scene!.dataset.state = "unavailable";
          // A missing/blocked WebGL context must never remove functional HTML.
          rendererCanvas?.remove();
          pane!.querySelectorAll("canvas").forEach((canvas) => canvas.remove());
        })
        .finally(() => {
          starting = false;
          if (allowed() && !instance && !failed) reconcile();
        });
    }
    function pressed() {
      if (instance)
        pane!.dataset.config = JSON.stringify({ ...config, zRadius: 9 });
    }
    function released() {
      if (instance) pane!.dataset.config = JSON.stringify(config);
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      reconcile();
    });
    intersection.observe(scene);
    const resize = new ResizeObserver(drawTexture);
    resize.observe(scene);
    const theme = new MutationObserver(drawTexture);
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    for (const media of [transparency, contrast, forcedColors])
      media.addEventListener("change", reconcile);
    document.addEventListener("visibilitychange", reconcile);
    host.addEventListener("pointerdown", pressed, { passive: true });
    host.addEventListener("pointerup", released, { passive: true });
    host.addEventListener("pointercancel", released, { passive: true });
    host.addEventListener("pointerleave", released, { passive: true });
    return () => {
      alive = false;
      deactivate();
      intersection.disconnect();
      resize.disconnect();
      theme.disconnect();
      for (const media of [transparency, contrast, forcedColors])
        media.removeEventListener("change", reconcile);
      document.removeEventListener("visibilitychange", reconcile);
      host.removeEventListener("pointerdown", pressed);
      host.removeEventListener("pointerup", released);
      host.removeEventListener("pointercancel", released);
      host.removeEventListener("pointerleave", released);
    };
  }, [ready, reduced]);

  return (
    <div
      ref={root}
      className="nav-glass-layer"
      aria-hidden="true"
      data-state="fallback"
    >
      <canvas ref={texture} className="nav-glass-texture" />
      <div ref={lens} className="nav-glass-lens" />
    </div>
  );
}
