import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const destination = path.join(
  root,
  "public/certificates/prompt-engineering-placeholder.png",
);
try {
  await fs.access(destination);
  console.log("Existing certificate image preserved.");
} catch {
  await fs.mkdir(path.dirname(destination), { recursive: true });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1120" viewBox="0 0 1600 1120"><rect width="1600" height="1120" fill="#15151f"/><rect x="55" y="55" width="1490" height="1010" rx="10" fill="none" stroke="#d4af37" stroke-opacity=".4"/><path d="M120 200h1360M120 900h1360" stroke="#ffffff" stroke-opacity=".12"/><g font-family="sans-serif" text-anchor="middle"><text x="800" y="150" font-size="22" letter-spacing="8" fill="#d4af37">ELVORA / CERTIFICATION</text><text x="800" y="410" font-size="38" fill="#d4af37">[PLACEHOLDER]</text><text x="800" y="515" font-size="64" fill="#f3f1eb">Prompt Engineering</text><text x="800" y="595" font-size="26" fill="#b8b5c5">Replace with your actual degree or certificate image.</text><text x="800" y="710" font-size="22" fill="#b8b5c5">No issuer, award date, or credential has been supplied.</text><text x="800" y="975" font-size="20" letter-spacing="3" fill="#d4af37">NOT A CREDENTIAL / IMAGE PENDING</text></g></svg>`;
  await sharp(Buffer.from(svg)).png().toFile(destination);
  console.log("Clearly marked PNG certificate placeholder generated.");
}
