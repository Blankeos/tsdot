import { defineConfig } from "tsup";

export default defineConfig([
  // ESM Build
  {
    entry: ["src/index.ts"],
    outDir: "dist",
    format: ["esm", "cjs"],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: true,
    // minify: true,
  },
  // Browser Build
  {
    entry: {
      index: "src/browser.ts",
    },
    outDir: "dist",
    format: ["iife"],
    dts: true,
    splitting: true,
    sourcemap: true,
    clean: false,
    // minify: true,
  },
]);
