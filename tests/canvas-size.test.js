// Dependencies
// =============================================================================
import canvasSize from '../src/index';
import { expect } from 'chai';


// Constants & Variables
// =============================================================================
const hasPromiseSupport         = Boolean(window.Promise);
const hasOffscreenCanvasSupport = 'OffscreenCanvas' in window;
const hideConsoleMsgs           = true;


// Functions
// =============================================================================
// eslint-disable-next-line no-unused-vars
function handleError(title, width, height, context) {
    // If a canvas of 1x1 is unreadable then the issue is most likely related to
    // running the browser in a virtual machine. The following check allows
    // these failed tests to be skipped
    if (width === 1 && height === 1) {
        if (!hideConsoleMsgs) {
            console.log(`${title} ${width} x ${height} SKIPPED (likely VM issue)`);
        }

        if (context) {
            context.skip();
        }
    }
    else if (!hideConsoleMsgs) {
        console.log(`${title} ${width} x ${height} ERROR`);
    }
}

// eslint-disable-next-line no-unused-vars
function handleSuccess(title, width, height, context) {
    if (!hideConsoleMsgs) {
        console.log(`${title} ${width} x ${height} SUCCESS`);
    }
}


// Suite
// =============================================================================
describe('canvasSize', function() {
    // maxArea()
    // -------------------------------------------------------------------------
    describe('maxArea()', function() {
        const title = this.title;

        it('determines max area (default sizes)', function(done) {
            const testContext = this;

            canvasSize.maxArea({
                onError(width, height) {
                    handleError(title, width, height, testContext);
                },
                onSuccess(width, height) {
                    handleSuccess(title, width, height);
                    expect(width).to.be.a('number');
                    expect(height).to.be.a('number');
                    done();
                }
            });
        });

        it('determines max area (max + step)', function(done) {
            const testContext = this;

            canvasSize.maxArea({
                max : 1000000,
                step: 999999,
                onError(width, height) {
                    handleError(title, width, height, testContext);
                },
                onSuccess(width, height) {
                    handleSuccess(title, width, height);
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
        const title = this.title;

        it('determines max height (default sizes)', function(done) {
            const testContext = this;

            canvasSize.maxHeight({
                onError(width, height) {
                    handleError(title, width, height, testContext);
                },
                onSuccess(width, height) {
                    handleSuccess(title, width, height);
                    expect(height).to.be.a('number');
                    done();
                }
            });
        });

        it('determines max height (max + step)', function(done) {
            const testContext = this;

            canvasSize.maxHeight({
                max : 1000000,
                step: 999999,
                onError(width, height) {
                    handleError(title, width, height, testContext);
                },
                onSuccess(width, height) {
                    handleSuccess(title, width, height);
                    expect(height).to.be.a('number');
                    done();
                }
            });
        });
    });

    // maxWidth()
    // -------------------------------------------------------------------------
    describe('maxWidth()', function() {
        const title = this.title;

        it('determines max width (default sizes)', function(done) {
            const testContext = this;

            canvasSize.maxWidth({
                onError(width, height) {
                    handleError(title, width, height, testContext);
                },
                onSuccess(width, height) {
                    handleSuccess(title, width, height);
                    expect(width).to.be.a('number');
                    done();
                }
            });
        });

        it('determines max width (max + step)', function(done) {
            const testContext = this;

            canvasSize.maxWidth({
                max : 1000000,
                step: 999999,
                onError(width, height) {
                    handleError(title, width, height, testContext);
                },
                onSuccess(width, height) {
                    handleSuccess(title, width, height);
                    expect(width).to.be.a('number');
                    done();
                }
            });
        });
    });

    // test()
    // -------------------------------------------------------------------------
    describe('test()', function() {
        const title = this.title;

        it('returns true for valid width / height', function() {
            const testResult = canvasSize.test({
                width : 1,
                height: 1
            });

            expect(testResult).to.equal(true);
        });

        it('returns false for invalid width / height', function() {
            const testResult = canvasSize.test({
                width : 1000000,
                height: 1000000
            });

            expect(testResult).to.equal(false);
        });

        it('triggers onError callback (sizes)', function(done) {
            const testSizes = [
                [3000000, 3000000],
                [2000000, 2000000],
                [1000000, 1000000]
            ];
            const testArr = [];

            canvasSize.test({
                sizes: testSizes,
                onError(width, height) {
                    handleError(title, width, height);
                    testArr.push([width, height]);

                    if (testArr.length === testSizes.length) {
                        expect(testArr).to.deep.equal(testSizes);
                        done();
                    }
                }
            });
        });

        it('triggers onSuccess callback (sizes)', function(done) {
            const testContext = this;
            const testSizes   = [
                [2000000, 2000000],
                [1000000, 1000000],
                [1, 1]
            ];

            canvasSize.test({
                sizes: testSizes,
                onError(width, height) {
                    handleError(title, width, height, testContext);
                },
                onSuccess(width, height) {
                    handleSuccess(title, width, height, testContext);
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
                const testSize = 1000000;

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
                    let onError   = 0;
                    let onSuccess = 0;

                    canvasSize[method]({
                        max       : 1000000,
                        step      : 999999,
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
                const testSize = 16385; // Chrome maxArea w/h + 1

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
                const testSize = 16385; // Chrome maxArea w/h + 1

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
                    const testSize = method === 'maxArea' ? 16385 : 9999999;

                    let onError   = 0;
                    let onSuccess = 0;

                    canvasSize[method]({
                        max      : testSize,
                        step     : testSize - 1,
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
                    const testSize = method === 'maxArea' ? 16385 : 9999999;

                    let onError   = 0;
                    let onSuccess = 0;

                    canvasSize[method]({
                        max       : testSize,
                        step      : testSize - 1,
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
