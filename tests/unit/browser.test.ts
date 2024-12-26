import { describe, expect, it } from "bun:test";
import { readFileSync } from "fs";
import { Browser } from "happy-dom";
import path from "path";

const browserScript = readFileSync(path.resolve(__dirname, "../../dist/index.global.js"), "utf-8");

describe("tsdot - Browser Usage", () => {
  it("window.tsdot is defined.", () => {
    const browser = new Browser();
    const page = browser.newPage();

    page.mainFrame.evaluate(browserScript);

    expect((page.mainFrame.window as any)["tsdot"]).not.toBe(undefined);
  });

  // Can't get this to work, saved for reference for now.
  // it("tsdot does not pollute `window` when importing in ESM", async () => {
  //   const browser = new Browser();
  //   const page = browser.newPage();

  //   page.mainFrame.document.write("<script>window.moduleLoaded = true;</script>");

  //   await page.waitUntilComplete();
  //   // page.mainFrame.evaluate(`
  //   //   window.moduleLoaded = true;
  //   // `);

  //   // Verify that `window.tsdot` has not been set
  //   expect((page.mainFrame.window as any)["tsdot"]).toBe(undefined);

  //   // Verify the module has been loaded (custom check)
  //   expect((page.mainFrame.window as any).moduleLoaded).toBe(true);
  // });
});
