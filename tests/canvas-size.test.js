// Dependencies
// =============================================================================
import canvasSize from '../src/index';
import { expect } from 'chai';

// Functions
// =============================================================================
// eslint-disable-next-line no-unused-vars
function handleError(height, width) {
    console.log(`ERROR: ${width} x ${height} (W x H)`);
}

// eslint-disable-next-line no-unused-vars
function handleSuccess(height, width) {
    console.log(`SUCCESS: ${width} x ${height} (W x H)`);
}


// Suite
// =============================================================================
describe('canvasSize', function() {
    this.timeout(10000);

    // maxArea()
    // -------------------------------------------------------------------------
    // Chrome 70        : 16384
    // Edge 17          : 16384
    // Firefox 63       : 11180
    // IE11 (VM - BS)   : 10914
    // IE11 (VM - PD)   :  7948
    // Safari 12        : 16384
    // Safari (iOS 9-12):  4096
    describe('maxArea()', function() {
        it('determines max area', function(done) {
            canvasSize.maxArea({
                // max : 10914,
                // step: 2,
                onError: handleError,
                onSuccess(height, width) {
                    handleSuccess(height, width);
                    expect(height).to.be.a('number');
                    expect(height % 1).to.equal(0);
                    expect(width).to.be.a('number');
                    expect(width % 1).to.equal(0);
                    done();
                }
            });
        });
    });

    // maxHeight()
    // -------------------------------------------------------------------------
    // Chrome 70        :   32767
    // Edge 17          :   16384
    // Firefox 63       :   32767
    // IE11 (VM - BS)   :   16384
    // IE11 (VM - PD)   :    8192
    // Safari 12        : 8388607
    // Safari (iOS 9-12): 8388607
    describe('maxHeight()', function() {
        it('determines max height', function(done) {
            canvasSize.maxHeight({
                // max : 32767,
                // step: 2,
                // onError: handleError,
                onSuccess(height, width) {
                    // handleSuccess(height, width);
                    expect(height).to.be.a('number');
                    expect(height % 1).to.equal(0);
                    done();
                }
            });
        });
    });

    // maxWidth()
    // -------------------------------------------------------------------------
    // Chrome 70        :   32767
    // Edge 17          :   16384
    // Firefox 63       :   32767
    // IE11 (VM - BS)   :   16384
    // IE11 (VM - PD)   :    8192
    // Safari 12        : 4194303
    // Safari (iOS 9-12): 4194303
    describe('maxWidth()', function() {
        it('determines max width', function(done) {
            canvasSize.maxWidth({
                // max : 8192,
                // step: 1,
                // onError: handleError,
                onSuccess(height, width) {
                    // handleSuccess(height, width);
                    expect(width).to.be.a('number');
                    expect(width % 1).to.equal(0);
                    done();
                }
            });
        });
    });

    // test()
    // -------------------------------------------------------------------------
    describe('test()', function() {
        it('triggers onError callback', function() {
            let testFail = null;

            canvasSize.test({
                height: 100000,
                width : 100000,
                onError(height, width) {
                    // handleError(height, width);
                    expect(height).to.be.a('number');
                    expect(height % 1).to.equal(0);
                    expect(width).to.be.a('number');
                    expect(width % 1).to.equal(0);

                    testFail = true;
                }
            });

            expect(testFail).to.be.true;
        });

        it('triggers onSuccess callback', function() {
            let testPass = null;

            canvasSize.test({
                height: 1,
                width : 1,
                onSuccess(height, width) {
                    // handleSuccess(height, width);
                    expect(height).to.be.a('number');
                    expect(height % 1).to.equal(0);
                    expect(width).to.be.a('number');
                    expect(width % 1).to.equal(0);

                    testPass = true;
                }
            });

            expect(testPass).to.be.true;
        });
    });
});
