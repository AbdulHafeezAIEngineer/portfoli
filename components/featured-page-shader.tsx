"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { accretionFragment, featuredVertex, tunnelFragment } from "@/lib/featured-shaders";
import { useMotionPreference } from "./motion-preference";

type FeaturedPage = "websites" | "testimonials";

/** Bounded, decorative WebGL with a static poster when graphics are unavailable. */
export function FeaturedPageShader({ page }: { page: FeaturedPage }) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reducedRef = useRef(false);
  const reconcileRef = useRef<(() => void) | null>(null);
  const [revision, setRevision] = useState(0);
  const { ready, reduced } = useMotionPreference();
  const effect = page === "websites" ? "accretion" : "tunnel";

  useEffect(() => {
    reducedRef.current = reduced;
    reconcileRef.current?.();
  }, [reduced]);

  useEffect(() => {
    const scene = root.current, element = canvas.current;
    if (!ready || !scene || !element) return;
    const main = scene.parentElement;
    if (!main) return;
    const contrast = matchMedia("(prefers-contrast: more)");
    const forced = matchMedia("(forced-colors: active)");
    const transparency = matchMedia("(prefers-reduced-transparency: reduce)");
    // High-contrast modes keep the content on a plain background.
    if (contrast.matches || forced.matches || transparency.matches) return;
    const gl = element.getContext("webgl", {
      alpha: false, antialias: false, depth: false, stencil: false,
      powerPreference: "low-power", preserveDrawingBuffer: true,
    });
    if (!gl) return;
    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const vs = compile(gl.VERTEX_SHADER, featuredVertex);
    const fs = compile(gl.FRAGMENT_SHADER, effect === "tunnel" ? tunnelFragment : accretionFragment);
    const program = gl.createProgram(), buffer = gl.createBuffer();
    const dispose = () => {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
    };
    if (!vs || !fs || !program || !buffer) { dispose(); return; }
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { dispose(); return; }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const resolution = gl.getUniformLocation(program, "resolution"), clock = gl.getUniformLocation(program, "time");
    const testimonial = page === "testimonials" ? main.querySelector<HTMLElement>(".testimonial-scene") : null;
    let alive = true, visible = false, lost = false, restoring = false, frame = 0, last = 0, elapsed = 8;
    function draw() {
      if (!alive || lost) return;
      gl!.viewport(0, 0, element!.width, element!.height);
      gl!.uniform2f(resolution, element!.width, element!.height);
      gl!.uniform1f(clock, elapsed);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    const allowed = () => alive && !lost && visible && !document.hidden && !reducedRef.current
      && !contrast.matches && !forced.matches && !transparency.matches
      && (!testimonial || testimonial.dataset.testimonialsActive === "true");
    function tick(now: number) {
      if (!allowed()) return;
      if (!last || now - last >= 1000 / 24) {
        elapsed += last ? Math.min((now - last) / 1000, .1) : 0;
        last = now;
        draw();
      }
      frame = requestAnimationFrame(tick);
    }
    function reconcile() {
      cancelAnimationFrame(frame);
      last = 0;
      scene!.dataset.state = lost ? "fallback" : allowed() ? "running" : "still";
      if (allowed()) frame = requestAnimationFrame(tick);
    }
    reconcileRef.current = reconcile;
    function resize() {
      const rect = scene!.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 1.5, 960 / Math.max(rect.width, 1), 720 / Math.max(rect.height, 1));
      element!.width = Math.max(1, Math.round(rect.width * scale));
      element!.height = Math.max(1, Math.round(rect.height * scale));
      draw();
    }
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; reconcile(); });
    intersection.observe(main);
    const sizing = new ResizeObserver(resize);
    sizing.observe(scene);
    const reviewState = new MutationObserver(reconcile);
    if (testimonial) reviewState.observe(testimonial, { attributes: true, attributeFilter: ["data-testimonials-active"] });
    const contextLost = (event: Event) => { event.preventDefault(); lost = true; reconcile(); };
    const contextRestored = () => { restoring = true; setRevision(value => value + 1); };
    element.addEventListener("webglcontextlost", contextLost);
    element.addEventListener("webglcontextrestored", contextRestored);
    document.addEventListener("visibilitychange", reconcile);
    for (const preference of [contrast, forced, transparency]) preference.addEventListener("change", reconcile);
    resize(); reconcile();
    return () => {
      alive = false;
      cancelAnimationFrame(frame);
      reconcileRef.current = null;
      intersection.disconnect(); sizing.disconnect(); reviewState.disconnect();
      document.removeEventListener("visibilitychange", reconcile);
      element.removeEventListener("webglcontextlost", contextLost);
      element.removeEventListener("webglcontextrestored", contextRestored);
      for (const preference of [contrast, forced, transparency]) preference.removeEventListener("change", reconcile);
      dispose();
      if (!restoring) gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [page, effect, ready, revision]);

  return <div ref={root} className="page-shader-background featured-page-shader" data-page-shader={page} data-effect={effect} data-state="fallback" aria-hidden="true"
    style={{ "--featured-poster": `url("/shaders/${effect}.webp")` } as CSSProperties}>
    <canvas ref={canvas} className="page-shader-canvas" />
  </div>;
}
