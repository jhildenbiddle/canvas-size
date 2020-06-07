/* eslint-env worker */

/* istanbul ignore next */
export default function canvasWorker() {
    function canvasTest(settings) {
        const { job, width, height, fill } = settings;
        const cvs = new OffscreenCanvas(width, height);
        const ctx = cvs.getContext('2d');

        ctx.fillRect.apply(ctx, fill);

        // Verify image data (Pass = 255, Fail = 0)
        const isTestPass = Boolean(ctx.getImageData.apply(ctx, fill).data[3]);

        self.postMessage({
            job,
            width,
            height,
            isTestPass
        });
    }

    self.onmessage = function(e) {
        canvasTest(e.data);
    };
}
