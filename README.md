# canvas-size

[![NPM](https://img.shields.io/npm/v/canvas-size.svg?style=flat-square)](https://www.npmjs.com/package/canvas-size)
[![Build Status](https://img.shields.io/travis/jhildenbiddle/canvas-size/master.svg?style=flat-square)](https://travis-ci.org/jhildenbiddle/canvas-size)
[![Codacy](https://img.shields.io/codacy/grade/d5203341ed494f6c9b877d93e0daf458.svg?style=flat-square)](https://www.codacy.com/app/jhildenbiddle/canvas-size?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jhildenbiddle/canvas-size&amp;utm_campaign=Badge_Grade)
[![Codecov](https://img.shields.io/codecov/c/github/jhildenbiddle/canvas-size.svg?style=flat-square)](https://codecov.io/gh/jhildenbiddle/canvas-size)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/canvas-size/blob/master/LICENSE)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/canvas-size/badge)](https://www.jsdelivr.com/package/npm/canvas-size)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fcanvas-size&hashtags=canvas,developers,frontend,javascript)

Determine the maximum size of an HTML canvas element and test support for custom canvas dimensions.

- [Demo](https://on690.codesandbox.io) for modern browsers (CodeSandbox)
- [Demo](https://jsbin.com/megedep/1/edit?js,output) for legacy browsers (JSBin)

## Features

- Determine the maximum area, height, and width of a canvas element
- Test custom canvas dimensions
- ES6 Promise support
- Web Worker and OffscreenCanvas support
- UMD and ES6 module available
- Lightweight (< 1k min+gzip) and dependency-free

**Browser Support**

| IE   | Edge | Chrome | Firefox | Safari |
| ---- | ---- | ------ | ------- | ------ |
| 9+   | 12+  | 4+     | 3.6+    | 4+     |

------

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Methods](#methods)
- [Test Results](#test-results)
- [Known Issues](#known-issues)
- [Contact](#contact)
- [License](#license)

------

## Description

The [HTML canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element is [widely supported](http://caniuse.com/#feat=canvas) by modern and legacy browsers, but each browser and platform combination imposes [unique size limitations](#test-results) that will render a canvas unusable when exceeded. Unfortunately, browsers do not provide a way to determine what their limitations are, nor do they provide any kind of feedback after an unusable canvas has been created. This makes working with large canvas elements a challenge, especially for applications that support a variety of browsers and platforms.

This micro-library provides the maximum area, height, and width of an HTML canvas element supported by the browser as well as the ability to test custom canvas dimensions. By collecting this information *before* a new canvas element is created, applications are able to reliably set canvas dimensions within the size limitations of each browser/platform.

## Installation

NPM:

```bash
npm install canvas-size
```

Git:

```bash
git clone https://github.com/jhildenbiddle/canvas-size.git
```

CDN ([jsdelivr.com](https://www.jsdelivr.com/) shown, also on [unpkg.com](https://unpkg.com/)):

```html
<!-- ES5 (latest v1.x.x) -->
<script src="https://cdn.jsdelivr.net/npm/canvas-size@1"></script>
```

```html
<!-- ES6 Module (latest v1.x.x) -->
<script type="module">
  import canvasSize from 'https://cdn.jsdelivr.net/npm/canvas-size@1/dist/canvas-size.esm.min.js';

  // Do stuff...
</script>
```

## Usage

**Single tests**

Single tests return a `boolean` to indicate if the specified canvas dimensions are supported by the browser. Failed tests will return almost immediately. Successful tests times are dependent upon the browser, hardware, and canvas dimensions used.

```js
var isValidCanvas = canvasSize.test({
  width : 8192,
  height: 8192
});

console.log(isValidCanvas); // true|false
```

**Multiple tests using callbacks**

When multiple tests are performed using `maxArea()`, `maxHeight()`, `maxWidth()`, or `test()` with multiple `sizes` defined, the `onError` callback will be invoked for each failed test until the first successful test invokes the `onSuccess` callback.

```js
canvasSize.maxArea({
  onError: function(width, height, benchmark) {
    console.log('Error', width, height, benchmark);
  },
  onSuccess: function(width, height, benchmark) {
    console.log('Success', width, height, benchmark);
  }
});

// Error 16387 16387 0.001
// Error 16386 16386 0.001
// Error 16385 16385 0.001
// Success 16384 16384 0.500
```

**Multiple tests using Promises**

Browsers with ES6 [Promise](https://www.google.com/search?client=safari&rls=en&q=js+promise&ie=UTF-8&oe=UTF-8) support (native or via polyfill) can set `usePromise:true` to handle test results using `promise.then()` and `promise.catch()` methods instead of using callbacks. Although promises are typically used for asynchronous tasks, canvas tests will still be synchronous when `usePromise` is `true` due to testing requirements, performance implications, and browser compatibility. For asynchronous canvas tests, see the next section.

```js
canvasSize.maxArea({
  usePromise: true
})
.then(function(result) {
  console.log('Success', result);
});
.catch(function(result) {
  console.log('Error', result);
});

// Success { width: 16384, height: 16384, benchmark: 0.500 }
// or
// Error { width: 1, height: 1, benchmark: 0.001 }
```

**Asynchronous tests using Web Workers & OffscreenCanvas**

Browsers that support [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers) and [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/OffscreenCanvas) can set `useWorker:true` to have canvas tests performed asynchronously on a separate thread. This can prevent the browser from becoming unresponsive while testing on the browser's main thread. Browser without support for web workers and OffscreenCanvas will ignore this option and perform tests synchronously as described above.

Unfortunately, at this time [browser support for OffscreenCanvas](https://caniuse.com/#feat=offscreencanvas) is limited. In addition, canvas tests that fail immediately on the main thread can take significantly more time using the OffscreenCanvas API (most likely a bug during these early days of OffscreenCanvas support). As a result, the `useWorker` option can improve application performance by reducing the workload on the main browser thread, but doing so will result in longer test times.

```javascript
canvasSize.maxArea({
  useWorker: true,
  onError(width, height, benchmark) {
    console.log('Error', width, height, benchmark);
  },
  onSuccess(width, height, benchmark) {
    console.log('Success', width, height, benchmark);
  }
});

// Error 16387 16387 0.001
// Error 16386 16386 0.001
// Error 16385 16385 0.001
// Success 16384 16384 0.500
```

The `useWorker` option can be combined with the `usePromise` option if preferred.

```js
canvasSize.maxArea({
  usePromise: true,
  useWorker: true,
})
.then(function(result) {
  console.log('Success', result);
});
.catch(function(result) {
  console.log('Error', result);
});

// Success { width: 16384, height: 16384, benchmark: 0.500 }
// or
// Error { width: 1, height: 1, benchmark: 0.001 }
```

## Methods

### maxArea()

### maxHeight()

### maxWidth()

Determines the maximum area/height/width of an HTML canvas element on the client.

When `options.max` is unspecified, an optimized test will be performed using known maximum area/height/width values from previously tested browsers and platforms (see [Test Results](#test-results) for details). This will return the maximum canvas area/height/width for in the shortest amount of time.

When `options.max` is specified, the value will be used for the initial area/height/width test, then reduced by the `options.step` value for each subsequent test until a successful test occurs. This is useful for determining the maximum area/height/width of a canvas element for browser/platform combination not listed in the [Test Results](#test-results) section. Note that lower `options.step` values will provide more granular (and therefore potentially more accurate) results, but will require more time to complete due the increased number of tests that will run.

Callbacks are invoked after each test.

**Options**

- **max**: Maximum canvas height/width to test (area = max * max)
  - Type: `number`
  - Default: *See description above*
- **min**: Minimum canvas height/width to test (area = min * min)
  - Type: `number`
  - Default: `1`
- **step**: Value to subtract from test width/height after each failed test
  - Type: `number`
  - Default: `1024`
- **usePromise**: Determines if the method call will return an ES6 Promise. The return value for both `resolve()` and `reject()` will be an object containing `width`, `height`, and `benchmark` properties (see onError/onSuccess for value details). Requires ES6 [Promise](https://www.google.com/search?client=safari&rls=en&q=js+promise&ie=UTF-8&oe=UTF-8) support (native or via polyfill for legacy browsers).
  - Type: `boolean`
  - Default: `false`
- **useWorker**: Determines if canvas tests will be performed asynchronously on a separate browser thread. Requires modern browser with [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) support.
  - Type: `boolean`
  - Default: `false`
- **onError**: Callback invoked after each unsuccessful test
  - Type: `function`
  - Arguments:
    1. **width**: Width of canvas element (will be`1` for `maxHeight()`)
    1. **height**: Height of canvas element (will be `1` for `maxWidth()`)
    1. **benchmark**: Test execution time in milliseconds
- **onSuccess**: Callback invoked after each successful test
  - Type: `function`
  - Arguments:
    1. **width**: Width of canvas element (will be`1` for `maxHeight()`)
    1. **height**: Height of canvas element (will be `1` for `maxWidth()`)
    1. **benchmark**: Test execution time in milliseconds

**Examples**

The following examples use `maxArea()`. Usage for `maxHeight()` and `maxWidth()` is identical.

Using callbacks:

```javascript
// Default (optimized sizes)
canvasSize.maxArea({
  onError: function(width, height, benchmark) {
    console.log('Error:', width, height, benchmark);
  },
  onSuccess: function(width, height, benchmark) {
    console.log('Success:', width, height, benchmark);
  }
});

// Custom sizes
canvasSize.maxArea({
  max : 16384,
  min : 1,     // default
  step: 1024,  // default
  onError: function(width, height, benchmark) {
    console.log('Error:', width, height, benchmark);
  },
  onSuccess: function(width, height, benchmark) {
    console.log('Success:', width, height, benchmark);
  }
});
```

Using ES6 Promises:

```javascript
// Default (optimized sizes)
canvasSize.maxArea({
  usePromise: true
})
.then(({ width, height, benchmark }) => {
  console.log(`Success: ${width} x ${height} (${benchmark} ms)`);
});
.catch(({ width, height, benchmark }) => {
  console.log(`Error: ${width} x ${height} (${benchmark} ms)`);
});

// Custom sizes
canvasSize.maxArea({
  max       : 16384,
  min       : 1,     // default
  step      : 1024,  // default
  usePromise: true
})
.then(({ width, height, benchmark }) => {
  console.log(`Success: ${width} x ${height} (${benchmark} ms)`);
});
.catch(({ width, height, benchmark }) => {
  console.log(`Error: ${width} x ${height} (${benchmark} ms)`);
});
```

### test()

Determines if the dimension(s) specified exceed the HTML canvas size limitations of the browser.

To test a single dimension, use `options.width` and `options.height`. A `boolean` will be returned to indicate if the dimensions are within the browser's size limitations. To test multiple dimensions, use `options.sizes` to provide an `array` of `[width, height]` combinations to be tested (see example below). Callbacks are invoked after each test.

**Options**

- **width**: Width of the canvas to test
  - Type: `number`
- **height**: Height of the canvas to test
  - Type: `number`
- **sizes**: A two-dimensional array of canvas dimensions to test
  - Type: `array` (see examples below)
- **usePromise**: Determines if the method call will return an ES6 Promise. The return value for both `resolve()` and `reject()` will be an object containing `width`, `height`, and `benchmark` properties (see onError/onSuccess for value details). Requires ES6 [Promise](https://www.google.com/search?client=safari&rls=en&q=js+promise&ie=UTF-8&oe=UTF-8) support (native or via polyfill for legacy browsers).
  - Type: `boolean`
  - Default: `false`
- **useWorker**: Determines if canvas tests will be performed asynchronously on a separate browser thread. Requires modern browser with [web worker](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) and [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) support.
  - Type: `boolean`
  - Default: `false`
- **onError**: Callback invoked after each unsuccessful test
  - Type: `function`
  - Arguments:
    1. **width**: width of canvas element
    1. **height**: height of canvas element
    1. **benchmark**: Test execution time in milliseconds
- **onSuccess**: Callback invoked after each successful test
  - Type: `function`
  - Arguments:
    1. **width**: width of canvas element
    1. **height**: height of canvas element
    1. **benchmark**: Test execution time in milliseconds

**Returns**

- `boolean` when testing a single dimension. Returns `true` if the dimensions are within the browser's size limitations or `false` when exceeded.

**Examples**

Using return value:

```javascript
// Single dimension
var isValidCanvasSize = canvasSize.test({
  height: 16384,
  width : 16384
});

console.log(isValidCanvasSize); // true/false
```

Using callbacks:

```javascript
// Multiple dimensions
canvasSize.test({
  sizes: [
    [16384, 16384],
    [8192, 8192],
    [4096, 4096]
  ],
  onError: function(width, height, benchmark) {
    console.log('Error:', width, height);
  },
  onSuccess: function(width, height, benchmark) {
    console.log('Success:', width, height);
  }
});
```

Using ES6 Promises:

```javascript
// Multiple dimensions
canvasSize.test({
  sizes: [
    [16384, 16384],
    [8192, 8192],
    [4096, 4096]
  ]
  usePromise: true
})
.then(({ width, height, benchmark }) => {
  console.log(`Success: ${width} x ${height} (${benchmark} ms)`);
});
.catch(({ width, height, benchmark }) => {
  console.log(`Error: ${width} x ${height} (${benchmark} ms)`);
});
```

## Test Results

Tests conducted using [BrowserStack](https://www.browserstack.com/) virtualized device are denoted with an asterisk (`*`). Results from these tests may vary from actual hardware.

### Desktop

| Browser (OS)            | Max Width | Max Height |          Max Area (Total) |
| ----------------------- | --------: | ---------: | ----------------------------: |
| Chrome 83 (Mac, Win *)  |    65,535 |     65,535 | 16,384 x 16,384 (268,435,456) |
| Chrome 70 (Mac, Win *)  |    32,767 |     32,767 | 16,384 x 16,384 (268,435,456) |
| Edge 17 *               |    16,384 |     16,384 | 16,384 x 16,384 (268,435,456) |
| Firefox 63 (Mac, Win *) |    32,767 |     32,767 | 11,180 x 11,180 (124,992,400) |
| IE 11 *                 |    16,384 |     16,384 |   8,192 x 8,192  (67,108,864) |
| IE 9 - 10 *             |     8,192 |      8,192 |   8,192 x 8,192  (67,108,864) |
| Safari 7 - 12           | 4,194,303 |  8,388,607 | 16,384 x 16,384 (268,435,456) |

### Mobile

| Browser (OS)                  | Max Width | Max Height |          Max Area (Total) |
| ----------------------------- | --------: | ---------: | ----------------------------: |
| Chrome 68 (Android 9) *       |    32,767 |     32,767 | 14,188 x 14,188 (201,299,344) |
| Chrome 68 (Android 7.1 - 8) * |    32,767 |     32,767 | 14,188 x 14,188 (201,299,344) |
| Chrome 68 (Android 6)         |    32,767 |     32,767 | 10,836 x 10,836 (117,418,896) |
| Chrome 68 (Android 5) *       |    32,767 |     32,767 | 11,402 x 11,402 (130,005,604) |
| Chrome 68 (Android 4.4) *     |    32,767 |     32,767 | 16,384 x 16,384 (268,435,456) |
| IE (Windows Phone 8.x)        |     4,096 |      4,096 |  4,096 x  4,096  (16,777,216) |
| Safari (iOS 9 - 12)           | 4,194,303 |  8,388,607 |  4,096 x  4,096  (16,777,216) |

## Known Issues

1. **Some browsers become unresponsive during tests**

   This is a result of the single-threaded nature of JavaScript and the time required to read data from large HTML canvas elements on the client. To accommodate for the brief delay that may occur when testing extremely large canvas sizes, consider the following:

   - Call the library when tests are least likely to affect the overall user experience.
   - [Cache test results on the client](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage) so that tests only need to be performed once per browser.

1. **Virtual environments may produce inconsistent results**

   Tests conducted on virtual machines may produce results that differ from actual hardware. This is to be expected, as the virtualized hardware used in these environments can impose its own unique size limitations.

   In some virtualized environments (mostly with older browsers and operating systems), canvas-size may produce inconsistent results or fail all tests when calling `maxArea()`, `maxHeight()`, `maxWidth()`, and `test()` using `options.sizes`. This is a result of the virtual GPU failing after a test canvas exceeds the browser's size limitations, causing all subsequent tests to fail even for canvas dimensions that are actually supported by the browser. In these scenarios, avoid iterating over canvas dimensions that exceed the browser's size limitations, and instead specify dimensions that are known to be supported by the browser. Supported dimensions can be detected manually by calling `test()` using `options.width` and `options.height`.

## Contact

- Create a [Github issue](https://github.com/jhildenbiddle/canvas-size/issues) for bug reports, feature requests, or questions
- Follow [@jhildenbiddle](https://twitter.com/jhildenbiddle) for announcements
- Add a ⭐️ [star on GitHub](https://github.com/jhildenbiddle/canvas-size) or ❤️ [tweet](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fcanvas-size&hashtags=css,developers,frontend,javascript) to support the project!

## License

This project is licensed under the MIT License. See the [MIT LICENSE](https://github.com/jhildenbiddle/canvas-size/blob/master/LICENSE) for details.

Copyright (c) John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
