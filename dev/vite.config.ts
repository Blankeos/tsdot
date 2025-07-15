// Hono

// Vike
import vikeSolid from "vike-solid/vite";
import vike from "vike/plugin";

// Vite
import { resolve } from "node:path";
import { defineConfig } from "vite";

// Tailwind
import tailwindcss from "@tailwindcss/vite";

import solidSvg from "vite-plugin-solid-svg";

import vikeRoutegen from "@blankeos/vike-routegen";

export default defineConfig({
  plugins: [vike({ prerender: true }), vikeSolid(), tailwindcss(), solidSvg(), vikeRoutegen()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./"),
    },
  },
});
