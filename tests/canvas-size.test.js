// Dependencies
// =============================================================================
import canvasSize from '../src/index.js';
import testSizes from '../src/test-sizes.js';
import { expect } from 'chai';


// Constants & Variables
// =============================================================================
const hasPromiseSupport         = 'Promise' in window;
const hasOffscreenCanvasSupport = 'OffscreenCanvas' in window;
const maxTestSize = {
    area  : testSizes.area[0],
    height: testSizes.height[0],
    width : testSizes.width[0]
};

// Suite
// =============================================================================
describe('canvasSize', function() {
    // maxArea()
    // -------------------------------------------------------------------------
    describe('maxArea()', function() {
        it('determines max area (default sizes)', function(done) {
            canvasSize.maxArea({
                onSuccess(width, height, benchmark) {
                    expect(width).to.be.a('number');
                    expect(height).to.be.a('number');
                    done();
                }
            });
        });

        it('determines max area (max + step)', function(done) {
            canvasSize.maxArea({
                max : maxTestSize.area + 1,
                step: maxTestSize.area,
                onSuccess(width, height, benchmark) {
                    expect(width).to.be.a('number');
                    expect(height).to.be.a('number');
                    done();
                }
            });
        });
    });

    // maxHeight()
    // -------------------------------------------------------------------------
    describe('maxHeight()', function() {
        it('determines max height (default sizes)', function(done) {
            canvasSize.maxHeight({
                onSuccess(width, height, benchmark) {
                    expect(height).to.be.a('number');
                    done();
                }
            });
        });

        it('determines max height (max + step)', function(done) {
            canvasSize.maxHeight({
                max : maxTestSize.height + 1,
                step: maxTestSize.height,
                onSuccess(width, height, benchmark) {
                    expect(height).to.be.a('number');
                    done();
                }
            });
        });
    });

    // maxWidth()
    // -------------------------------------------------------------------------
    describe('maxWidth()', function() {
        it('determines max width (default sizes)', function(done) {
            canvasSize.maxWidth({
                onSuccess(width, height, benchmark) {
                    expect(width).to.be.a('number');
                    done();
                }
            });
        });

        it('determines max width (max + step)', function(done) {
            canvasSize.maxWidth({
                max : maxTestSize.width + 1,
                step: maxTestSize.width,
                onSuccess(width, height, benchmark) {
                    expect(width).to.be.a('number');
                    done();
                }
            });
        });
    });

    // test()
    // -------------------------------------------------------------------------
    describe('test()', function() {
        it('returns true for valid width / height integers', function() {
            const testResult = canvasSize.test({
                width : 1,
                height: 1
            });

            expect(testResult).to.equal(true);
        });

        it('returns true for valid width / height floats', function() {
            const testResult = canvasSize.test({
                width : 1.1,
                height: 1.1
            });

            expect(testResult).to.equal(true);
        });

        it('returns false for invalid width / height', function() {
            const testResult = canvasSize.test({
                width : maxTestSize.area + 1,
                height: maxTestSize.area + 1
            });

            expect(testResult).to.equal(false);
        });

        it('triggers onError callback (sizes)', function(done) {
            const testSizes = [
                [maxTestSize.area + 3, maxTestSize.area + 3],
                [maxTestSize.area + 2, maxTestSize.area + 2],
                [maxTestSize.area + 1, maxTestSize.area + 1]
            ];
            const testArr = [];

            canvasSize.test({
                sizes: testSizes,
                onError(width, height, benchmark) {
                    testArr.push([width, height]);

                    if (testArr.length === testSizes.length) {
                        expect(testArr).to.deep.equal(testSizes);
                        done();
                    }
                }
            });
        });

        it('triggers onSuccess callback (sizes)', function(done) {
            const testSizes   = [
                [maxTestSize.area + 2, maxTestSize.area + 2],
                [maxTestSize.area + 1, maxTestSize.area + 1],
                [1, 1]
            ];

            canvasSize.test({
                sizes: testSizes,
                onSuccess(width, height, benchmark) {
                    expect(testSizes).to.deep.include([width, height]);

                    if (width === 1 && height === 1) {
                        done();
                    }
                }
            });
        });
    });

    // Promises
    // -------------------------------------------------------------------------
    if (hasPromiseSupport) {
        describe('Promise', function() {
            it('test() invokes promise.then() for valid width / height', function(done) {
                let onError   = 0;
                let onSuccess = 0;

                // When testing a single dimension using width and height
                // properties there is no need to use a promise. This is being
                // done for testing purposes only.
                canvasSize.test({
                    width     : 1,
                    height    : 1,
                    sizes     : [[2,2], [3,3]], // Should be ignored
                    usePromise: true,
                    onError(width, height, benchmark) {
                        onError++;
                    },
                    onSuccess(width, height, benchmark) {
                        onSuccess++;
                    }
                })
                .then(({ width, height, benchmark }) => {
                    expect(onError, 'triggers onError').to.equal(0);
                    expect(onSuccess, 'triggers onSuccess').to.equal(1);
                    expect(width, 'returns width').to.equal(1);
                    expect(height, 'returns height').to.equal(1);
                    expect(benchmark, 'returns benchmark').to.be.finite;
                    done();
                });
            });

            it('test() invokes promise.catch() for invalid width / height', function(done) {
                const testSize = maxTestSize.area + 1;

                let onError    = 0;
                let onSuccess  = 0;

                // When testing a single dimension using width and height
                // properties there is no need to use a promise. This is being
                // done for testing purposes only.
                canvasSize.test({
                    width     : testSize,
                    height    : testSize,
                    sizes     : [[2,2], [3,3]], // Should be ignored
                    usePromise: true,
                    onError(width, height, benchmark) {
                        onError++;
                    },
                    onSuccess(width, height, benchmark) {
                        onSuccess++;
                    }
                })
                .catch(({ width, height, benchmark }) => {
                    expect(onError, 'triggers onError').to.equal(1);
                    expect(onSuccess, 'triggers onSuccess').to.equal(0);
                    expect(width, 'returns width').to.equal(testSize);
                    expect(height, 'returns height').to.equal(testSize);
                    expect(benchmark, 'returns benchmark').to.be.finite;
                    done();
                });
            });

            ['maxArea', 'maxWidth', 'maxHeight'].forEach(method => {
                it(`${method}() invokes promise.then() for valid width / height`, function(done) {
                    const maxValue = maxTestSize[method.replace('max','').toLowerCase()];

                    let onError   = 0;
                    let onSuccess = 0;

                    canvasSize[method]({
                        max       : maxValue + 1,
                        step      : maxValue,
                        usePromise: true,
                        onError(width, height, benchmark) {
                            onError++;
                        },
                        onSuccess(width, height, benchmark) {
                            onSuccess++;
                        }
                    })
                    .then(({ width, height, benchmark }) => {
                        expect(onError, 'triggers onError').to.equal(1);
                        expect(onSuccess, 'triggers onSuccess').to.equal(1);
                        expect(width, 'returns width').to.equal(1);
                        expect(height, 'returns height').to.equal(1);
                        expect(benchmark, 'returns benchmark').to.be.finite;
                        done();
                    });
                });
            });
        });
    }

    // Workers
    // -------------------------------------------------------------------------
    if (hasOffscreenCanvasSupport) {
        describe('Worker', function() {
            it('test() posts message for valid width / height', function(done) {
                let onError   = 0;
                let onSuccess = 0;

                canvasSize.test({
                    width     : 1,
                    height    : 1,
                    sizes     : [[2,2], [3,3]], // Should be ignored
                    useWorker : true,
                    onError(width, height, benchmark) {
                        onError++;
                    },
                    onSuccess(width, height, benchmark) {
                        onSuccess++;

                        expect(onError, 'triggers onError').to.equal(0);
                        expect(onSuccess, 'triggers onSuccess').to.equal(1);
                        expect(width, 'returns width').to.equal(1);
                        expect(height, 'returns height').to.equal(1);
                        expect(benchmark, 'returns benchmark').to.be.finite;
                        done();
                    }
                });
            });

            it('test() invokes promise.then() for valid width / height', function(done) {
                let onError   = 0;
                let onSuccess = 0;

                canvasSize.test({
                    width     : 1,
                    height    : 1,
                    sizes     : [[2,2], [3,3]], // Should be ignored
                    usePromise: true,
                    useWorker : true,
                    onError(width, height, benchmark) {
                        onError++;
                    },
                    onSuccess(width, height, benchmark) {
                        onSuccess++;
                    }
                })
                .then(({ width, height, benchmark }) => {
                    expect(onError, 'triggers onError').to.equal(0);
                    expect(onSuccess, 'triggers onSuccess').to.equal(1);
                    expect(width, 'returns width').to.equal(1);
                    expect(height, 'returns height').to.equal(1);
                    expect(benchmark, 'returns benchmark').to.be.finite;
                    done();
                });
            });

            it('test() posts message for invalid width / height', function(done) {
                const testSize = maxTestSize.area + 1;

                let onError   = 0;
                let onSuccess = 0;

                canvasSize.test({
                    width    : testSize,
                    height   : testSize,
                    sizes    : [[2,2], [3,3]], // Should be ignored
                    useWorker: true,
                    onError(width, height, benchmark) {
                        onError++;

                        expect(onError, 'triggers onError').to.equal(1);
                        expect(onSuccess, 'triggers onSuccess').to.equal(0);
                        expect(width, 'returns width').to.equal(testSize);
                        expect(height, 'returns height').to.equal(testSize);
                        expect(benchmark, 'returns benchmark').to.be.finite;
                        done();
                    },
                    onSuccess(width, height, benchmark) {
                        onSuccess++;
                    }
                });
            });

            it('test() invokes promise.catch() for invalid width / height', function(done) {
                const testSize = maxTestSize.area + 1;

                let onError   = 0;
                let onSuccess = 0;

                canvasSize.test({
                    width     : testSize,
                    height    : testSize,
                    sizes     : [[2,2], [3,3]], // Should be ignored
                    usePromise: true,
                    useWorker : true,
                    onError(width, height, benchmark) {
                        onError++;
                    },
                    onSuccess(width, height, benchmark) {
                        onSuccess++;
                    }
                })
                .catch(({ width, height, benchmark }) => {
                    expect(onError, 'triggers onError').to.equal(1);
                    expect(onSuccess, 'triggers onSuccess').to.equal(0);
                    expect(width, 'returns width').to.equal(testSize);
                    expect(height, 'returns height').to.equal(testSize);
                    expect(benchmark, 'returns benchmark').to.be.finite;
                    done();
                });
            });

            ['maxArea', 'maxHeight', 'maxWidth'].forEach(method => {
                it(`${method}() posts message for valid width / height`, function(done) {
                    const maxValue = maxTestSize[method.replace('max','').toLowerCase()];

                    let onError   = 0;
                    let onSuccess = 0;

                    canvasSize[method]({
                        max      : maxValue + 1,
                        step     : maxValue,
                        useWorker: true,
                        onError(width, height, benchmark) {
                            onError++;
                        },
                        onSuccess(width, height, benchmark) {
                            onSuccess++;

                            expect(onError, 'triggers onError').to.equal(1);
                            expect(onSuccess, 'triggers onSuccess').to.equal(1);
                            expect(width, 'returns width').to.be.finite;
                            expect(height, 'returns height').to.be.finite;
                            expect(benchmark, 'returns benchmark').to.be.finite;
                            done();
                        }
                    });
                });

                it(`${method}() invokes promise.then() for valid width / height`, function(done) {
                    const maxValue = maxTestSize[method.replace('max','').toLowerCase()];

                    let onError   = 0;
                    let onSuccess = 0;

                    canvasSize[method]({
                        max       : maxValue + 1,
                        step      : maxValue,
                        usePromise: true,
                        useWorker : true,
                        onError(width, height, benchmark) {
                            onError++;
                        },
                        onSuccess(width, height, benchmark) {
                            onSuccess++;
                        }
                    })
                    .then(({ width, height, benchmark }) => {
                        expect(onError, 'triggers onError').to.equal(1);
                        expect(onSuccess, 'triggers onSuccess').to.equal(1);
                        expect(width, 'returns width').to.be.finite;
                        expect(height, 'returns height').to.be.finite;
                        expect(benchmark, 'returns benchmark').to.be.finite;
                        done();
                    });
                });
            });
        });
    }
});
