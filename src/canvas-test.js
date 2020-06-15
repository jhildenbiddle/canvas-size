/* eslint-env browser, worker */

/**
 * Tests ability to read pixel data from canvas elements of various dimensions
 * by decreasing canvas height and/or width until a test succeeds.
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * IMPORTANT: ONLY USE ES5 CODE IN THIS FUNCTION (I.E. NO BABEL TRANSPILATION)
 *            This function will be used both on the main thread and as part of
 *            an inline web worker. If this code is transpiled from ES6+ to ES5,
 *            the main thread will have access to Babel's helper functions but
 *            the web worker scope will.
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * @param {object} settings
 * @param {number[][]} settings.sizes
 * @param {function} settings.onError
 * @param {function} settings.onSuccess
 */
function canvasTest(settings) {
    const size     = settings.sizes.shift();
    const width    = size[0];
    const height   = size[1];
    const fill     = [width - 1, height - 1, 1, 1]; // x, y, width, height
    const job      = Date.now();
    const isWorker = typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope;

    let cropCvs, testCvs;

    if (isWorker) {
        cropCvs = new OffscreenCanvas(1, 1);
        testCvs = new OffscreenCanvas(width, height);
    }
    else {
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
    const benchmark  = Date.now() - job; // milliseconds

    // Running in a web worker
    if (isWorker) {
        postMessage({
            width,
            height,
            benchmark,
            isTestPass
        });

        if (!isTestPass && settings.sizes.length) {
            canvasTest(settings);
        }
    }
    else if (isTestPass) {
        settings.onSuccess(width, height, benchmark);
    }
    else {
        settings.onError(width, height, benchmark);

        if (settings.sizes.length) {
            canvasTest(settings);
        }
    }

    return isTestPass;
}

export default canvasTest;
