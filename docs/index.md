# canvas-size

[![NPM](https://img.shields.io/npm/v/canvas-size.svg?style=flat-square)](https://www.npmjs.com/package/canvas-size)
[![GitHub Workflow Status (master)](https://img.shields.io/github/actions/workflow/status/jhildenbiddle/canvas-size/test.yml?branch=master&label=checks&style=flat-square)](https://github.com/jhildenbiddle/canvas-size/actions?query=branch%3Amaster+)
[![Codacy code quality](https://img.shields.io/codacy/grade/c39af90445e7478d80fd796d12947495/master?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/canvas-size/dashboard?branch=master)
[![Codacy branch coverage](https://img.shields.io/codacy/coverage/c39af90445e7478d80fd796d12947495/master?style=flat-square)](https://app.codacy.com/gh/jhildenbiddle/canvas-size/dashboard?branch=master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/canvas-size/blob/master/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/canvas-size/badge)](https://www.jsdelivr.com/package/npm/canvas-size)
[![Sponsor this project](https://img.shields.io/static/v1?style=flat-square&label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/jhildenbiddle)

Determine the maximum area, height, width, and custom dimensions of an HTML `<canvas>` element.

?> Version 2.x contains new features and breaking changes (see the [Changelog](changelog) for details). Documentation for version 1.x is available [on GitHub](https://github.com/jhildenbiddle/canvas-size/blob/v1.2.6/README.md).

## Why?

The [HTML canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element is [widely supported](http://caniuse.com/#feat=canvas) by modern and legacy browsers, but each browser and platform combination imposes [unique size limitations](#test-results) that will render a canvas unusable when exceeded. Unfortunately, browsers do not provide a way to determine what their limitations are, nor do they provide any kind of feedback after an unusable canvas has been created. This makes working with large canvas elements a challenge, especially for applications that support a variety of browsers and platforms.

This micro-library provides the maximum area, height, and width of an HTML canvas element supported by the browser as well as the ability to test custom canvas dimensions. By collecting this information _before_ a new canvas element is created, applications are able to reliably set canvas dimensions within the size limitations of each browser/platform.

## Demo

<div class="codepen-wrapper">
  <p class="codepen" data-theme-id="dark" data-default-tab="js,result" data-slug-hash="dyrQGNx" data-preview="true" data-editable="true" data-user="jhildenbiddle" style="box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 0; margin: 0; padding: 1em;">
    <span>See the Pen <a href="https://codepen.io/jhildenbiddle/pen/dyrQGNx">
    Demo: canvas-size</a> by John Hildenbiddle (<a href="https://codepen.io/jhildenbiddle">@jhildenbiddle</a>)
    on <a href="https://codepen.io">CodePen</a>.</span>
  </p>
  <script async src="https://cpwebassets.codepen.io/assets/embed/ei.js"></script>
</div>

## Features

- Determine the maximum `<canvas>` area, height, and width
- Test custom `<canvas>` dimensions
- Web worker + OffscreenCanvas support
- UMD and ES6 module available
- Lightweight (< 1k min+gzip) and dependency-free

**Browser Support**

<img src="assets/img/chrome.svg" valign="middle" alt=""> <span valign="middle">Chrome 4+</span>
<br>
<img src="assets/img/edge.svg" valign="middle" alt=""> <span valign="middle">Edge 12+</span>
<br>
<img src="assets/img/firefox.svg" valign="middle" alt=""> <span valign="middle">Firefox 3.6+</span>
<br>
<img src="assets/img/safari.svg" valign="middle" alt=""> <span valign="middle">Safari 4+</span>
<br>
<img src="assets/img/ie.svg" valign="middle" alt=""> <span valign="middle">Internet Explorer 10+</span>

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

?> Note the `@` version lock in the URLs above. This prevents breaking changes in future releases from affecting your project and is therefore the safest method of loading dependencies from a CDN. When a new major version is released, you will need to manually update your CDN URLs by changing the version after the `@` symbol.

## Usage

All [HTML canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) tests are performed asynchronously. A failed test will return immediately. Successful test times are dependent upon the canvas dimensions, browser, and hardware.

Test results are available using [promises](#promises) and [callbacks](#callbacks).

### Promises

Each `canvasSize()` [method](#methods) returns a [`Promise Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) (if supported). The promise will will resolve after the first successful canvas test or after all tests have been completed with the following test result data:

```js
{
  success: boolean,  // Status of last test
  width: number,     // Width of last canvas
  height: number,    // Height of last canvas
  testTime: number,  // Time to complete last test
  totalTime: number, // Time to complete all tests
}
```

Test results are provided after the promise has resolved using a `then` handler:

```js
// Use maxArea(), maxHeight(), maxWidth(), or test()
canvasSize
  .test({
    // ...
  })
  .then(results => {
    console.log(results); // { success: <boolean>, ... }
  });
```

Alternatively, the [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) operator can be used to simplify handling asynchronous events. This requires calling `canvasSize` within an [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) or in an environment that supports top-level [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await):

```js
const results = await canvasSize.test({
  // ...
});

console.log(results); // { success: <boolean>, height: <number>, width: <number>, testTime: <number>, totalTime: <number> }
```

[Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) allows for simplified access to test result values:

```js
const { success, width, height } = await canvasSize.test({
  // ...
});

if (success) {
  console.log(`Created canvas: ${width} x ${height}`);
}
```

Promises and [callbacks](#callbacks) can be used together to provide individual test results when multiple tests are being performed:

```js
const { success, width, height } = await canvasSize.maxArea({
  // ...
  onError({ width, height, testTime, totalTime }) {
    console.log('Error', width, height, testTime, totalTime);
  },
});

if (success) {
  console.log('Success', width, height, testTime, totalTime);
}

// Error <width> <height> <testTime> <totalTime>
// Error <width> <height> <testTime> <totalTime>
// Error <width> <height> <testTime> <totalTime>
// ...
// Success <width> <height> <testTime> <totalTime>
```

### Callbacks

Callback functions can be used to access canvas test result instead of or in addition to [promises](#promises). There are three key differences between using `canvasSize` promises and callbacks:

- Legacy browsers without [`Promise Object`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) support must use callbacks.
- [Promises](#promises) and the [`await`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await) operator simplify asynchronous event handling.
- The `onError` callback function provides canvas test results for each failed test when multiple tests are performed using the `maxArea()`, `maxHeight()`, `maxWidth()`, or `test()` [methods](#methods). A promise only projects a single failed test result after all canvas tests have completed.

```js
// maxArea(), maxHeight(), maxWidth(), or test()
canvasSize.maxArea({
  // ...
  onError({ width, height, testTime, totalTime }) {
    console.log('Error', width, height, testTime, totalTime);
  },
  onSuccess({ width, height, testTime, totalTime }) {
    console.log('Success', width, height, testTime, totalTime);
  },
});

// Error <width> <height> <testTime> <totalTime>
// Error <width> <height> <testTime> <totalTime>
// Error <width> <height> <testTime> <totalTime>
// ...
// Success <width> <height> <testTime> <totalTime>
```

Legacy-compatible ES5 syntax:

```js
// maxArea(), maxHeight(), maxWidth(), or test()
canvasSize.maxArea({
  // ...
  onError: function (results) {
    console.log('Error', results);
  },
  onSuccess: function (results) {
    console.log('Success', results);
  },
});

// Error { width: <number>, height: <number>, testTime: <number>, totalTime: <number> }
// Error { width: <number>, height: <number>, testTime: <number>, totalTime: <number> }
// Error { width: <number>, height: <number>, testTime: <number>, totalTime: <number> }
// ...
// Success { width: <number>, height: <number>, testTime: <number>, totalTime: <number> }
```

### Web Workers

Browsers that support [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) and [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/OffscreenCanvas) can have canvas tests performed on a separate thread by setting `useWorker:true`. This can prevent the browser from becoming unresponsive while testing on the browser's main thread.

Note: Browsers without support for web workers and OffscreenCanvas will ignore this option and perform tests on the main thread.

```js
// maxArea(), maxHeight(), maxWidth(), or test()
canvasSize.maxArea({
  // ...
  useWorker: true,
});
```

## Methods

### maxArea

Determines the maximum area/height/width of an HTML canvas element on the client. Returns a [promise](#promises) or `undefined` in legacy browsers.

When `options.max` is not specified, an optimized test will be performed using known maximum area/height/width values from previously tested browsers and platforms (see [Test Results](#test-results) for details). This will return the maximum canvas area/height/width in the shortest amount of time.

When `options.max` is specified, the value will be used for the initial area/height/width test, then reduced by the `options.step` value for each subsequent test until a successful test occurs. This is useful for determining the maximum area/height/width of a canvas element for browser/platform combination not listed in the [Test Results](#test-results) section. Note that lower `options.step` values will provide more accurate results but will require more time to complete due the increased number of tests that will run.

**Options**

- **max**: Maximum canvas height/width to test (area = max \* max)
  - Type: `number`
  - Default: _See description above_
- **min**: Minimum canvas height/width to test (area = min \* min)
  - Type: `number`
  - Default: `1`
- **step**: Value to subtract from test width/height after each failed test
  - Type: `number`
  - Default: `1024`
- **useWorker**: Determines if canvas tests will be performed asynchronously on a separate browser thread. Requires modern browser with [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) support. If web worker and OffscreenCanvas support is not available, tests will be performed on the main browser thread.
  - Type: `boolean`
  - Default: `false`
- **onError**: Callback invoked after each unsuccessful test
  - Type: `function`
  - Arguments:
    1. **width**: Width of canvas element (will be`1` for `maxHeight()`)
    1. **height**: Height of canvas element (will be `1` for `maxWidth()`)
    1. **testTime**: Time to complete last test in milliseconds
    1. **totalTime**: Time to complete all test in milliseconds
- **onSuccess**: Callback invoked after each successful test
  - Type: `function`
  - Arguments:
    1. **width**: Width of canvas element (will be`1` for `maxHeight()`)
    1. **height**: Height of canvas element (will be `1` for `maxWidth()`)
    1. **testTime**: Test execution time in milliseconds
    1. **totalTime**: Time to complete all test in milliseconds

**Examples**

The following examples use `maxArea()`. Usage for `maxHeight()` and `maxWidth()` is identical.

```js
// Optimized tests
const { success, width, height } = await canvasSize.maxArea();
```

```js
// Custom tests with web worker
const { success, width, height } = await canvasSize.maxArea({
  max: 16384,
  min: 1, // default
  step: 1024, // default
  useWorker: true,
});
```

Using callbacks instead of [promises](#promises):

```js
// Optimized tests
canvasSize.maxArea({
  onSuccess({ width, height, testTime, totalTime }) {
    console.log('Success:', width, height, testTime, totalTime);
  },
});

// Custom tests with web worker
canvasSize.maxArea({
  max: 16384,
  min: 1, // default
  step: 1024, // default
  useWorker: true,
  onSuccess({ width, height, testTime, totalTime }) {
    console.log('Success:', width, height, testTime, totalTime);
  },
});
```

### maxHeight

Details are identical to [maxArea](#maxarea) method except for method name:

```js
canvasSize.maxHeight;
```

### maxWidth

Details are identical to [maxArea](#maxarea) method except for method name:

```js
canvasSize.maxWidth;
```

### test

Determines if the dimension(s) specified exceed the HTML canvas size limitations of the browser. Returns a [promise](#promises) or `undefined` in legacy browsers.

To test a single dimension, use `options.width` and `options.height`. To test multiple dimensions, use `options.sizes` to provide an `array` of `[width, height]` combinations (see example below).

**Options**

- **width**: Width of the canvas to test
  - Type: `number`
- **height**: Height of the canvas to test
  - Type: `number`
- **sizes**: A two-dimensional array of canvas dimensions to test
  - Type: `array` (see examples below)
- **useWorker**: Determines if canvas tests will be performed asynchronously on a separate browser thread. Requires modern browser with [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) support. If web worker and OffscreenCanvas support is not available, tests will be performed on the main browser thread.
  - Type: `boolean`
  - Default: `false`
- **onError**: Callback invoked after each unsuccessful test
  - Type: `function`
  - Arguments:
    1. **width**: width of canvas element
    1. **height**: height of canvas element
    1. **testTime**: Time to complete last test in milliseconds
    1. **totalTime**: Time to complete all test in milliseconds
- **onSuccess**: Callback invoked after each successful test
  - Type: `function`
  - Arguments:
    1. **width**: width of canvas element
    1. **height**: height of canvas element
    1. **testTime**: Time to complete last test in milliseconds
    1. **totalTime**: Time to complete all test in milliseconds

**Returns**

- `boolean` when testing a single dimension. Returns `true` if the dimensions are within the browser's size limitations or `false` when exceeded.

**Examples**

```js
// Single test
const { success } = await canvasSize.test({
  height: 16384,
  width: 16384,
});
```

```js
// Multiple tests with web worker
const { success, width, height } = await canvasSize.test({
  sizes: [
    [16384, 16384],
    [8192, 8192],
    [4096, 4096],
    useWorker: true,
  ],
});
```

Using callbacks:

```js
// Single test
canvasSize.test({
  height: 16384,
  width: 16384,
  onError({ width, height, testTime, totalTime }) {
    console.log('Error:', width, height, testTime, totalTime);
  },
  onSuccess({ width, height, testTime, totalTime }) {
    console.log('Success:', width, height, testTime, totalTime);
  },
});
```

```js
// Multiple tests with web worker
canvasSize.test({
  sizes: [
    [16384, 16384],
    [8192, 8192],
    [4096, 4096],
  ],
  useWorker: true,
  onError({ width, height, testTime, totalTime }) {
    console.log('Error:', width, height, testTime, totalTime);
  },
  onSuccess({ width, height, testTime, totalTime }) {
    console.log('Success:', width, height, testTime, totalTime);
  },
});
```

## Test Results

Tests were conducted using virtualized device courtesy of [BrowserStack](https://www.browserstack.com/). Results may vary on actual hardware.

### Desktop

| Browser (OS)              | Max Width | Max Height |              Max Area (Total) |
| ------------------------- | --------: | ---------: | ----------------------------: |
| Chrome >= 73 (Mac, Win)   |    65,535 |     65,535 | 16,384 x 16,384 (268,435,456) |
| Chrome <= 72 (Mac, Win)   |    32,767 |     32,767 | 16,384 x 16,384 (268,435,456) |
| Edge >= 80 (Mac, Win)     |    65,535 |     65,535 | 16,384 x 16,384 (268,435,456) |
| Edge <= 18 (Win)          |    16,384 |     16,384 | 16,384 x 16,384 (268,435,456) |
| Firefox >= 122 (Mac, Win) |    32,767 |     32,767 | 23,168 x 23,168 (536,756,224) |
| Firefox >= 60 (Mac, Win)  |    32,767 |     32,767 | 11,180 x 11,180 (124,992,400) |
| IE 11 (Win)               |    16,384 |     16,384 |    8,192 x 8,192 (67,108,864) |
| IE 9 - 10 (Win)           |     8,192 |      8,192 |    8,192 x 8,192 (67,108,864) |
| Safari >= 5 (Mac)         | 4,194,303 |  8,388,607 | 16,384 x 16,384 (268,435,456) |

### Mobile

Be aware that test results can vary between mobile devices running the same platform/browser combination, most notably on older devices with less capable hardware.

| Browser (OS)                | Max Width | Max Height |              Max Area (Total) |
| --------------------------- | --------: | ---------: | ----------------------------: |
| Chrome 91 (Android 8 - 11)  |    65,535 |     65,535 | 16,384 x 16,384 (268,435,456) |
| Chrome 91 (Android 7)       |    65,535 |     65,535 | 14,188 x 14,188 (201,299,344) |
| Chrome 91 (Android 6)       |    65,535 |     65,535 | 16,384 x 16,384 (268,435,456) |
| Chrome 91 (Android 5)       |    65,535 |     65,535 | 11,180 x 11,180 (124,992,400) |
| Chrome 68 (Android 7.1 - 9) |    32,767 |     32,767 | 14,188 x 14,188 (201,299,344) |
| Chrome 68 (Android 6)       |    32,767 |     32,767 | 10,836 x 10,836 (117,418,896) |
| Chrome 68 (Android 5)       |    32,767 |     32,767 | 11,402 x 11,402 (130,005,604) |
| IE (Windows Phone 8.x)      |     4,096 |      4,096 |    4,096 x 4,096 (16,777,216) |
| Safari (iOS >= 9)           | 4,194,303 |  8,388,607 |    4,096 x 4,096 (16,777,216) |

## Known Issues

1. **Some browsers become unresponsive during tests**

   This is a result of the single-threaded nature of JavaScript and the time required to read data from large HTML canvas elements on the client. To accommodate for the brief delay that may occur when testing extremely large canvas sizes, consider the following:

   - Call the library when tests are least likely to affect the overall user experience.
   - [Cache test results on the client](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage) so that tests only need to be performed once per browser.

1. **Virtual environments may produce inconsistent results**

   Tests conducted on virtual machines may produce results that differ from actual hardware. This is to be expected, as the virtualized hardware used in these environments can impose its own unique size limitations separate from the browser.

   In some virtualized environments (mostly with older browsers), canvas-size may produce inconsistent results or fail all tests when calling `maxArea()`, `maxHeight()`, `maxWidth()`, and `test()` using `options.sizes`. This is a result of the virtual GPU failing after a test canvas exceeds the browser's size limitations, causing all subsequent tests to fail even for canvas dimensions that are actually supported by the browser. The easiest and most reliable way to address these issues is to use a GPU-optimized virtual machine. If this isn't possible and your VM only supports software rendering, avoid iterating over canvas dimensions that exceed the browser's size limitations and instead specify dimensions that are known to be supported by the browser.

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
