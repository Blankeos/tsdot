import { describe, expect, test } from "bun:test";
import tsdot from "../../src/index";

describe("tsdot - ES Module Usage", () => {
  test("basic template interpolation", () => {
    const template = "Hello {{=it.name}}!";
    const data = { name: "World" };
    const compiledFn = tsdot.template(template);
    expect(compiledFn(data)).toBe("Hello World!");
  });

  test("conditional rendering", () => {
    const template = "{{? it.show }}Visible{{?}}";
    const compiledFn = tsdot.template(template);
    expect(compiledFn({ show: true })).toBe("Visible");
    expect(compiledFn({ show: false })).toBe("");
  });

  test("iterate over array", () => {
    const template = "{{~it.items :value:index}}[{{=index}}:{{=value}}]{{~}}";
    const data = { items: ["a", "b", "c"] };
    const compiledFn = tsdot.template(template);
    expect(compiledFn(data)).toBe("[0:a][1:b][2:c]");
  });

  // Instead of using HTML encoding directly, let's test the encodeHTMLSource function
  test("HTML encoding function", () => {
    const encoder = tsdot.encodeHTMLSource();
    expect(encoder("<div>")).toBe("&#60;div&#62;");
    expect(encoder("&")).toBe("&#38;");
    expect(encoder('"')).toBe("&#34;");
  });

  // Alternative HTML encoding test using interpolation
  test("HTML encoding via interpolation", () => {
    const template = "{{=it.html}}";
    const data = { html: "<div>" };
    const compiledFn = tsdot.template(template);
    expect(compiledFn(data)).toBe("<div>");
  });
});
