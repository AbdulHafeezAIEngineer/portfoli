import { defineConfig } from "shaders/config";

export default defineConfig({
  // Next.js client components host the SDK with explicit lifecycle control.
  framework: "react",
  // Where `npx shaders install` writes component files
  outDir: "components/shaders",
});
