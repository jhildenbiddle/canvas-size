/*!
 * canvas-size
 * v1.1.0
 * https://github.com/jhildenbiddle/canvas-size
 * (c) 2015-2020 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}

function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) symbols = symbols.filter((function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        }));
        keys.push.apply(keys, symbols);
    }
    return keys;
}

function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i] != null ? arguments[i] : {};
        if (i % 2) {
            ownKeys(Object(source), true).forEach((function(key) {
                _defineProperty(target, key, source[key]);
            }));
        } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
        } else {
            ownKeys(Object(source)).forEach((function(key) {
                Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            }));
        }
    }
    return target;
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}

function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}

function canvasTest(settings) {
    var size = settings.sizes.shift();
    var width = size[0];
    var height = size[1];
    var fill = [ width - 1, height - 1, 1, 1 ];
    var job = Date.now();
    var isWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
    var cropCvs, testCvs;
    if (isWorker) {
        cropCvs = new OffscreenCanvas(1, 1);
        testCvs = new OffscreenCanvas(width, height);
    } else {
        cropCvs = document.createElement("canvas");
        cropCvs.width = 1;
        cropCvs.height = 1;
        testCvs = document.createElement("canvas");
        testCvs.width = width;
        testCvs.height = height;
    }
    var cropCtx = cropCvs.getContext("2d");
    var testCtx = testCvs.getContext("2d");
    if (testCtx) {
        testCtx.fillRect.apply(testCtx, fill);
        cropCtx.drawImage(testCvs, width - 1, width - 1, 1, 1, 0, 0, 1, 1);
    }
    var isTestPass = cropCtx && cropCtx.getImageData(0, 0, 1, 1).data[3] !== 0;
    var benchmark = Date.now() - job;
    if (isWorker) {
        postMessage({
            width: width,
            height: height,
            benchmark: benchmark,
            isTestPass: isTestPass
        });
        if (!isTestPass && settings.sizes.length) {
            canvasTest(settings);
        }
    } else if (isTestPass) {
        settings.onSuccess(width, height, benchmark);
    } else {
        settings.onError(width, height, benchmark);
        if (settings.sizes.length) {
            canvasTest(settings);
        }
    }
    return isTestPass;
}

var defaults = {
    max: null,
    min: 1,
    sizes: [],
    step: 1024,
    usePromise: false,
    useWorker: false,
    onError: Function.prototype,
    onSuccess: Function.prototype
};

var testSizes = {
    area: [ 32767, 16384, 14188, 11402, 10836, 11180, 8192, 4096, defaults.min ],
    height: [ 8388607, 65535, 32767, 16384, 8192, 4096, defaults.min ],
    width: [ 4194303, 65535, 32767, 16384, 8192, 4096, defaults.min ]
};

var workerJobs = {};

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

function handleMethod(settings) {
    var hasCanvasSupport = window && "HTMLCanvasElement" in window;
    var hasOffscreenCanvasSupport = window && "OffscreenCanvas" in window;
    var jobID = Date.now();
    var {onError: onError, onSuccess: onSuccess} = settings, settingsWithoutCallbacks = _objectWithoutProperties(settings, [ "onError", "onSuccess" ]);
    var worker = null;
    if (!hasCanvasSupport) {
        return false;
    }
    if (settings.useWorker && hasOffscreenCanvasSupport) {
        var js = "\n            ".concat(canvasTest.toString(), "\n            onmessage = function(e) {\n                canvasTest(e.data);\n            };\n        ");
        var blob = new Blob([ js ], {
            type: "application/javascript"
        });
        var blobURL = URL.createObjectURL(blob);
        worker = new Worker(blobURL);
        URL.revokeObjectURL(blobURL);
        worker.onmessage = function(e) {
            var {width: width, height: height, benchmark: benchmark, isTestPass: isTestPass} = e.data;
            if (isTestPass) {
                workerJobs[jobID].onSuccess(width, height, benchmark);
                delete workerJobs[jobID];
            } else {
                workerJobs[jobID].onError(width, height, benchmark);
            }
        };
    }
    if (settings.usePromise) {
        return new Promise((resolve, reject) => {
            var promiseSettings = _objectSpread2(_objectSpread2({}, settings), {}, {
                onError(width, height, benchmark) {
                    var isLastTest;
                    if (settings.sizes.length === 0) {
                        isLastTest = true;
                    } else {
                        var [[lastWidth, lastHeight]] = settings.sizes.slice(-1);
                        isLastTest = width === lastWidth && height === lastHeight;
                    }
                    onError(width, height, benchmark);
                    if (isLastTest) {
                        reject({
                            width: width,
                            height: height,
                            benchmark: benchmark
                        });
                    }
                },
                onSuccess(width, height, benchmark) {
                    onSuccess(width, height, benchmark);
                    resolve({
                        width: width,
                        height: height,
                        benchmark: benchmark
                    });
                }
            });
            if (worker) {
                var {onError: _onError, onSuccess: _onSuccess} = promiseSettings;
                workerJobs[jobID] = {
                    onError: _onError,
                    onSuccess: _onSuccess
                };
                worker.postMessage(settingsWithoutCallbacks);
            } else {
                canvasTest(promiseSettings);
            }
        });
    } else {
        if (worker) {
            workerJobs[jobID] = {
                onError: onError,
                onSuccess: onSuccess
            };
            worker.postMessage(settingsWithoutCallbacks);
        } else {
            return canvasTest(settings);
        }
    }
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
        return handleMethod(settings);
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
        return handleMethod(settings);
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
        return handleMethod(settings);
    },
    test() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var settings = Object.assign({}, defaults, options);
        settings.sizes = [ ...settings.sizes ];
        if (settings.width && settings.height) {
            settings.sizes = [ [ settings.width, settings.height ] ];
        }
        return handleMethod(settings);
    }
};

export default canvasSize;
//# sourceMappingURL=canvas-size.esm.js.map
