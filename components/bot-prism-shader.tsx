"use client";

import { useEffect, useRef } from "react";
import { useMotionPreference } from "./motion-preference";

const vertex = `attribute vec2 position; void main(){gl_Position=vec4(position,0.,1.);}`;
const fragment = `
precision mediump float;
uniform vec2 resolution;
uniform float time;
vec3 spectral(float x){return .52+.48*cos(6.28318*(x+vec3(0.,.33,.67)));}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;
 vec3 col=vec3(.012,.014,.02);
 float t=time*.14;
 for(int i=0;i<5;i++){
  float fi=float(i);
  float a=.45+fi*1.13+.08*sin(t+fi);
  mat2 rot=mat2(cos(a),-sin(a),sin(a),cos(a));
  vec2 p=rot*uv;
  p.x+=.24*sin(p.y*1.7+t+fi*1.5);
  float center=.57*sin(p.y*1.4+fi*1.8+t)+.13*sin(p.y*3.4-t);
  float d=abs(p.x-center);
  float width=.038+.047*(.5+.5*sin(p.y*2.4+fi+t));
  float ribbon=exp(-d*d/(width*width));
  float edge=pow(.007/(abs(d-width*.72)+.007),1.6);
  float halo=exp(-d*10.)*.13;
  float grain=.76+.24*sin(d*480.+p.y*37.+fi);
  vec3 rainbow=spectral(p.y*.23+fi*.19+d*2.7+t*.15);
  vec3 silk=mix(rainbow,vec3(1.),pow(ribbon,5.)*.76);
  col+=(silk*ribbon*grain*1.1+rainbow*edge*.45+rainbow*halo)*(.58+.42*sin(p.y+fi)*sin(p.y+fi));
 }
 col=1.-exp(-col*1.4);
 gl_FragColor=vec4(col,1.);
}`;

/** A real animated fragment shader. CSS artwork is only the no-WebGL fallback. */
export function BotPrismShader() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const reducedRef = useRef(false);
  const reconcileRef = useRef<(() => void) | null>(null);
  const { ready, reduced } = useMotionPreference();
  useEffect(() => {
    reducedRef.current = reduced;
    reconcileRef.current?.();
  }, [reduced]);
  useEffect(() => {
    const element = canvas.current;
    const scene = root.current;
    if (!ready || !element || !scene) return;
    const gl = element.getContext("webgl", {
      alpha: false, antialias: false, depth: false, stencil: false,
      powerPreference: "low-power", preserveDrawingBuffer: true,
    });
    if (!gl) { scene.dataset.state = "fallback"; return; }
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
    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragment);
    const program = gl.createProgram();
    const buffer = gl.createBuffer();
    const dispose = () => {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
    };
    if (!vs || !fs || !program || !buffer) {
      dispose(); scene.dataset.state = "fallback"; gl.getExtension("WEBGL_lose_context")?.loseContext(); return;
    }
    gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      dispose(); scene.dataset.state = "fallback"; gl.getExtension("WEBGL_lose_context")?.loseContext(); return;
    }
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,3,-1,-1,3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const size = gl.getUniformLocation(program, "resolution");
    const clock = gl.getUniformLocation(program, "time");
    let frame = 0, visible = false, alive = true, lost = false, elapsed = 5, last = 0;
    function draw() {
      if (!alive || lost) return;
      gl!.viewport(0, 0, element!.width, element!.height);
      gl!.uniform2f(size, element!.width, element!.height);
      gl!.uniform1f(clock, elapsed);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
    function allowed() { return alive && !lost && visible && !document.hidden && !reducedRef.current; }
    function tick(now: number) {
      if (!allowed()) return;
      if (!last || now-last >= 1000/24) {
        elapsed += last ? Math.min((now-last)/1000,.1) : 0;
        last = now; draw();
      }
      frame = requestAnimationFrame(tick);
    }
    function reconcile() {
      cancelAnimationFrame(frame); frame=0; last=0;
      if (lost) { scene!.dataset.state="fallback"; return; }
      scene!.dataset.state = allowed() ? "running" : "still";
      draw();
      if (allowed()) frame=requestAnimationFrame(tick);
    }
    reconcileRef.current = reconcile;
    function resize() {
      const rect=scene!.getBoundingClientRect();
      const scale=Math.min(window.devicePixelRatio||1,1.5,1100/Math.max(rect.width,1),800/Math.max(rect.height,1));
      element!.width=Math.max(1,Math.round(rect.width*scale));
      element!.height=Math.max(1,Math.round(rect.height*scale));
      draw();
    }
    const observer=new ResizeObserver(resize); observer.observe(scene);
    const intersection=new IntersectionObserver(([entry])=>{ visible=entry.isIntersecting; reconcile(); });
    intersection.observe(scene);
    const contextLost=(event: Event)=>{ event.preventDefault(); lost=true; cancelAnimationFrame(frame); scene.dataset.state="fallback"; };
    element.addEventListener("webglcontextlost",contextLost);
    document.addEventListener("visibilitychange",reconcile);
    resize(); reconcile();
    return () => {
      alive=false; cancelAnimationFrame(frame); reconcileRef.current=null;
      observer.disconnect(); intersection.disconnect();
      document.removeEventListener("visibilitychange",reconcile);
      element.removeEventListener("webglcontextlost",contextLost);
      dispose(); gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [ready]);
  return <div className="bot-prism" ref={root} aria-hidden="true" data-state="fallback"><canvas ref={canvas} className="bot-prism-canvas" /></div>;
}
