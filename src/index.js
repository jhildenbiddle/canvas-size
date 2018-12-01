// Constants & Variables
// =============================================================================
const cvs      = document ? document.createElement('canvas') : null;
const ctx      = cvs && cvs.getContext ? cvs.getContext('2d') : null;
const defaults = {
    step: 1024,
    // Callbacks
    onError  : Function.prototype,
    onSuccess: Function.prototype
};


// Functions (Private)
// =============================================================================
/**
 * Tests ability to read pixel data from canvases of various dimensions by
 * decreasing canvas height and/or width until a success test occurs.
 *
 * @param {object} options
 * @param {number} options.minHeight
 * @param {number} options.maxHeight
 * @param {number} options.minWidth
 * @param {number} options.maxWidth
 * @param {number} options.step
 * @param {function} options.onError
 * @param {function} options.onSuccess
 * @param {function} [_settings]
 */
function canvasLoop(options = {}, _settings) {
    const settings = _settings || Object.assign({}, defaults, options);
    const testPass = canvasTest(settings.maxHeight, settings.maxWidth);

    if (testPass) {
        settings.onSuccess(settings.maxHeight, settings.maxWidth);
    }
    else {
        const isLargerThanMin = settings.maxHeight > settings.minHeight || settings.maxWidth > settings.minWidth;

        settings.onError(settings.maxHeight, settings.maxWidth);

        // Decrease value(s) by step amount and test again
        if (isLargerThanMin) {
            settings.maxWidth  = Math.max(settings.maxWidth - settings.step, settings.minWidth);
            settings.maxHeight = Math.max(settings.maxHeight - settings.step, settings.minHeight);

            // Test again with decreased values
            setTimeout(function(){
                canvasLoop(null, settings);
            }, 0);
        }
    }
}

/**
 * Tests ability to read pixel data from canvas of specified dimensions.
 *
 * @param {number} height
 * @param {number} width
 * @returns {boolean}
 */
function canvasTest(height, width) {
    // Define test rectangle dimensions and coordinates
    const w = 1;
    const h = 1;
    const x = width - w;  // Right edge
    const y = height - h; // Bottom edge

    try {
        // Set sized canvas dimensions and draw test rectangle
        cvs.width = width;
        cvs.height = height;
        ctx.fillRect(x, y, w, h);

        // Verify test rectangle image data (Pass = 255, Fail = 0)
        return Boolean(ctx.getImageData(x, y, w, h).data[3]);
    }
    catch(e){
        return false;
    }
}


// Export
// =============================================================================
const canvasSize = {
    /**
     * Determines maximum canvas area. Tests begins with the `max` value which
     * is then reduced by the `step` value until a successful test pass or the
     * `min` value is reached.
     *
     * @param {object} [options]
     * @param {number} [options.min=1]
     * @param {number} [options.max=16384]
     * @param {number} [options.step=1024]
     * @param {function} [options.onError]
     * @param {function} [options.onSuccess]
     */
    maxArea(options = {}) {
        const settings = Object.assign({}, defaults, options, {
            minHeight: options.min || 1,
            maxHeight: options.max || 16384,
            minWidth : options.min || 1,
            maxWidth : options.max || 16384
        });

        canvasLoop(settings);
    },

    /**
     * Determines maximum canvas height. Tests begins with the `max` value which
     * is then reduced by the `step` value until a successful test pass or the
     * `min` value is reached.
     *
     * @param {object} [options]
     * @param {number} [options.min=1]
     * @param {number} [options.max=32767]
     * @param {number} [options.step=1024]
     * @param {function} [options.onError]
     * @param {function} [options.onSuccess]
     */
    maxHeight(options = {}) {
        const settings = Object.assign({}, defaults, options, {
            minHeight: options.min || 1,
            maxHeight: options.max || 32767,
            minWidth : 1,
            maxWidth : 1
        });

        canvasLoop(settings);
    },

    /**
     * Determines maximum canvas width. Tests begins with the `max` value which
     * is then reduced by the `step` value until a successful test pass or the
     * `min` value is reached.
     *
     * @param {object} [options]
     * @param {number} [options.min=1]
     * @param {number} [options.max=32767]
     * @param {number} [options.step=1024]
     * @param {function} [options.onError]
     * @param {function} [options.onSuccess]
     */
    maxWidth(options = {}) {
        const settings = Object.assign({}, defaults, options, {
            minHeight: 1,
            maxHeight: 1,
            minWidth : options.min || 1,
            maxWidth : options.max || 32767
        });

        canvasLoop(settings);
    },

    /**
     * Tests ability to read pixel data from canvas of specified dimensions.
     *
     * @param {object} [options]
     * @param {number} [options.height=1]
     * @param {number} [options.width=1]
     * @param {function} [options.onError]
     * @param {function} [options.onSuccess]
     */
    test(options = {}) {
        const settings = Object.assign({}, defaults, options, {
            height: options.height || 1,
            width : options.width || 1
        });
        const testPass = canvasTest(settings.height, settings.width);

        if (testPass) {
            settings.onSuccess(settings.height, settings.width);
        }
        else {
            settings.onError(settings.height, settings.width);
        }
    }
};

export default canvasSize;