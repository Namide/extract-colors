import InlineWorker from "./worker?worker&inline";
import type { BrowserOptions, ImageDataAlt } from "./types/Options";
import { FinalColor } from "./types/Color";

/**
 * Extract colors from a picture.
 *
 * @param picture image source or image data
 * @param options Process configuration
 * @param options.pixels Total pixel number of the resized picture for calculation
 * @param options.distance From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param options.colorValidator Test function to enable only some colors
 * @param options.saturationDistance Minimum saturation value between two colors otherwise the colors will be merged (from 0 to 1)
 * @param options.lightnessDistance inimum lightness value between two colors otherwise the colors will be merged (from 0 to 1)
 * @param options.hueDistance inimum hue value between two colors otherwise the colors will be merged (from 0 to 1)
 * @param options.crossOrigin support for CORS (only for browser)
 * @param options.requestMode support for CORS (only for Web Workers in browser)
 *
 * @returns List of extracted colors
 */
export function extractColors(
  ...params: [
    picture: string | ImageData | ImageDataAlt,
    options?: BrowserOptions,
  ]
): Promise<FinalColor[]> {
  if (params[0] instanceof Image) {
    if (__DEV__) {
      console.error(
        "HTMLImageElement not enable on worker, please send 'src' or image data instead HTMLImageElement",
      );
    }

    // Replace Image by the source
    params[0] = params[0].src;
  }

  return new Promise((resolve, reject) => {
    try {
      const worker: Worker = new InlineWorker();
      worker.postMessage(params);
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
}
