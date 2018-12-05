// Constants & Variables
// =============================================================================
const cvs      = document ? document.createElement('canvas') : null;
const ctx      = cvs && cvs.getContext ? cvs.getContext('2d') : null;
const defaults = {
    max  : null,
    min  : 1,
    sizes: [],
    step : 1024,
    // Callbacks
    onError  : Function.prototype,
    onSuccess: Function.prototype
};
const testSizes = {
    area: [
        // Chrome 70 (Mac, Win)
        // Chrome 68 (Android 4.4)
        // Edge 17 (Win)
        // Safari 7-12 (Mac)
        16384,
        // Chrome 68 (Android 7.1-9)
        14188,
        // Chrome 68 (Android 5),
        11402,
        // Chrome 68 (Android 6)
        10836,
        // Firefox 63 (Mac, Win)
        11180,
        // IE 9-11 (Win)
        8192,
        // IE Mobile (Windows Phone 8.x)
        // Safari (iOS 9 - 12)
        4096,
        // Failed
        defaults.min
    ],
    height: [
        // Safari 7-12 (Mac)
        // Safari (iOS 9-12)
        8388607,
        // Chrome 70 (Mac, Win)
        // Chrome 68 (Android 4.4-9)
        // Firefox 63 (Mac, Win)
        32767,
        // IE11
        // Edge 17 (Win)
        16384,
        // IE 9-10 (Win)
        8192,
        // IE Mobile (Windows Phone 8.x)
        4096,
        // Failed
        defaults.min
    ],
    width: [
        // Safari 7-12 (Mac)
        // Safari (iOS 9-12)
        4194303,
        // Chrome 70 (Mac, Win)
        // Chrome 68 (Android 4.4-9)
        // Firefox 63 (Mac, Win)
        32767,
        // IE11
        // Edge 17 (Win)
        16384,
        // IE 9-10 (Win)
        8192,
        // IE Mobile (Windows Phone 8.x)
        4096,
        // Failed
        defaults.min
    ]
};


// Functions (Private)
// =============================================================================
/**
 * Tests ability to read pixel data from a canvas at a specified dimension.
 *
 * @param {number} width
 * @param {number} height
 * @returns {boolean}
 */
function canvasTest(width, height) {
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

/**
 * Tests ability to read pixel data from canvas elements of various dimensions
 * by decreasing canvas height and/or width until a test succeeds.
 *
 * @param {object} settings
 * @param {number[][]} settings.sizes
 * @param {function} settings.onError
 * @param {function} settings.onSuccess
 */
function canvasTestLoop(settings) {
    const sizes    = settings.sizes.shift();
    const width    = sizes[0];
    const height   = sizes[1];
    const testPass = canvasTest(width, height);

    if (testPass) {
        settings.onSuccess(width, height);
    }
    else {
        settings.onError(width, height);

        if (settings.sizes.length) {
            setTimeout(function(){
                canvasTestLoop(settings);
            }, 0);
        }
    }
}

/**
 * Creates a 2d array of canvas dimensions either from the default testSizes
 * object or the width/height/min/step values provided.
 *
 * @param   {object} settings
 * @param   {number} settings.width
 * @param   {number} settings.height
 * @param   {number} settings.min
 * @param   {number} settings.step
 * @param   {number[][]} settings.sizes
 * @returns {number[][]}
 */
function createSizesArray(settings) {
    const isArea   = settings.width === settings.height;
    const isWidth  = settings.height === 1;
    const isHeight = settings.width === 1;
    const sizes    = [];

    // Use settings.sizes
    if (!settings.width || !settings.height) {
        settings.sizes.forEach(testSize => {
            const width  = isArea || isWidth ? testSize : 1;
            const height = isArea || isHeight ? testSize : 1;

            sizes.push([width, height]);
        });
    }
    // Generate sizes from width, height, and step
    else {
        const testMin  = settings.min || defaults.min;
        const testStep = settings.step || defaults.step;
        let   testSize = Math.max(settings.width, settings.height);

        while (testSize > testMin) {
            const width  = isArea || isWidth ? testSize : 1;
            const height = isArea || isHeight ? testSize : 1;

            sizes.push([width, height]);
            testSize -= testStep;
        }

        sizes.push([testMin, testMin]);
    }

    return sizes;
}


// Methods
// =============================================================================
const canvasSize = {
    /**
     * Determines maximum area of an HTML canvas element. When `max` is
     * unspecified, an optimized test will be performed using known maximum
     * values from a variety of browsers and platforms.
     *
     * @param {object} [options]
     * @param {number} [options.max]
     * @param {number} [options.min=1]
     * @param {number} [options.step=1024]
     * @param {function} [options.onError]
     * @param {function} [options.onSuccess]
     */
    maxArea(options = {}) {
        const sizes = createSizesArray({
            width : options.max,
            height: options.max,
            min   : options.min,
            step  : options.step,
            sizes : [...testSizes.area]
        });
        const settings = Object.assign({}, defaults, options, { sizes });

        canvasTestLoop(settings);
    },

    /**
     * Determines maximum height of an HTML canvas element. When `max` is
     * unspecified, an optimized test will be performed using known maximum
     * values from a variety of browsers and platforms.
     *
     * @param {object} [options]
     * @param {number} [options.max]
     * @param {number} [options.min=1]
     * @param {number} [options.step=1024]
     * @param {function} [options.onError]
     * @param {function} [options.onSuccess]
     */
    maxHeight(options = {}) {
        const sizes = createSizesArray({
            width : 1,
            height: options.max,
            min   : options.min,
            step  : options.step,
            sizes : [...testSizes.height]
        });
        const settings = Object.assign({}, defaults, options, { sizes });

        canvasTestLoop(settings);
    },

    /**
     * Determines maximum width of an HTML canvas element. When `max` is
     * unspecified, an optimized test will be performed using known maximum
     * values from a variety of browsers and platforms.
     *
     * @param {object} [options]
     * @param {number} [options.max]
     * @param {number} [options.min=1]
     * @param {number} [options.step=1024]
     * @param {function} [options.onError]
     * @param {function} [options.onSuccess]
     */
    maxWidth(options = {}) {
        const sizes = createSizesArray({
            width : options.max,
            height: 1,
            min   : options.min,
            step  : options.step,
            sizes : [...testSizes.width]
        });
        const settings = Object.assign({}, defaults, options, { sizes });

        canvasTestLoop(settings);
    },

    /**
     * Tests ability to read pixel data from canvas of specified dimension(s).
     *
     * @param {object} [options]
     * @param {number} [options.width]
     * @param {number} [options.height]
     * @param {number[][]} [options.sizes]
     * @param {function} [options.onError]
     * @param {function} [options.onSuccess]
     * @returns {boolean} Returns boolean when width/heigt is set (not sizes)
     */
    test(options = {}) {
        const settings = Object.assign({}, defaults, options);

        if (settings.sizes.length) {
            settings.sizes = [...options.sizes];
            canvasTestLoop(settings);
        }
        else {
            const testPass = canvasTest(settings.width, settings.height);

            return testPass;
        }
    }
};


// Exports
// =============================================================================
export default canvasSize;