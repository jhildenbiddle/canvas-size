/*!
 * canvas-size
 * v1.0.2
 * https://github.com/jhildenbiddle/canvas-size
 * (c) 2018 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
const cvs = document ? document.createElement("canvas") : null;

const ctx = cvs && cvs.getContext ? cvs.getContext("2d") : null;

const defaults = {
    max: null,
    min: 1,
    sizes: [],
    step: 1024,
    onError: Function.prototype,
    onSuccess: Function.prototype
};

const testSizes = {
    area: [ 16384, 14188, 11402, 10836, 11180, 8192, 4096, defaults.min ],
    height: [ 8388607, 32767, 16384, 8192, 4096, defaults.min ],
    width: [ 4194303, 32767, 16384, 8192, 4096, defaults.min ]
};

function canvasTest(width, height) {
    const w = 1;
    const h = 1;
    const x = width - w;
    const y = height - h;
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
    const sizes = settings.sizes.shift();
    const width = sizes[0];
    const height = sizes[1];
    const testPass = canvasTest(width, height);
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

function createSizesArray(settings) {
    const isArea = settings.width === settings.height;
    const isWidth = settings.height === 1;
    const isHeight = settings.width === 1;
    const sizes = [];
    if (!settings.width || !settings.height) {
        settings.sizes.forEach(testSize => {
            const width = isArea || isWidth ? testSize : 1;
            const height = isArea || isHeight ? testSize : 1;
            sizes.push([ width, height ]);
        });
    } else {
        const testMin = settings.min || defaults.min;
        const testStep = settings.step || defaults.step;
        let testSize = Math.max(settings.width, settings.height);
        while (testSize > testMin) {
            const width = isArea || isWidth ? testSize : 1;
            const height = isArea || isHeight ? testSize : 1;
            sizes.push([ width, height ]);
            testSize -= testStep;
        }
        sizes.push([ testMin, testMin ]);
    }
    return sizes;
}

const canvasSize = {
    maxArea() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const sizes = createSizesArray({
            width: options.max,
            height: options.max,
            min: options.min,
            step: options.step,
            sizes: [ ...testSizes.area ]
        });
        const settings = Object.assign({}, defaults, options, {
            sizes: sizes
        });
        canvasTestLoop(settings);
    },
    maxHeight() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const sizes = createSizesArray({
            width: 1,
            height: options.max,
            min: options.min,
            step: options.step,
            sizes: [ ...testSizes.height ]
        });
        const settings = Object.assign({}, defaults, options, {
            sizes: sizes
        });
        canvasTestLoop(settings);
    },
    maxWidth() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const sizes = createSizesArray({
            width: options.max,
            height: 1,
            min: options.min,
            step: options.step,
            sizes: [ ...testSizes.width ]
        });
        const settings = Object.assign({}, defaults, options, {
            sizes: sizes
        });
        canvasTestLoop(settings);
    },
    test() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const settings = Object.assign({}, defaults, options);
        if (settings.sizes.length) {
            settings.sizes = [ ...options.sizes ];
            canvasTestLoop(settings);
        } else {
            const testPass = canvasTest(settings.width, settings.height);
            return testPass;
        }
    }
};

export default canvasSize;
//# sourceMappingURL=canvas-size.esm.js.map
