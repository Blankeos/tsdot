// Hono

// Vike
import vikeSolid from "vike-solid/vite";
import vike from "vike/plugin";

// Vite
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vike({ prerender: true }), vikeSolid()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
