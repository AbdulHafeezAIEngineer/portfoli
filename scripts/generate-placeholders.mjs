import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = await fs.readFile(path.join(root, "data/projects.ts"), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { projects } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
const force = process.argv.includes("--force");
const escape = (s) => String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
const themes = [
  { bg: "#f3eee5", ink: "#322c24", accent: "#8f563b", pale: "#e3d8c5", heading: ["Seasonal food.", "Lasting memories."], cta: "Reserve a table", nav: "Our story     Menu     Visit" },
  { bg: "#f0f1eb", ink: "#273e33", accent: "#324b3d", pale: "#d6ded3", heading: ["Spaces for a", "different kind of living."], cta: "Discover properties", nav: "Properties     About     Contact" },
  { bg: "#10121e", ink: "#f0eefb", accent: "#a69ae6", pale: "#25263e", heading: ["Your work.", "In a better orbit."], cta: "Explore the product", nav: "Product     Features     Pricing" },
  { bg: "#f5f1eb", ink: "#39332d", accent: "#6c5545", pale: "#e4d9cb", heading: ["Good things.", "For everyday living."], cta: "Shop the collection", nav: "Shop     Our story     Journal" },
];
function rect(x, y, w, h, color, r = 0, extra = "") { return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}" ${extra}/>`; }
function text(x, y, content, size, color, extra = "") { return `<text x="${x}" y="${y}" fill="${color}" font-family="sans-serif" font-size="${size}" ${extra}>${escape(content)}</text>`; }
function line(x, y, w, color, opacity = .2) { return rect(x, y, w, 2, color, 1, `opacity="${opacity}"`); }
function button(x, y, label, t, w = 235) { return rect(x, y, w, 56, t.accent, 3) + text(x + 22, y + 35, label, 16, t.bg); }

function illustration(type, x, y, w, h, t) {
  let s = rect(x, y, w, h, t.pale, 4);
  if (type === 0) {
    s += `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w * .35}" ry="${Math.min(w, h) * .36}" fill="#f8f5ee"/><ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w * .26}" ry="${Math.min(w, h) * .27}" fill="#e6ddce"/>`;
    for (let i = 0; i < 9; i++) {
      const angle = i * .8;
      s += `<ellipse cx="${x + w / 2 + Math.cos(angle) * w * .12}" cy="${y + h / 2 + Math.sin(angle) * h * .17}" rx="${w * .065}" ry="${h * .032}" fill="${i % 2 ? "#65745b" : "#b4794e"}" transform="rotate(${i * 28} ${x + w / 2} ${y + h / 2})"/>`;
    }
  } else if (type === 1) {
    s += rect(x, y + h * .66, w, h * .34, "#8d9d80");
    s += rect(x + w * .12, y + h * .25, w * .7, h * .5, "#ece8dd");
    s += rect(x + w * .2, y + h * .18, w * .5, h * .18, "#c4b9a7");
    s += rect(x + w * .22, y + h * .38, w * .17, h * .3, "#596a65");
    s += rect(x + w * .44, y + h * .38, w * .28, h * .3, "#72817a");
    s += rect(x + w * .08, y + h * .72, w * .82, h * .03, "#c4b9a7");
  } else if (type === 2) {
    s += rect(x + w * .06, y + h * .08, w * .88, h * .84, "#171a2b", 8);
    s += rect(x + w * .09, y + h * .12, w * .18, h * .76, "#202337", 3);
    for (let i = 0; i < 5; i++) s += rect(x + w * .12, y + h * (.18 + i * .1), w * .11, h * .02, t.accent, 2, 'opacity=".6"');
    for (let i = 0; i < 3; i++) {
      const cx = x + w * (.32 + i * .2);
      s += rect(cx, y + h * .16, w * .17, h * .15, "#30314a", 5);
      for (let j = 0; j < 3; j++) s += rect(cx, y + h * (.38 + j * .16), w * .17, h * .12, j % 2 ? "#34324e" : "#292c43", 4);
    }
  } else {
    s += `<ellipse cx="${x + w * .51}" cy="${y + h * .83}" rx="${w * .24}" ry="${h * .035}" fill="#bfb1a1"/>`;
    s += `<path d="M${x + w * .39} ${y + h * .2} L${x + w * .6} ${y + h * .2} L${x + w * .6} ${y + h * .4} C${x + w * .8} ${y + h * .8},${x + w * .68} ${y + h * .84},${x + w * .5} ${y + h * .84} C${x + w * .25} ${y + h * .84},${x + w * .2} ${y + h * .65},${x + w * .39} ${y + h * .4}Z" fill="#ba9b80"/>`;
    s += `<ellipse cx="${x + w * .495}" cy="${y + h * .2}" rx="${w * .105}" ry="${h * .025}" fill="#7c6554"/>`;
  }
  return s;
}

function screenshot(project, type, index) {
  const t = themes[type];
  let s = rect(0, 0, 1600, 1000, t.bg);
  s += text(80, 75, project.title, 29, t.ink, 'font-weight="600"') + text(880, 73, t.nav, 16, t.ink);
  s += line(80, 110, 1440, t.ink, .12);
  if (index === 0) {
    s += text(80, 230, "A SELF-INITIATED DESIGN CONCEPT", 12, t.accent, 'letter-spacing="3"');
    s += text(80, 345, t.heading[0], 67, t.ink) + text(80, 425, t.heading[1], type === 1 ? 48 : 61, t.ink);
    s += text(83, 500, project.subtitle, 20, t.ink);
    s += line(83, 550, 410, t.ink, .16) + line(83, 575, 345, t.ink, .1);
    s += button(83, 635, t.cta, t, 255);
    s += illustration(type, 820, 180, 700, 620, t);
    s += line(80, 870, 1440, t.ink, .12) + text(80, 925, "CONSIDERED DESIGN / THOUGHTFUL DETAILS / A DISTINCT PERSPECTIVE", 14, t.ink, 'letter-spacing="2"');
  } else if (index === 4) {
    s += rect(570, 135, 460, 775, t.bg, 5, `stroke="${t.accent}" stroke-opacity=".4"`);
    s += text(600, 185, project.title, 21, t.ink) + text(965, 185, "☰", 22, t.ink);
    s += text(600, 255, t.heading[0], 34, t.ink) + text(600, 300, type === 1 ? "A place to belong." : t.heading[1], 29, t.ink);
    s += button(600, 330, t.cta, t, 240);
    s += illustration(type, 600, 420, 400, 300, t);
    s += text(600, 770, "Made for the everyday.", 24, t.ink);
    s += line(600, 805, 360, t.ink) + line(600, 829, 300, t.ink, .12);
  } else {
    s += text(80, 220, project.screenshots[index].title, 56, t.ink);
    s += text(82, 267, project.subtitle, 19, t.ink);
    if (index === 1) {
      for (let i = 0; i < 3; i++) {
        const x = 80 + i * 490;
        s += illustration(type, x, 335, 460, 320, t);
        s += text(x, 710, ["A considered approach", "Thoughtful by nature", "Designed for your day"][i], 24, t.ink);
        s += line(x, 755, 390, t.ink) + line(x, 782, 290, t.ink, .12);
        s += button(x, 824, "Explore details", t, 195);
      }
    } else {
      s += illustration(type, 80, 335, 780, 540, t);
      s += text(945, 397, index === 2 ? "The details matter." : "Make it yours.", 35, t.ink);
      for (let i = 0; i < 4; i++) {
        s += rect(945, 450 + i * 70, 550, 48, t.pale, 4);
        s += text(965, 482 + i * 70, ["Thoughtfully selected", "A simpler experience", "Made with intention", "Discover the possibilities"][i], 17, t.ink);
      }
      s += button(945, 775, index === 2 ? "Discover more" : t.cta, t, 270);
    }
  }
  s += text(80, 975, "ILLUSTRATIVE PLACEHOLDER — REPLACE WITH YOUR SCREENSHOT", 12, t.ink, 'opacity=".65" letter-spacing="2"');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">${s}</svg>`;
}

await fs.mkdir(path.join(root, "public/projects"), { recursive: true });
let guide = "# Screenshot replacement guide\n\nAll 20 files are 1600 × 1000 JPEG placeholders (16:10). Replace them in `public/projects/` using the exact filenames below. Mobile views should be centered on a 16:10 canvas. Do not add a browser frame; the card component supplies it. Update alt text in `data/projects.ts` to describe your replacement images.\n\nEach prompt is also stored beside its image path in `data/projects.ts`. These are fictional concept projects, not client work.\n\n";
for (const [type, project] of projects.entries()) {
  guide += `## ${project.title}\n\n`;
  for (const [index, image] of project.screenshots.entries()) {
    const destination = path.join(root, "public", image.src);
    let exists = true;
    try { await fs.access(destination); } catch { exists = false; }
    if (force || !exists) await sharp(Buffer.from(screenshot(project, type, index))).jpeg({ quality: 88, mozjpeg: true }).toFile(destination);
    guide += `### \`public${image.src}\` — ${image.title}\n\n${image.prompt}\n\n`;
  }
}
await fs.writeFile(path.join(root, "SCREENSHOTS.md"), guide.trimEnd() + "\n");
console.log("20 screenshot paths prepared. Existing images preserved unless --force is supplied. Prompts saved to SCREENSHOTS.md.");
