import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["cjs", "esm", "iife"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  minify: true,
});
