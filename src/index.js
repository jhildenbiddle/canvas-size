import canvasTest from './canvas-test.js';
import testSizes from './test-sizes.js';

// Constants & Variables
// =============================================================================
const defaults = {
  max: null,
  min: 1,
  sizes: [],
  step: 1024,
  useWorker: false,
  // Callbacks
  onError: Function.prototype,
  onSuccess: Function.prototype,
};
const workerJobs = {
  // jobID: {
  //     onError: fn(),
  //     onSuccess: fn()
  // }
};

// Functions (Private)
// =============================================================================
/**
 * Creates a 2d array of canvas dimensions either from the default testSizes
 * object or the width/height/min/step values provided.
 *
 * @param   {object} settings
 * @param   {number} settings.width
 * @param   {number} settings.height
 * @param   {number} settings.min
 * @param   {number} settings.step
 * @param   {number[][]} settings.sizes
 * @returns {number[][]}
 */
function createSizesArray(settings) {
  const isArea = settings.width === settings.height;
  const isWidth = settings.height === 1;
  const isHeight = settings.width === 1;
  const sizes = [];

  // Use settings.sizes
  if (!settings.width || !settings.height) {
    settings.sizes.forEach(testSize => {
      const width = isArea || isWidth ? testSize : 1;
      const height = isArea || isHeight ? testSize : 1;

      sizes.push([width, height]);
    });
  }
  // Generate sizes from width, height, and step
  else {
    const testMin = settings.min || defaults.min;
    const testStep = settings.step || defaults.step;
    let testSize = Math.max(settings.width, settings.height);

    while (testSize >= testMin) {
      const width = isArea || isWidth ? testSize : 1;
      const height = isArea || isHeight ? testSize : 1;

      sizes.push([width, height]);
      testSize -= testStep;
    }
  }

  return sizes;
}

/**
 * Handles calls from maxArea(), maxHeight(), maxWidth(), and test() methods.
 *
 * @param {object} settings
 * @param {number[][]} settings.sizes
 * @param {function} settings.onError
 * @param {function} settings.onSuccess
 * @returns {Promise}
 */
function handleMethod(settings) {
  const isBrowser = typeof window !== 'undefined';
  const hasPromiseSupport = isBrowser && 'Promise' in window;
  const hasCanvasSupport = isBrowser && 'HTMLCanvasElement' in window;
  const hasOffscreenCanvasSupport = isBrowser && 'OffscreenCanvas' in window;
  const jobID = URL.createObjectURL(new Blob([])).slice(-36);
  const totalTimeStart = performance.now();
  const { onError, onSuccess, ...settingsWithoutCallbacks } = settings;

  const getTotalTime = () => parseInt(performance.now() - totalTimeStart);

  let worker = null;

  /* istanbul ignore if */
  if (!hasCanvasSupport) {
    return false;
  }

  // Create web worker
  if (settings.useWorker && hasOffscreenCanvasSupport) {
    const js = `
            var canvasTest = ${canvasTest.toString()};
            onmessage = function(e) {
                canvasTest(e.data);
            };
        `;
    const blob = new Blob([js], { type: 'application/javascript' });
    const blobURL = URL.createObjectURL(blob);

    worker = new Worker(blobURL);
    URL.revokeObjectURL(blobURL);

    // Listen for messages from worker
    worker.onmessage = function (e) {
      const { width, height, testTime, isTestPass } = e.data;
      const results = { width, height, testTime, totalTime: getTotalTime() };

      if (isTestPass) {
        workerJobs[jobID].onSuccess(results);

        delete workerJobs[jobID];
      } else {
        workerJobs[jobID].onError(results);
      }
    };
  }

  // Promise
  if (hasPromiseSupport) {
    return new Promise(resolve => {
      const promiseSettings = {
        ...settings,
        onError({ width, height, testTime }) {
          const results = {
            width,
            height,
            testTime,
            totalTime: getTotalTime(),
          };

          let isLastTest;

          // If running on the main thread, an empty settings.sizes
          // array indicates the last test.
          if (settings.sizes.length === 0) {
            isLastTest = true;
          }
          // If running in a web worker, the settings.sizes array
          // accessible to this callback wil not be modified because a
          // copy of the settings object is sent to the worker.
          // Therefore, a comparison of the width and height returned
          // to this callback and the last [width, height] item in the
          // settings.sizes array is used to determine the last test.
          else {
            const [[lastWidth, lastHeight]] = settings.sizes.slice(-1);
            isLastTest = width === lastWidth && height === lastHeight;
          }

          onError(results);

          if (isLastTest) {
            resolve({ ...results, success: false });
          }
        },
        onSuccess({ width, height, testTime }) {
          const results = {
            width,
            height,
            testTime,
            totalTime: getTotalTime(),
          };

          onSuccess(results);
          resolve({ ...results, success: true });
        },
      };

      if (worker) {
        const { onError, onSuccess } = promiseSettings;

        // Store callbacks in workerJobs object
        workerJobs[jobID] = { onError, onSuccess };

        // Send message to work
        worker.postMessage(settingsWithoutCallbacks);
      } else {
        canvasTest(promiseSettings);
      }
    });
  }
  // Legacy (no Promise support)
  else {
    if (worker) {
      // Store callbacks in workerJobs object
      workerJobs[jobID] = { onError, onSuccess };

      // Send message to worker
      worker.postMessage(settingsWithoutCallbacks);
    } else {
      return canvasTest(settings);
    }
  }
}

