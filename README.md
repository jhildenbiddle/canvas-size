# canvas-size

[![NPM](https://img.shields.io/npm/v/canvas-size.svg?style=flat-square)](https://www.npmjs.com/package/canvas-size)
[![Build Status](https://img.shields.io/travis/jhildenbiddle/canvas-size.svg?style=flat-square)](https://travis-ci.org/jhildenbiddle/canvas-size)
[![Codacy](https://img.shields.io/codacy/grade/d5203341ed494f6c9b877d93e0daf458.svg?style=flat-square)](https://www.codacy.com/app/jhildenbiddle/canvas-size?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jhildenbiddle/canvas-size&amp;utm_campaign=Badge_Grade)
[![Codecov](https://img.shields.io/codecov/c/github/jhildenbiddle/canvas-size.svg?style=flat-square)](https://codecov.io/gh/jhildenbiddle/canvas-size)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://github.com/jhildenbiddle/canvas-size/blob/master/LICENSE)
[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?url=https%3A%2F%2Fgithub.com%2Fjhildenbiddle%2Fcanvas-size&hashtags=canvas,developers,frontend,javascript)

Determine the maximum size of an HTML canvas element and support for custom canvas dimensions.

## Description

The [HTML canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) element is [widely supported](http://caniuse.com/#feat=canvas) by modern and legacy browsers, but each browser and platform combination imposes [unique size limitations](#test-results) that will render a canvas unusable when exceeded. Unfortunately, browsers do not provide a way to determine what their limitations are, nor do they provide any kind of feedback after an unusable canvas has been created. This makes working with large canvas elements a challenge, especially for applications that support a variety of browsers and platforms.

This micro-library provides the maximum area, height, and width of an HTML canvas element supported by the browser as well as the ability to test custom canvas dimensions. By collecting this information *before* a new canvas element is created, applications are able to reliably set canvas dimensions within the size limitations of each browser/platform.

------

- [Features](#features)
- [Installation](#installation)
- [Methods](#methods)
- [Test Results](#test-results)
- [Known Issues](#known-issues)
- [Contact](#contact)
- [License](#license)

------

## Features

- Determine the maximum area, height, and width of a canvas element
- Test support for custom canvas element dimensions
- UMD and ES6 module available
- Lightweight (< 1k min+gzip) and dependency-free

## Installation

NPM:

```bash
npm install canvas-size
```

Git:

```bash
git clone https://github.com/jhildenbiddle/canvas-size.git
```

CDN ([unpkg.com](https://unpkg.com/) shown, also on [jsdelivr.net](https://www.jsdelivr.com/package/npm/canvas-size)):

```html
// ES5
<script src="https://unpkg.com/canvas-size@1"></script>
```

```html
// ES6 Module
<script type="module">
  import canvasSize from 'https://unpkg.com/canvas-size@1/dist/canvas-size.esm.min.js';

  // Do stuff...
</script>
```

## Methods

### maxArea()

### maxHeight()

### maxWidth()

Determines the maximum area/height/width of an HTML canvas element on the client.

When `options.max` is unspecified, an optimized test will be performed using known maximum area/height/width values from previously tested browsers and platforms (see [Test Results](#test-results) for details). This will return the maximum canvas area/height/width for all major browsers in the shortest amount of time.

When `options.max` is specified, the value will be used for the initial area/height/width test, then reduced by the `options.step` value for each subsequent test until a successful test pass. This is useful for determining the maximum area/height/width of a canvas element for browser/platform combination not listed in the [Test Results](#test-results) section. Note that lower `options.step` values will provide more accurate results, but will require more time to complete due the increased number of tests that will run.

**Options**

- **max**: Maximum canvas height/width to test (area = max * max)
  - Type: `number`
  - Default: *See description above*
- **min**: Minimum canvas height/width to test (area = max * max)
  - Type: `number`
  - Default: `1`
- **step**: Value to subtract from test height/width after each failed test
  - Type: `number`
  - Default: `1024`
- **onError**: Callback invoked after each unsuccessful test
  - Type: `function`
  - Arguments:
    1. **width**: Width of canvas element (will be`1` for `maxHeight()`)
    1. **height**: Height of canvas element (will be `1` for `maxWidth()`)
- **onSuccess**: Callback invoked after each successful test
  - Type: `function`
  - Arguments:
    1. **width**: Width of canvas element (will be`1` for `maxHeight()`)
    1. **height**: Height of canvas element (will be `1` for `maxWidth()`)

**Examples**

The following examples use `canvasSize.maxArea()`. Usage for `maxHeight()` and `maxWidth()` is identical.

```javascript
// Default (optimized sizes)
canvasSize.maxArea({
  onError: function(width, height) {
    console.log('Error:', width, height);
  },
  onSuccess: function(width, height) {
    console.log('Success:', width, height);
  }
});

// Custom sizes
canvasSize.maxArea({
  max : 16384,
  min : 1,     // default
  step: 1024,  // default
  onError: function(width, height) {
    // 1: 16384,16384 (max)
    // 2: 15360,15360 (max - 1024)
    // 3: 14336,14336 (max - 2048)
    console.log('Error:', width, height);
  },
  onSuccess: function(width, height) {
    // 4: 13312,13312 (max - 3072)
    console.log('Success:', width, height);
  }
});
```

### test()

Determines if the dimension(s) specified exceed the HTML canvas size limitations of the browser.

To test a single dimension, use `options.width` and `options.height`. Callbacks are ignored when testing a single dimension, and a `boolean` is returned to indicate if the dimensions are within the browser's size limitations.

To test multiple dimensions, use `options.sizes` to provide an `array` of `[width, height]` combinations to be tested (see example below). Callbacks are invoked after each test.

**Options**

- **width**: Width of the canvas to test
  - Type: `number`
- **height**: Height of the canvas to test
  - Type: `number`
- **sizes**: A two-dimensional array of canvas dimensions to test
  - Type: `array` (see examples below)
- **onError**: Callback invoked after each unsuccessful test
  - Type: `function`
  - Arguments:
    1. **width**: width of canvas element
    1. **height**: height of canvas element
- **onSuccess**: Callback invoked after each successful test
  - Type: `function`
  - Arguments:
    1. **width**: width of canvas element
    1. **height**: height of canvas element

**Returns**

* `boolean` when testing single dimension using `options.width` and `options.height`. Returns `true` if the dimensions are within the browser's size limitations or `false` when exceeded.

**Examples**

```javascript
// Single dimension
var result = canvasSize.test({
  height: 16384,
  width : 16384
});

console.log(result); // true/false

// Multiple dimensions
canvasSize.test({
  sizes: [
    [16384, 16384],
    [8192, 8192],
    [4096, 4096]
  ],
  onError: function(width, height) {
    // 1: 16384,16384
    // 2: 8192,8192
    console.log('Error:', width, height);
  },
  onSuccess: function(width, height) {
    // 3: 4096,4096
    console.log('Success:', width, height);
  }
});
```

## Test Results

### Desktop

| Browser (OS)            | Max Width | Max Height |          Max Area (Test Size) |
| ----------------------- | --------: | ---------: | ----------------------------: |
| Chrome 70 (Mac, Win*)   |    32,767 |     32,767 | 268,435,456 (16,384 x 16,384) |
| Edge 17 *               |    16,384 |     16,384 | 268,435,456 (16,384 x 16,384) |
| Firefox 63 (Mac, Win *) |    32,767 |     32,767 | 124,992,400 (11,180 x 11,180) |
| IE 11 *                 |    16,384 |     16,384 |    67,108,864 (8,192 x 8,192) |
| IE 9 - 10 *             |     8,192 |      8,192 |    67,108,864 (8,192 x 8,192) |
| Safari 7 - 12           | 4,194,303 |  8,388,607 | 268,435,456 (16,384 x 16,384) |

\* Tests conducted using [BrowserStack](https://www.browserstack.com/) virtualized device. Results from actual hardware may vary.

### Mobile

| Browser (OS)                  | Max Width | Max Height |          Max Area (Test Size) |
| ----------------------------- | --------: | ---------: | ----------------------------: |
| Chrome 68 (Android 9) *       |    32,767 |     32,767 | 201,299,344 (14,188 x 14,188) |
| Chrome 68 (Android 7.1 - 8) * |    32,767 |     32,767 | 201,299,344 (14,188 x 14,188) |
| Chrome 68 (Android 6)         |    32,767 |     32,767 | 117,418,896 (10,836 x 10,836) |
| Chrome 68 (Android 5) *       |    32,767 |     32,767 | 130,005,604 (11,402 x 11,402) |
| Chrome 68 (Android 4.4) *     |    32,767 |     32,767 | 268,435,456 (16,384 x 16,384) |
| IE (Windows Phone 8.x)        |     4,096 |      4,096 |    16,777,216 (4,096 x 4,096) |
| Safari (iOS 9 - 12)           | 4,194,303 |  8,388,607 |    16,777,216 (4,096 x 4,096) |

\* Tests conducted using [BrowserStack](https://www.browserstack.com/) virtualized device. Results from actual hardware may vary.

## Known Issues

1. **Some browsers become unresponsive during tests**

   This is a result of the single-threaded nature of JavaScript and the time required to read data from large HTML canvas elements on the client.

   If/when support for [OffscreenCanvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) is added to the library, this will no longer be an issue for modern browsers as all canvas work will be handled by a [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) on a separate thread. Until then, consider the following options:

   - Display a progress indicator to inform users that the application is in a working state.
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

Copyright (c) 2018 John Hildenbiddle ([@jhildenbiddle](https://twitter.com/jhildenbiddle))
