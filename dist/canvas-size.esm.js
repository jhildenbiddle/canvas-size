/*!
 * canvas-size
 * v1.0.4
 * https://github.com/jhildenbiddle/canvas-size
 * (c) 2015-2020 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
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
    var cvs = document ? document.createElement("canvas") : null;
    var ctx = cvs && cvs.getContext ? cvs.getContext("2d") : null;
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
            setTimeout((function() {
                canvasTestLoop(settings);
            }), 0);
        }
    }
}

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
        canvasTestLoop(settings);
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
        canvasTestLoop(settings);
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
        canvasTestLoop(settings);
    },
    test() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var settings = Object.assign({}, defaults, options);
        if (settings.sizes.length) {
            settings.sizes = [ ...options.sizes ];
            canvasTestLoop(settings);
        } else {
            var testPass = canvasTest(settings.width, settings.height);
            return testPass;
        }
    }
};

export default canvasSize;
//# sourceMappingURL=canvas-size.esm.js.map
