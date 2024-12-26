import { expect, test } from "@playwright/test";
import { readFileSync } from "fs";
import path from "path";

// __dirname polyfill
import { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const browserScript = readFileSync(
  path.resolve(__dirname, "../../dist/browser.global.js"),
  "utf-8"
);

test.describe("tsdot - Browser Usage (Playwright)", () => {
  test("window.tsdot is defined", async ({ page }) => {
    await page.goto("about:blank");

    await page.addScriptTag({
      content: browserScript,
    });

    const isTsdotDefined = await page.evaluate(() => {
      return typeof (window as any).tsdot !== "undefined";
    });

    expect(isTsdotDefined).not.toBe(undefined);
  });

  test("tsdot compiles a template", async ({ page }) => {
    await page.goto("about:blank");

    await page.addScriptTag({
      content: browserScript,
    });

    await page.setContent('<div id="content"></div>');

    await page.addScriptTag({
      content: `
      var data = {
        title: "World",
        name: "Carlo",
      };

      const renderFn = tsdot.template('<h1>Hello, {{=it.name}}. My name is {{=it.name}}</h1>');

      const result = renderFn(data);

      document.getElementById("content").innerHTML = result;
      `,
    });

    // Verify the rendered content (you can also use innerHTML, depending on what you need to check)
    const renderedContent = await page.innerHTML("#content");

    // Add your assertions to check the rendered result
    expect(renderedContent).toContain("<h1>Hello, Carlo. My name is Carlo</h1>"); // Check for custom injection
  });
});
