/*!
 * canvas-size
 * v1.1.0
 * https://github.com/jhildenbiddle/canvas-size
 * (c) 2015-2020 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = global || self, 
    global.canvasSize = factory());
})(this, (function() {
    "use strict";
    function _extends() {
        _extends = Object.assign || function(target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];
                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        };
        return _extends.apply(this, arguments);
    }
    function _slicedToArray(arr, i) {
        return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
    }
    function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
    }
    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) return _arrayLikeToArray(arr);
    }
    function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
    }
    function _iterableToArray(iter) {
        if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
    }
    function _iterableToArrayLimit(arr, i) {
        if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;
        try {
            for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
                _arr.push(_s.value);
                if (i && _arr.length === i) break;
            }
        } catch (err) {
            _d = true;
            _e = err;
        } finally {
            try {
                if (!_n && _i["return"] != null) _i["return"]();
            } finally {
                if (_d) throw _e;
            }
        }
        return _arr;
    }
    function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;
        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
        return arr2;
    }
    function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function _nonIterableRest() {
        throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
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
        var _settings$sizes$shift = settings.sizes.shift(), _settings$sizes$shift2 = _slicedToArray(_settings$sizes$shift, 2), width = _settings$sizes$shift2[0], height = _settings$sizes$shift2[1];
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
                    window.requestAnimationFrame((function() {
                        canvasTest(settings);
                    }));
                } else {
                    canvasTest(settings);
                }
            }
        }
        return isTestPass;
    }
    function canvasTestPromise(settings) {
        return new Promise((function(resolve, reject) {
            var newSettings = _extends({}, settings, {
                onError: function onError(width, height, benchmark) {
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
                onSuccess: function onSuccess(width, height, benchmark) {
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
        }));
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
            settings.sizes.forEach((function(testSize) {
                var width = isArea || isWidth ? testSize : 1;
                var height = isArea || isHeight ? testSize : 1;
                sizes.push([ width, height ]);
            }));
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
        maxArea: function maxArea() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var sizes = createSizesArray({
                width: options.max,
                height: options.max,
                min: options.min,
                step: options.step,
                sizes: _toConsumableArray(testSizes.area)
            });
            var settings = _extends({}, defaults, options, {
                sizes: sizes
            });
            if (settings.usePromise) {
                return canvasTestPromise(settings);
            } else {
                canvasTest(settings);
            }
        },
        maxHeight: function maxHeight() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var sizes = createSizesArray({
                width: 1,
                height: options.max,
                min: options.min,
                step: options.step,
                sizes: _toConsumableArray(testSizes.height)
            });
            var settings = _extends({}, defaults, options, {
                sizes: sizes
            });
            if (settings.usePromise) {
                return canvasTestPromise(settings);
            } else {
                canvasTest(settings);
            }
        },
        maxWidth: function maxWidth() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var sizes = createSizesArray({
                width: options.max,
                height: 1,
                min: options.min,
                step: options.step,
                sizes: _toConsumableArray(testSizes.width)
            });
            var settings = _extends({}, defaults, options, {
                sizes: sizes
            });
            if (settings.usePromise) {
                return canvasTestPromise(settings);
            } else {
                canvasTest(settings);
            }
        },
        test: function test() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var settings = _extends({}, defaults, options);
            settings.sizes = _toConsumableArray(settings.sizes);
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
    return canvasSize;
}));
//# sourceMappingURL=canvas-size.js.map
