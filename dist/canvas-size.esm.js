/*!
 * canvas-size
 * v1.1.0
 * https://github.com/jhildenbiddle/canvas-size
 * (c) 2015-2020 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
var hasCanvasSupport = window && window.HTMLCanvasElement;

var cropCvs, cropCtx, testCvs, testCtx;

if (hasCanvasSupport) {
    cropCvs = document.createElement("canvas");
    cropCtx = cropCvs.getContext("2d");
    testCvs = document.createElement("canvas");
    testCtx = testCvs.getContext("2d");
}

function canvasTest(settings) {
    if (!hasCanvasSupport) {
        return false;
    }
    var [width, height] = settings.sizes.shift();
    var fill = [ width - 1, height - 1, 1, 1 ];
    var job = Date.now();
    testCvs.width = width;
    testCvs.height = height;
    testCtx.fillRect.apply(testCtx, fill);
    cropCvs.width = 1;
    cropCvs.height = 1;
    cropCtx.drawImage(testCvs, 0 - (width - 1), 0 - (height - 1));
    var isTestPass = Boolean(cropCtx.getImageData(0, 0, 1, 1).data[3]);
    var benchmark = Date.now() - job;
    if (isTestPass) {
        settings.onSuccess(width, height, benchmark);
    } else {
        settings.onError(width, height, benchmark);
        if (settings.sizes.length) {
            if (window.requestAnimationFrame) {
                window.requestAnimationFrame(() => {
                    canvasTest(settings);
                });
            } else {
                canvasTest(settings);
            }
        }
    }
    return isTestPass;
}

function canvasTestPromise(settings) {
    return new Promise((resolve, reject) => {
        var newSettings = Object.assign({}, settings, {
            onError(width, height, benchmark) {
                if (settings.onError) {
                    settings.onError(width, height, benchmark);
                }
                if (settings.sizes.length === 0) {
                    reject({
                        width: width,
                        height: height,
                        benchmark: benchmark
                    });
                }
            },
            onSuccess(width, height, benchmark) {
                if (settings.onSuccess) {
                    settings.onSuccess(width, height, benchmark);
                }
                resolve({
                    width: width,
                    height: height,
                    benchmark: benchmark
                });
            }
        });
        canvasTest(newSettings);
    });
}

var defaults = {
    max: null,
    min: 1,
    sizes: [],
    step: 1024,
    usePromise: false,
    onError: Function.prototype,
    onSuccess: Function.prototype
};

var testSizes = {
    area: [ 32767, 16384, 14188, 11402, 10836, 11180, 8192, 4096, defaults.min ],
    height: [ 8388607, 65535, 32767, 16384, 8192, 4096, defaults.min ],
    width: [ 4194303, 65535, 32767, 16384, 8192, 4096, defaults.min ]
};

function createSizesArray(settings) {
    var isArea = settings.width === settings.height;
    var isWidth = settings.height === 1;
    var isHeight = settings.width === 1;
    var sizes = [];
    if (!settings.width || !settings.height) {
        settings.sizes.forEach(testSize => {
            var width = isArea || isWidth ? testSize : 1;
            var height = isArea || isHeight ? testSize : 1;
            sizes.push([ width, height ]);
        });
    } else {
        var testMin = settings.min || defaults.min;
        var testStep = settings.step || defaults.step;
        var testSize = Math.max(settings.width, settings.height);
        while (testSize >= testMin) {
            var width = isArea || isWidth ? testSize : 1;
            var height = isArea || isHeight ? testSize : 1;
            sizes.push([ width, height ]);
            testSize -= testStep;
        }
    }
    return sizes;
}

var canvasSize = {
    maxArea() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var sizes = createSizesArray({
            width: options.max,
            height: options.max,
            min: options.min,
            step: options.step,
            sizes: [ ...testSizes.area ]
        });
        var settings = Object.assign({}, defaults, options, {
            sizes: sizes
        });
        if (settings.usePromise) {
            return canvasTestPromise(settings);
        } else {
            canvasTest(settings);
        }
    },
    maxHeight() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var sizes = createSizesArray({
            width: 1,
            height: options.max,
            min: options.min,
            step: options.step,
            sizes: [ ...testSizes.height ]
        });
        var settings = Object.assign({}, defaults, options, {
            sizes: sizes
        });
        if (settings.usePromise) {
            return canvasTestPromise(settings);
        } else {
            canvasTest(settings);
        }
    },
    maxWidth() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var sizes = createSizesArray({
            width: options.max,
            height: 1,
            min: options.min,
            step: options.step,
            sizes: [ ...testSizes.width ]
        });
        var settings = Object.assign({}, defaults, options, {
            sizes: sizes
        });
        if (settings.usePromise) {
            return canvasTestPromise(settings);
        } else {
            canvasTest(settings);
        }
    },
    test() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var settings = Object.assign({}, defaults, options);
        settings.sizes = [ ...settings.sizes ];
        if (settings.width && settings.height) {
            settings.sizes = [ [ settings.width, settings.height ] ];
        }
        if (settings.usePromise) {
            return canvasTestPromise(settings);
        } else {
            return canvasTest(settings);
        }
    }
};

export default canvasSize;
//# sourceMappingURL=canvas-size.esm.js.map
