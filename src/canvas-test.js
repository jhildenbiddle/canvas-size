const hasCanvasSupport = window && window.HTMLCanvasElement;

let cropCvs, cropCtx, testCvs, testCtx;

/* istanbul ignore else */
if (hasCanvasSupport) {
    cropCvs = document.createElement('canvas');
    cropCtx = cropCvs.getContext('2d');
    testCvs = document.createElement('canvas');
    testCtx = testCvs.getContext('2d');
}

/**
 * Tests ability to read pixel data from canvas elements of various dimensions
 * by decreasing canvas height and/or width until a test succeeds.
 *
 * @param {object} settings
 * @param {number[][]} settings.sizes
 * @param {function} settings.onError
 * @param {function} settings.onSuccess
 */
function canvasTest(settings) {
    /* istanbul ignore if */
    if (!hasCanvasSupport) {
        return false;
    }

    const [width, height] = settings.sizes.shift();
    const fill = [width - 1, height - 1, 1, 1]; // x, y, width, height
    const job = Date.now();

    // Size (which resets) test canvas and render test pixel
    testCvs.width = width;
    testCvs.height = height;
    testCtx.fillRect.apply(testCtx, fill);

    // Size (which resets) crop canvas
    cropCvs.width = 1;
    cropCvs.height = 1;
    // Render the test pixel in the bottom=right corner of the
    // test canvas in the top-left of the 1x1 crop canvas. This
    // dramatically reducing the time for getImageData to complete.
    cropCtx.drawImage(testCvs, 0 - (width - 1), 0 - (height - 1));

    // Verify image data (Pass = 255, Fail = 0)
    const isTestPass = Boolean(cropCtx.getImageData(0, 0, 1, 1).data[3]);
    const benchmark = Date.now() - job; // milliseconds

    if (isTestPass) {
        settings.onSuccess(width, height, benchmark);
    }
    else {
        settings.onError(width, height, benchmark);

        if (settings.sizes.length) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(() => {
                    canvasTest(settings);
                });
            }
            else {
                canvasTest(settings);
            }
        }
    }

    return isTestPass;
}

/**
 * Promise-based version of canvasTest()
 *
 * @param   {object} settings
 * @param   {number[][]} settings.sizes
 * @param   {function} settings.onError
 * @param   {function} settings.onSuccess
 * @returns {object} Promise
 */
function canvasTestPromise(settings) {
    return new Promise((resolve, reject) => {
        // Modify callbacks resolve/reject Promise
        const newSettings = Object.assign({}, settings, {
            onError(width, height, benchmark) {
                /* istanbul ignore else */
                if (settings.onError) {
                    settings.onError(width, height, benchmark);
                }
                if (settings.sizes.length === 0) {
                    reject({ width, height, benchmark });
                }
            },
            onSuccess(width, height, benchmark) {
                /* istanbul ignore else */
                if (settings.onSuccess) {
                    settings.onSuccess(width, height, benchmark);
                }

                resolve({ width, height, benchmark });
            }
        });

        canvasTest(newSettings);
    });
}

export { canvasTest, canvasTestPromise };
