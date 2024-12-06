import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm", "iife"],
  /**
   * So index.global.js (iife), can be used in the browser.
   */
  globalName: "dotjs",
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
});
