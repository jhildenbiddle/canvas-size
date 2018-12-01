/*!
 * canvas-size
 * v0.0.0
 * https://github.com/jhildenbiddle/canvas-size
 * (c) 2018 John Hildenbiddle <http://hildenbiddle.com>
 * MIT license
 */
const cvs = document ? document.createElement("canvas") : null;

const ctx = cvs && cvs.getContext ? cvs.getContext("2d") : null;

const defaults = {
    step: 1024,
    onError: Function.prototype,
    onSuccess: Function.prototype
};

function canvasLoop() {
    let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    let _settings = arguments.length > 1 ? arguments[1] : undefined;
    const settings = _settings || Object.assign({}, defaults, options);
    const testPass = canvasTest(settings.maxHeight, settings.maxWidth);
    if (testPass) {
        settings.onSuccess(settings.maxHeight, settings.maxWidth);
    } else {
        const isLargerThanMin = settings.maxHeight > settings.minHeight || settings.maxWidth > settings.minWidth;
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

const canvasSize = {
    maxArea() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const settings = Object.assign({}, defaults, options, {
            minHeight: options.min || 1,
            maxHeight: options.max || 16384,
            minWidth: options.min || 1,
            maxWidth: options.max || 16384
        });
        canvasLoop(settings);
    },
    maxHeight() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const settings = Object.assign({}, defaults, options, {
            minHeight: options.min || 1,
            maxHeight: options.max || 32767,
            minWidth: 1,
            maxWidth: 1
        });
        canvasLoop(settings);
    },
    maxWidth() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const settings = Object.assign({}, defaults, options, {
            minHeight: 1,
            maxHeight: 1,
            minWidth: options.min || 1,
            maxWidth: options.max || 32767
        });
        canvasLoop(settings);
    },
    test() {
        let options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        const settings = Object.assign({}, defaults, options, {
            height: options.height || 1,
            width: options.width || 1
        });
        const testPass = canvasTest(settings.height, settings.width);
        if (testPass) {
            settings.onSuccess(settings.height, settings.width);
        } else {
            settings.onError(settings.height, settings.width);
        }
    }
};

export default canvasSize;
//# sourceMappingURL=canvas-size.esm.js.map
