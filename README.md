# canvas-size

[![NPM](https://img.shields.io/npm/v/canvas-size.svg?style=flat-square)](https://www.npmjs.com/package/canvas-size)
[![GitHub Workflow Status (master)](https://img.shields.io/github/actions/workflow/status/jhildenbiddle/canvas-size/test.yml?branch=master&label=checks&style=flat-square)](https://github.com/jhildenbiddle/canvas-size/actions?query=branch%3Amaster+)
[![Codacy code quality](https://img.shields.io/codacy/grade/c39af90445e7478d80fd796d12947495/master?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/canvas-size/dashboard?branch=master)
[![Codacy branch coverage](https://img.shields.io/codacy/coverage/c39af90445e7478d80fd796d12947495/master?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/canvas-size/dashboard?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/canvas-size/blob/master/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/canvas-size/badge)](https://www.jsdelivr.com/package/npm/canvas-size)
[![Sponsor this project](https://img.shields.io/static/v1?style=flat-square&label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/jhildenbiddle)

Determine the maximum area, height, width, and custom dimensions of an HTML `<canvas>` element.

- 🚀 [Documentation & Demo](https://jhildenbiddle.github.io/canvas-size/)
- 🔬 [Test Results](https://jhildenbiddle.github.io/canvas-size/#/?id=test-results): HTML `<canvas>` test results for various platforms and browsers

?> Version 2.x contains new features and breaking changes (see the [Changelog](changelog) for details). Documentation for version 1.x is available [on GitHub](https://github.com/jhildenbiddle/canvas-size/blob/v1.2.6/README.md).

## Why?

The [HTML canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element is [widely supported](http://caniuse.com/#feat=canvas) by modern and legacy browsers, but each browser and platform combination imposes unique size limitations (see [Test Results](https://jhildenbiddle.github.io/canvas-size/#/?id=test-results)) that will render a canvas unusable when exceeded. Unfortunately, browsers do not provide a way to determine what their limitations are, nor do they provide any kind of feedback after an unusable canvas has been created. This makes working with large canvas elements a challenge, especially for applications that support a variety of browsers and platforms.

This micro-library provides the maximum area, height, and width of an HTML canvas element supported by the browser as well as the ability to test custom canvas dimensions. By collecting this information _before_ a new canvas element is created, applications are able to reliably set canvas dimensions within the size limitations of each browser/platform.

## Features

- Determine the maximum `<canvas>` area, height, and width
- Test custom `<canvas>` dimensions
- Web worker + OffscreenCanvas support
- UMD and ES6 module available
- Lightweight (< 1k min+gzip) and dependency-free

**Browser Support**

<img src="https://raw.githubusercontent.com/jhildenbiddle/canvas-size/main/docs/assets/img/chrome.svg" valign="middle" alt="Chrome logo"> <span valign="middle">Chrome 4+</span>
<br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/canvas-size/main/docs/assets/img/edge.svg" valign="middle" alt="Edge logo"> <span valign="middle">Edge 12+</span>
<br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/canvas-size/main/docs/assets/img/firefox.svg" valign="middle" alt="Firefox logo"> <span valign="middle">Firefox 3.6+</span>
<br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/canvas-size/main/docs/assets/img/safari.svg" valign="middle" alt="Safari logo"> <span valign="middle">Safari 4+</span>
<br>
<img src="https://raw.githubusercontent.com/jhildenbiddle/canvas-size/main/docs/assets/img/ie.svg" valign="middle" alt="Internet Explorer logo"> <span valign="middle">Internet Explorer 10+</span>

## Installation

**NPM**

```bash
npm install canvas-size
```

```js
import canvasSize from 'canvas-size';
```

**CDN**

Available on [jsdelivr](https://www.jsdelivr.com/package/npm/canvas-size) (below), [unpkg](https://unpkg.com/browse/canvas-size/), and other CDN services that auto-publish npm packages.

```html
<!-- ES Module (latest v2.x.x) -->
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/canvas-size@2/dist/canvas-size.esm.min.js"
></script>
```

```html
<!-- Global "canvasSize" (latest v2.x.x) -->
<script src="https://cdn.jsdelivr.net/npm/canvas-size@2"></script>
```

> 💡 Note the `@` version lock in the URLs above. This prevents breaking changes in future releases from affecting your project and is therefore the safest method of loading dependencies from a CDN. When a new major version is released, you will need to manually update your CDN URLs by changing the version after the `@` symbol.

## Usage & Options

See the [documentation site](https://jhildenbiddle.github.io/canvas-size/) for details.

## Sponsorship

A [sponsorship](https://github.com/sponsors/jhildenbiddle) is more than just a way to show appreciation for the open-source authors and projects we rely on; it can be the spark that ignites the next big idea, the inspiration to create something new, and the motivation to share so that others may benefit.

If you benefit from this project, please consider lending your support and encouraging future efforts by [becoming a sponsor](https://github.com/sponsors/jhildenbiddle).

Thank you! 🙏🏻

## Contact & Support

- Follow 👨🏻‍💻 **@jhildenbiddle** on [Twitter](https://twitter.com/jhildenbiddle) and [GitHub](https://github.com/jhildenbiddle) for announcements
- Create a 💬 [GitHub issue](https://github.com/jhildenbiddle/canvas-size/issues) for bug reports, feature requests, or questions
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/canvas-size) and 🐦 [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fcanvas-size&hashtags=css,developers,frontend,javascript) to promote the project
- Become a 💖 [sponsor](https://github.com/sponsors/jhildenbiddle) to support the project and future efforts

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/jhildenbiddle/canvas-size/blob/master/LICENSE) for details.

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
