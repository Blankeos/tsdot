import { type FlowProps } from "solid-js";
import { useMetadata } from "vike-metadata-solid";
import getTitle from "../utils/get-title";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { ThemeContextProvider } from "@/contexts/theme.context";
import { getRoute } from "@/route-tree.gen";
import "@/styles/app.css";

useMetadata.setGlobalDefaults({
  title: getTitle("Home"),
  description: "Roll your own auth with the Lucia book with super easy to copy examples.",
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
});

export default function RootLayout(props: FlowProps) {
  return (
    <>
      <ThemeContextProvider>
        <div class="bg-background flex min-h-screen flex-col">
          <header class="bg-primary md:p-6text-white p-4 text-white">
            <nav class="container mx-auto flex items-center justify-between">
              <a href={getRoute("/")} class="text-2xl text-white">
                ts<span class="text-white/50">dot</span>
              </a>
              <div class="flex items-center gap-x-4">
                <a href={getRoute("/demo")} class="text-sm font-medium hover:underline">
                  Demo
                </a>
                {/* <a href="#" class="text-sm font-medium hover:underline">
                  Docs
                </a> */}
                <a
                  href="https://github.com/blankeos/tsdot"
                  target="_blank"
                  class="text-sm font-medium hover:underline"
                >
                  GitHub
                </a>
                <ThemeSwitcher />
              </div>
            </nav>
          </header>

          <div class="flex flex-1 flex-col">{props.children}</div>

          <footer class="bg-primary py-8 text-white">
            <div class="container mx-auto px-4 text-center">
              <p>&copy; 2024 tsdot & doT.js. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </ThemeContextProvider>
    </>
  );
}
