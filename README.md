![dot.js](https://raw.githubusercontent.com/Blankeos/tsdot/refs/heads/main/_docs/banner.png)

<h1 align="center">tsdot</h1>

<div align="center">
        <a href="https://www.npmjs.com/package/tsdot" target="_blank">
          <img src="https://img.shields.io/npm/dw/tsdot?style=for-the-badge" alt="NPM Downloads"></img></a>
        <img src="https://img.shields.io/bundlephobia/minzip/tsdot?style=for-the-badge" alt="NPM Bundle Size" ></img>
          <img src="https://img.shields.io/badge/maintained%20with-bun-cc00ff.svg?style=for-the-badge&logo=bun)](https://bun.sh/" alt="Bun"></img>
    <img src="https://img.shields.io/npm/l/vike-metadata-react?style=for-the-badge" alt="NPM License"></img>
</div>

tsdot is a template engine for JavaScript. It is similar to Mustache, EJS, Handlebars, and many others. This is a fork of the original [doT.js](https://github.com/olado/doT) template engine.

## Features

- 🔥 Super fast and super small
- ⚡️ Compile-time valuation
- ❇️ Custom delimiters, partials, conditionals, array iterators, encoding, white-space control, and much more.

The only new changes after the fork are:

- 🚀 First-class typescript support (more modern wow!)
- 💪 Works in the Browser, Node.js Bun, and Deno.
- 🤓 Better Docs :D (no, really)
- 🥳 More fun! (wow emojies)

## Installation

### JS/TS Projects

```sh
npm install tsdot
```

### Browser-only

```html
<head>
  <script src="https://cdn.jsdelivr.net/npm/tsdot@latest/dist/index.global.js"></script>
</head>
```

## Basic Usage

### JS/TS Projects

```ts
import tsdot from "tsdot";

const template = `
  <div class="container">
    <h1>Hello, {{=it.name}}!</h1>
  </div>
`;

// 1. Compile the template
const compiledTemplate = tsdot.compile(template);

// 2. Render the template with data
const result = compiledTemplate({ name: "World" });

// <div class="container">
//   <h1>Hello, World!</h1>
// </div>
```

### Browser-only

```html
<body>
  <script>
    const template = `
        <div class="container">
          <h1>Hello, {{=it.name}}!</h1>
        </div>
      `;

    const compiledTemplate = tsdot.compile(template);

    // 2. Render the template with data
    const result = compiledTemplate({ name: "World" });
  </script>
</body>
```

## Reference

> [!WARNING]
>
> Work in progress, feel free to contribute a PR for examples/code snippets.

### Templating Language

> I think each of these need examples.

```sh
{{  }} - evaluation
{{=  }} - interpolation
{{! }} - interpolation with encoding
{{# }} - compile-time evaluation/includes and partials
{{## #}} - compile-time defines
{{? }} - conditionals
{{~ }} - array iteration
```

### TypeScript API

```ts
// Compiles a template.
// - `tmpl`: The template string.
// - `c`: The template settings.
// - `def`: The template default values. (I think)
Dot.template<T>(tmpl: string, c?: TemplateSettings | null, def?: Record<string, any>): RenderFunction<T>

// Function returned by Dot.template(). Use this to render the template.
RenderFunction<T = Record<string, any>> = (data: T): string // Function returned by Dot.template(). Use this to render the template.

// For express apparently.
Dot.compile(tmpl: string, def?: Record<string, any>): RenderFunction
```

### Credits

- [doT.js](https://olado.github.io/doT/index.html) - Original by by Laura Doktorova. However, it's been super outdated and I couldn't install it properly without TypeScript complaining hard. Hence, motivated this fork with better tools like tsup nowadays.
- [Handlebars](https://handlebarsjs.com/guide/) - OG templating with great devx.
- [Mustache](https://mustache.github.io/) - Logic-less templates.
