// @ts-check
import { test, expect } from '@playwright/test';
import canvasSize from '../src/index.js';
import testSizes from '../src/test-sizes.js';

function doTests(useWorker) {
  test.describe(`useWorker: ${useWorker}`, () => {
    // Setup
    // =========================================================================
    test.beforeEach(async ({ page }) => {
      await page.goto('/_blank.html');
      await page.waitForLoadState();
      await page.addScriptTag({ path: './dist/canvas-size.js' });
    });

    // Tests
    // =========================================================================
    // Worker
    // -------------------------------------------------------------------------
    if (useWorker) {
      test('creates worker when useWorker:true', async ({ page }) => {
        page.on('worker', worker => {
          expect(worker.url()).toContain('blob:');
        });
      });
    }

    // maxArea()
    // -------------------------------------------------------------------------
    test.describe('maxArea()', () => {
      test('determines max area (default sizes)', async ({ page }) => {
        const options = {
          useWorker,
        };

        const { width, height } = await page.evaluate(
          options => canvasSize.maxArea(options),
          options,
        );

        expect(width).toBeGreaterThan(1);
        expect(height).toBeGreaterThan(1);
        expect(testSizes.area).toContain(width);
        expect(testSizes.area).toContain(height);
      });

      test('determines max area (max + step)', async ({ page }) => {
        const offset = 100;
        const { width, height } = await page.evaluate(
          offset =>
            canvasSize.maxArea({
              max: Number.MAX_SAFE_INTEGER,
              step: Number.MAX_SAFE_INTEGER - offset,
            }),
          offset,
        );

        expect(width).toBe(offset);
        expect(height).toBe(offset);
      });
    });

    // maxHeight(), maxWidth()
    // -------------------------------------------------------------------------
    ['height', 'width'].forEach(dimension => {
      const methodName = `max${dimension.charAt(0).toUpperCase()}${dimension.slice(1)}`;

      test.describe(`${methodName}()`, () => {
        test(`determines max ${dimension} (default sizes)`, async ({
          page,
        }) => {
          const results = await page.evaluate(
            methodName => canvasSize[methodName]({}),
            methodName,
          );

          expect(results[dimension]).toBeGreaterThan(1);
          expect(testSizes[dimension]).toContain(results[dimension]);
        });

        test(`determines max ${dimension} (max + step)`, async ({ page }) => {
          const offset = 100;
          const results = await page.evaluate(
            ([methodName, offset]) =>
              canvasSize[methodName]({
                max: Number.MAX_SAFE_INTEGER,
                step: Number.MAX_SAFE_INTEGER - offset,
              }),
            [methodName, offset],
          );

          expect(results[dimension]).toBe(offset);
        });
      });
    });

    // test()
    // -------------------------------------------------------------------------
    test.describe('test()', () => {
      test('returns true for valid width / height integers', async ({
        page,
      }) => {
        const { success } = await page.evaluate(() =>
          canvasSize.test({
            width: 1,
            height: 1,
          }),
        );

        expect(success).toBe(true);
      });

      test('returns true for valid width / height floats', async ({ page }) => {
        const { success } = await page.evaluate(() =>
          canvasSize.test({
            width: 1.1,
            height: 1.1,
          }),
        );

        expect(success).toBe(true);
      });

      test('returns false for invalid width / height', async ({ page }) => {
        const { success } = await page.evaluate(async () =>
          canvasSize.test({
            width: Number.MAX_SAFE_INTEGER,
            height: Number.MAX_SAFE_INTEGER,
          }),
        );

        expect(success).toBe(false);
      });

      test('triggers onError callback (sizes)', async ({ page }) => {
        const sizes = [
          [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
          [Number.MAX_SAFE_INTEGER - 1, Number.MAX_SAFE_INTEGER - 1],
          [Number.MAX_SAFE_INTEGER - 2, Number.MAX_SAFE_INTEGER - 2],
        ];
        const result = await page.evaluate(async sizes => {
          const errorArr = [];

          await canvasSize.test({
            sizes,
            onError(width, height, benchmark) {
              errorArr.push([width, height]);
            },
          });

          return Promise.resolve(errorArr);
        }, sizes);

        expect(result).toEqual(sizes);
      });

      test('triggers onSuccess callback (sizes)', async ({ page }) => {
        const sizes = [
          [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
          [1, 1],
        ];
        const result = await page.evaluate(
          sizes =>
            new Promise(resolve => {
              canvasSize.test({
                sizes,
                onSuccess(width, height, benchmark) {
                  resolve([width, height]);
                },
              });
            }),
          sizes,
        );

        expect(result).toEqual([1, 1]);
      });
    });
  });
}

doTests(false);
// doTests(true);
