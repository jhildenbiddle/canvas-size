# Change Log

## 1.2.4

*2021-04-26*

- Fix `maxArea()` test order for more accurate results in Firefox (#12)

## 1.2.3

*2021-03-03*

- Fix handling of floating point sizes in Webkit-based browsers (e.g. Safari)

## 1.2.2

*2021-01-28*

- Fix reference error after minification (#5, #6)

## 1.2.1

*2020-11-11*

- Fix web worker bug in minified esm distributable (#5, #6)

## 1.2.0

*2020-06-18*

- Add `useWorker` option which allows canvas tests to be performed asynchronously on a separate thread (requires Web Worker and OffscreenCanvas support)
- Add "Usage" section to the documentation
- Remove `requestAnimationFrame` from canvas test loop

## 1.1.0

*2020-05-31*

- Add `usePromise` option which allows the use of standard `then()`, `catch()`, and `finally()` promise methods or `async` functions in modern browsers (legacy browsers will require a promise polyfill and transpilation to ES5 for `async` functions)
- Add `benchmark` return value to `onError()` and `onSuccess()` callbacks
- Add new Chrome/Blink height/width limitation to canvas test sizes (#2)
- Add invocation of callbacks when testing a single dimension
- Fix bug that incorrectly set the last item in a generated array of test dimensions to an area test ([dimension, dimension]) instead of a width ([width, 1]) or height ([1, height]) test
- Update method of reading/writing to canvas elements, resulting in a significant performance increase
- Update dependencies

## 1.0.4

*2019-04-08*

- Fix memory consumption

## 1.0.3

*2019-01-08*

- Update unit test configuration (Karma & Travis)
- Update dependencies

## 1.0.2

*2018-12-23*

- Update preferred CDN link to jsdelivr

## 1.0.0

*2018-12-06*

- Initial release
