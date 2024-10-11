import WorkerWrapper from "./worker?worker&inline";
import cleanInputs, { cleanInputsWarnings } from "./extract/cleanInputs";
import { BrowserOptions, ImageDataAlt } from "./types/Options";

/**
 * Extract colors from a picture with Web Worker support.
 *
 * @param picture image source or image data
 * @param options Process configuration
 * @param options.pixels Total pixel number of the resized picture for calculation
 * @param options.distance From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param options.colorValidator Test function to enable only some colors
 * @param options.saturationDistance Minimum saturation value between two colors otherwise the colors will be merged (from 0 to 1)
 * @param options.lightnessDistance inimum lightness value between two colors otherwise the colors will be merged (from 0 to 1)
 * @param options.hueDistance inimum hue value between two colors otherwise the colors will be merged (from 0 to 1)
 * @param options.requestMode support for CORS (only for Web Workers in browser)
 *
 * @returns List of extracted colors
 */
export const extractColors = (
  picture: string | ImageData | ImageDataAlt,
  options?: BrowserOptions,
) => {
  if (__DEV__) {
    cleanInputsWarnings(options);
  }

  if (picture instanceof HTMLImageElement) {
    if (__DEV__) {
      console.warn(
        "HTMLImageElement not enable on worker, please send 'src' or image data instead HTMLImageElement",
      );
    }

    // HTMLImageElement not enable on Worker, switch to src fallback
    picture = picture.src;
  }

  const [_pixels, _distance, _colorValidator, ..._cleanInputsRest] =
    cleanInputs(options);

  // Wrap worker inside Promise
  return new Promise((resolve, reject) => {
    try {
      const worker: Worker = new WorkerWrapper();
      worker.postMessage([
        picture,
        [_pixels, _distance, _colorValidator.toString(), ..._cleanInputsRest],
      ]);
      worker.addEventListener("message", (message) => {
        resolve(message.data);
        worker.terminate();
      });
      worker.addEventListener("error", (error) => {
        reject(error);
        worker.terminate();
      });
    } catch (error) {
      reject(error);
    }
  });
};
