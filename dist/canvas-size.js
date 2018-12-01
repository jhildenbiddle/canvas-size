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
    var cvs = document ? document.createElement("canvas") : null;
    var ctx = cvs && cvs.getContext ? cvs.getContext("2d") : null;
    var defaults = {
        step: 1024,
        onError: Function.prototype,
        onSuccess: Function.prototype
    };
    function canvasLoop() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var _settings = arguments.length > 1 ? arguments[1] : undefined;
        var settings = _settings || _extends({}, defaults, options);
        var testPass = canvasTest(settings.maxHeight, settings.maxWidth);
        if (testPass) {
            settings.onSuccess(settings.maxHeight, settings.maxWidth);
        } else {
            var isLargerThanMin = settings.maxHeight > settings.minHeight || settings.maxWidth > settings.minWidth;
            settings.onError(settings.maxHeight, settings.maxWidth);
            if (isLargerThanMin) {
                settings.maxWidth = Math.max(settings.maxWidth - settings.step, settings.minWidth);
                settings.maxHeight = Math.max(settings.maxHeight - settings.step, settings.minHeight);
                setTimeout(function() {
                    canvasLoop(null, settings);
                }, 0);
            }
        }
    }
    function canvasTest(height, width) {
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
    var canvasSize = {
        maxArea: function maxArea() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var settings = _extends({}, defaults, options, {
                minHeight: options.min || 1,
                maxHeight: options.max || 16384,
                minWidth: options.min || 1,
                maxWidth: options.max || 16384
            });
            canvasLoop(settings);
        },
        maxHeight: function maxHeight() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var settings = _extends({}, defaults, options, {
                minHeight: options.min || 1,
                maxHeight: options.max || 32767,
                minWidth: 1,
                maxWidth: 1
            });
            canvasLoop(settings);
        },
        maxWidth: function maxWidth() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var settings = _extends({}, defaults, options, {
                minHeight: 1,
                maxHeight: 1,
                minWidth: options.min || 1,
                maxWidth: options.max || 32767
            });
            canvasLoop(settings);
        },
        test: function test() {
            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
            var settings = _extends({}, defaults, options, {
                height: options.height || 1,
                width: options.width || 1
            });
            var testPass = canvasTest(settings.height, settings.width);
            if (testPass) {
                settings.onSuccess(settings.height, settings.width);
            } else {
                settings.onError(settings.height, settings.width);
            }
        }
    };
    return canvasSize;
});
//# sourceMappingURL=canvas-size.js.map
