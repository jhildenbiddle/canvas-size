# Change Log

## 2.0.0

_Unreleased_

- ❗️ Breaking: All tests are now performed asynchronously
- ❗️ Breaking: Fix recursion error in some browsers when testing a large number of canvas sizes
- ❗️ Breaking: Update promise behavior to always resolve leaving `catch` for exceptions
- ❗️ Breaking: Update callback functions to receive results object instead of separate arguments
- ❗️ Breaking: Remove `usePromise` option and return promise automatically if supported
- Add `success` property to promise results
- Add `testTime` and `totalTime` to callback and promise results
- Update ES module build from ES5 to ES2015+ syntax
- Update test environment and migrate tests to Playwright
- Update documentation
- Update CI

## 1.2.6

_2023-02-24_

- Fix Safari canvas memory usage (#16)

## 1.2.5

_2021-09-04_

- Update badges in documentation
- Update browser test results (#14)
- Replace Travis CI with GitHub CI

## 1.2.4

_2021-04-26_

- Fix `maxArea()` test order for more accurate results in Firefox (#12)

## 1.2.3

_2021-03-03_

- Fix handling of floating point sizes in Webkit-based browsers (e.g. Safari)

## 1.2.2

_2021-01-28_

- Fix reference error after minification (#5, #6)

## 1.2.1

_2020-11-11_

- Fix web worker bug in minified esm distributable (#5, #6)

## 1.2.0

_2020-06-18_

- Add `useWorker` option which allows canvas tests to be performed asynchronously on a separate thread (requires Web Worker and OffscreenCanvas support)
- Add "Usage" section to the documentation
- Remove `requestAnimationFrame` from canvas test loop

## 1.1.0

_2020-05-31_

- Add `usePromise` option which allows the use of standard `then()`, `catch()`, and `finally()` promise methods or `async` functions in modern browsers (legacy browsers will require a promise polyfill and transpilation to ES5 for `async` functions)
- Add `benchmark` return value to `onError()` and `onSuccess()` callbacks
- Add new Chrome/Blink height/width limitation to canvas test sizes (#2)
- Add invocation of callbacks when testing a single dimension
- Fix bug that incorrectly set the last item in a generated array of test dimensions to an area test ([dimension, dimension]) instead of a width ([width, 1]) or height ([1, height]) test
- Update method of reading/writing to canvas elements, resulting in a significant performance increase
- Update dependencies

## 1.0.4

_2019-04-08_

- Fix memory consumption

## 1.0.3

_2019-01-08_

- Update unit test configuration (Karma & Travis)
- Update dependencies

## 1.0.2

_2018-12-23_

- Update preferred CDN link to jsdelivr

## 1.0.0

_2018-12-06_

- Initial release
