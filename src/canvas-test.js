/* eslint-env browser, worker */

/**
 * Tests ability to read pixel data from canvas elements of various dimensions
 * by decreasing canvas height and/or width until a test succeeds.
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * IMPORTANT: DO NOT USE ES6 CODE THAT REQUIRES BABEL HELPERS IN THIS FILE.
 *            This function will be used on the main thread and as part of an
 *            inline web worker, but access to Babel helpers will be available
 *            only on the main thread.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * @param {object} settings
 * @param {number[][]} settings.sizes
 * @param {function} settings.onError
 * @param {function} settings.onSuccess
 */
function canvasTest(settings) {
  const size = settings.sizes.shift();
  const width = Math.max(Math.ceil(size[0]), 1);
  const height = Math.max(Math.ceil(size[1]), 1);
  const fill = [width - 1, height - 1, 1, 1]; // x, y, width, height
  const testTimeStart = performance.now();
  const isWorker =
    typeof WorkerGlobalScope !== 'undefined' &&
    self instanceof WorkerGlobalScope;

  let cropCvs, testCvs;

  if (isWorker) {
    cropCvs = new OffscreenCanvas(1, 1);
    testCvs = new OffscreenCanvas(width, height);
  } else {
    cropCvs = document.createElement('canvas');
    cropCvs.width = 1;
    cropCvs.height = 1;
    testCvs = document.createElement('canvas');
    testCvs.width = width;
    testCvs.height = height;
  }

  const cropCtx = cropCvs.getContext('2d');
  const testCtx = testCvs.getContext('2d');

  if (testCtx) {
    testCtx.fillRect.apply(testCtx, fill);

    // Render the test pixel in the bottom-right corner of the
    // test canvas in the top-left of the 1x1 crop canvas. This
    // dramatically reducing the time for getImageData to complete.
    cropCtx.drawImage(testCvs, width - 1, height - 1, 1, 1, 0, 0, 1, 1);
  }

  // Verify image data (Pass = 255, Fail = 0)
  const isTestPass = cropCtx && cropCtx.getImageData(0, 0, 1, 1).data[3] !== 0;
  const testTime = parseInt(performance.now() - testTimeStart);

  // Release canvas elements (Safari memory usage fix)
  // See: https://stackoverflow.com/questions/52532614/total-canvas-memory-use-exceeds-the-maximum-limit-safari-12
  [cropCvs, testCvs].forEach(cvs => {
    cvs.height = 0;
    cvs.width = 0;
  });

  // Running in a web worker
  if (isWorker) {
    postMessage({
      width,
      height,
      testTime,
      isTestPass,
    });

    if (!isTestPass && settings.sizes.length) {
      setTimeout(() => {
        canvasTest(settings);
      }, 0);
    }
  } else if (isTestPass) {
    settings.onSuccess({ width, height, testTime });
  } else {
    settings.onError({ width, height, testTime });

    if (settings.sizes.length) {
      setTimeout(() => {
        canvasTest(settings);
      }, 0);
    }
  }

  return isTestPass;
}

export default canvasTest;
