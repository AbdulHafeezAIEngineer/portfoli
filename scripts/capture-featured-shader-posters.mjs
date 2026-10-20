// Run: node --import tsx scripts/capture-featured-shader-posters.mjs
// Render the same fragment code used on the site, without a network request.
import { chromium } from '@playwright/test';
import sharp from 'sharp';
import shaders from '../lib/featured-shaders.ts';
const { featuredVertex, tunnelFragment, accretionFragment } = shaders;
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-angle=swiftshader'] });
try {
  const page = await browser.newPage();
  await page.setContent('<canvas width="1440" height="900"></canvas>');
  for (const [name, fragment] of [['tunnel', tunnelFragment], ['accretion', accretionFragment]]) {
    const data = await page.evaluate(({ vertex, fragment }) => {
      const canvas = document.querySelector('canvas');
      const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
      if (!gl) throw Error('WebGL unavailable');
      const compile = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source); gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
        return shader;
      };
      const vs = compile(gl.VERTEX_SHADER, vertex), fs = compile(gl.FRAGMENT_SHADER, fragment);
      const program = gl.createProgram(), buffer = gl.createBuffer();
      gl.attachShader(program, vs); gl.attachShader(program, fs); gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(gl.getUniformLocation(program, 'resolution'), canvas.width, canvas.height);
      gl.uniform1f(gl.getUniformLocation(program, 'time'), 8);
      gl.viewport(0, 0, canvas.width, canvas.height); gl.drawArrays(gl.TRIANGLES, 0, 3);
      const image = canvas.toDataURL();
      gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vs); gl.deleteShader(fs);
      return image;
    }, { vertex: featuredVertex, fragment });
    await sharp(Buffer.from(data.split(',')[1], 'base64')).webp({ quality: 85 }).toFile(`public/shaders/${name}.webp`);
    console.log('Rendered actual fragment poster:', name);
  }
} finally { await browser.close(); }
