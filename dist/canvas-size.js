/*!
 * canvas-size
 * v0.0.0
 * https://github.com/jhildenbiddle/canvas-size
 * (c) 2018 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
(function(global, factory) {
    typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : global.canvasSize = factory();
})(this, function() {
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
    function _toConsumableArray(arr) {
        return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
    }
    function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];
            return arr2;
        }
    }
    function _iterableToArray(iter) {
        if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
    }
    function _nonIterableSpread() {
        throw new TypeError("Invalid attempt to spread non-iterable instance");
    }
    var cvs = document ? document.createElement("canvas") : null;
    var ctx = cvs && cvs.getContext ? cvs.getContext("2d") : null;
    var defaults = {
        max: null,
        min: 1,
        sizes: [],
        step: 1024,
        onError: Function.prototype,
        onSuccess: Function.prototype
    };
    var testSizes = {
        area: [ 16384, 14188, 11402, 10836, 11180, 8192, 4096, defaults.min ],
        height: [ 8388607, 32767, 16384, 8192, 4096, defaults.min ],
        width: [ 4194303, 32767, 16384, 8192, 4096, defaults.min ]
    };
    function canvasTest(width, height) {
        var w = 1;
        var h = 1;
        var x = width - w;
        var y = height - h;
        try {
            cvs.width = width;
            cvs.height = height;
            ctx.fillRect(x, y, w, h);
            return Boolean(ctx.getImageData(x, y, w, h).data[3]);
        } catch (e) {
            return false;
        }
    }
    function canvasTestLoop(settings) {
        var sizes = settings.sizes.shift();
        var width = sizes[0];
        var height = sizes[1];
        var testPass = canvasTest(width, height);
        if (testPass) {
            settings.onSuccess(width, height);
        } else {
            settings.onError(width, height);
            if (settings.sizes.length) {
                setTimeout(function() {
                    canvasTestLoop(settings);
                }, 0);
            }
        }
    }
    function getMaxSizes(settings) {
        var isArea = settings.width === settings.height;
        var isWidth = settings.height === 1;
        var isHeight = settings.width === 1;
        var sizes = [];
        if (!settings.width || !settings.height) {
            settings.sizes.forEach(function(testSize) {
                var width = isArea || isWidth ? testSize : 1;
                var height = isArea || isHeight ? testSize : 1;
                sizes.push([ width, height ]);
            });
        } else {
            var testMin = settings.min || defaults.min;
            var testStep = settings.step || defaults.step;
            var testSize = Math.max(settings.width, settings.height);
            while (testSize > testMin) {
                var width = isArea || isWidth ? testSize : 1;
                var height = isArea || isHeight ? testSize : 1;
                sizes.push([ width, height ]);
                testSize -= testStep;
            }
            sizes.push([ testMin, testMin ]);
        }
        return sizes;
    }
    var canvasSize = {
        maxArea: function maxArea() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var sizes = getMaxSizes({
                width: options.max,
                height: options.max,
                min: options.min,
                step: options.step,
                sizes: _toConsumableArray(testSizes.area)
            });
            var settings = _extends({}, defaults, options, {
                sizes: sizes
            });
            canvasTestLoop(settings);
        },
        maxHeight: function maxHeight() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var sizes = getMaxSizes({
                width: 1,
                height: options.max,
                min: options.min,
                step: options.step,
                sizes: _toConsumableArray(testSizes.height)
            });
            var settings = _extends({}, defaults, options, {
                sizes: sizes
            });
            canvasTestLoop(settings);
        },
        maxWidth: function maxWidth() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var sizes = getMaxSizes({
                width: options.max,
                height: 1,
                min: options.min,
                step: options.step,
                sizes: _toConsumableArray(testSizes.width)
            });
            var settings = _extends({}, defaults, options, {
                sizes: sizes
            });
            canvasTestLoop(settings);
        },
        test: function test() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var settings = _extends({}, defaults, options);
            if (settings.sizes.length) {
                settings.sizes = _toConsumableArray(options.sizes);
                canvasTestLoop(settings);
            } else {
                var testPass = canvasTest(settings.width, settings.height);
                if (testPass) {
                    settings.onSuccess(settings.height, settings.width);
                } else {
                    settings.onError(settings.height, settings.width);
                }
            }
        }
    };
    return canvasSize;
});
//# sourceMappingURL=canvas-size.js.map
