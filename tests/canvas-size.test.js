// Dependencies
// =============================================================================
import canvasSize from '../src/index';
import { expect } from 'chai';


// Constants & Variables
// =============================================================================
const hideConsoleMsgs = false;


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
    this.timeout(10000);

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

        it('triggers onError callback (width & height)', function(done) {
            const testWidth  = 1000000;
            const testHeight = testWidth;

            canvasSize.test({
                width : testWidth,
                height: testHeight,
                onError(width, height) {
                    handleError(title, width, height);
                    expect(width).to.equal(testWidth);
                    expect(height).to.equal(testHeight);
                    done();
                }
            });
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

        it('triggers onSuccess callback (width & height)', function(done) {
            const testContext = this;
            const testWidth   = 1;
            const testHeight  = testWidth;

            canvasSize.test({
                width : testWidth,
                height: testHeight,
                onError(width, height) {
                    handleError(title, width, height, testContext);
                },
                onSuccess(width, height) {
                    handleSuccess(title, width, height);
                    expect(width).to.equal(testWidth);
                    expect(height).to.equal(testHeight);
                    done();
                }
            });
        });

        it('triggers onSuccess callback (sizes)', function(done) {
            const testContext = this;
            const testSizes   = [
                [3000000, 3000000],
                [2000000, 2000000],
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
});