// Methods
// =============================================================================
const canvasSize = {
  /**
   * Determines maximum area of an HTML canvas element. When `max` is
   * unspecified, an optimized test will be performed using known maximum
   * values from a variety of browsers and platforms.
   *
   * @param {object} [options]
   * @param {number} [options.max]
   * @param {number} [options.min=1]
   * @param {number} [options.step=1024]
   * @param {boolean} [options.useWorker=false]
   * @param {function} [options.onError]
   * @param {function} [options.onSuccess]
   * @returns {Promise}
   */
  maxArea(options = {}) {
    const sizes = createSizesArray({
      width: options.max,
      height: options.max,
      min: options.min,
      step: options.step,
      sizes: [...testSizes.area],
    });
    const settings = { ...defaults, ...options, sizes };

    return handleMethod(settings);
  },

  /**
   * Determines maximum height of an HTML canvas element. When `max` is
   * unspecified, an optimized test will be performed using known maximum
   * values from a variety of browsers and platforms.
   *
   * @param {object} [options]
   * @param {number} [options.max]
   * @param {number} [options.min=1]
   * @param {number} [options.step=1024]
   * @param {boolean} [options.useWorker=false]
   * @param {function} [options.onError]
   * @param {function} [options.onSuccess]
   * @returns {Promise}
   */
  maxHeight(options = {}) {
    const sizes = createSizesArray({
      width: 1,
      height: options.max,
      min: options.min,
      step: options.step,
      sizes: [...testSizes.height],
    });
    const settings = { ...defaults, ...options, sizes };

    return handleMethod(settings);
  },

  /**
   * Determines maximum width of an HTML canvas element. When `max` is
   * unspecified, an optimized test will be performed using known maximum
   * values from a variety of browsers and platforms.
   *
   * @param {object} [options]
   * @param {number} [options.max]
   * @param {number} [options.min=1]
   * @param {number} [options.step=1024]
   * @param {boolean} [options.useWorker=false]
   * @param {function} [options.onError]
   * @param {function} [options.onSuccess]
   * @returns {Promise}
   */
  maxWidth(options = {}) {
    const sizes = createSizesArray({
      width: options.max,
      height: 1,
      min: options.min,
      step: options.step,
      sizes: [...testSizes.width],
    });
    const settings = { ...defaults, ...options, sizes };

    return handleMethod(settings);
  },

  /**
   * Tests ability to read pixel data from canvas of specified dimension(s).
   *
   * @param {object} [options]
   * @param {number} [options.width]
   * @param {number} [options.height]
   * @param {number[][]} [options.sizes]
   * @param {boolean} [options.useWorker=false]
   * @param {function} [options.onError]
   * @param {function} [options.onSuccess]
   * @returns {Promise}
   */
  test(options = {}) {
    const settings = { ...defaults, ...options };

    // Prevent mutation of sizes array
    settings.sizes = [...settings.sizes];

    if (settings.width && settings.height) {
      settings.sizes = [[settings.width, settings.height]];
    }

    return handleMethod(settings);
  },
};

// Exports
// =============================================================================
export default canvasSize;
