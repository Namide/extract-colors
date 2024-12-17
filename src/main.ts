import type { ColorClassification, FinalColor } from "./types/Color";
import type {
  AddDefaultOptions,
  BrowserImageOptions,
  BrowserOptions,
  ClassifyOptions,
  ImageDataAlt,
  ImageOptions,
  RefineOptions,
  WorkerImageOptions,
} from "./types/Options";
import cleanInputs, { testInputs } from "./process/cleanInputs";
import { checkIsBrowser, checkIsNode, checkIsWorker } from "./context";
import { extract as extractCore } from "./process/extract";
import { refine as refineCore } from "./process/refine";
import { classify as classifyCore } from "./process/classify";
import { addDefault as addDefaultCore } from "./process/addDefault";
import RGBColor from "./color/RGBColor";
import { PartialClassified } from "./types/Classified";
import {
  loadImageToImageData,
  srcFetchImageData,
  srcLoadImageData,
} from "./image";

/**
 * Extract colors from a path.
 * The image will be downloaded.
 *
 * @param src Image source
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function srcToImageData(
  src: string,
  options: (BrowserImageOptions | WorkerImageOptions) & ImageOptions = {}
): Promise<ImageDataAlt> {
  // Node.js version
  if (checkIsNode()) {
    if (__DEV__) {
      throw new Error(
        "You can not use image path with Node.js. Please use an external library (example: get-pixels) to convert your image path to an ImageData object"
      );
    }
    return null as unknown as ImageDataAlt;
  }

  if (__DEV__) {
    testInputs(options);
  }

  const inputs = cleanInputs(options);

  // Web Worker version
  if (checkIsWorker()) {
    if (__DEV__) {
      if (options?.crossOrigin) {
        console.warn(
          "options.crossOrigin not supported in Web Worker, use options.requestMode instead"
        );
      }
    }

    return await srcFetchImageData(src, inputs.pixels, inputs.requestMode);
  }

  // Browser version
  if (__DEV__) {
    if (options?.requestMode) {
      console.warn(
        "options.requestMode not supported in Browser, use options.crossOrigin instead"
      );
    }
  }

  return await srcLoadImageData(src, inputs.pixels, inputs.crossOrigin);
}

/**
 * Extract colors from an HTMLImageElement.
 * Browser only
 *
 * @param image HTML image element
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
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export async function imageToImageData(
  image: HTMLImageElement,
  options: ImageOptions = {}
): Promise<ImageDataAlt> {
  // Node.js version
  if (checkIsNode()) {
    if (__DEV__) {
      throw new Error(
        "You can not use imageToImageData with Node.js. Please use an external library (example: get-pixels) to convert your image path to an ImageData object"
      );
    }
    return null as unknown as ImageData;
  }

  // HTMLImageElement not enable on Worker, switch to src fallback
  if (checkIsWorker()) {
    if (__DEV__) {
      console.warn(
        "HTMLImageElement not enable on worker, a fallback is used to extract src from your HTMLImageElement, please send 'src' instead HTMLImageElement"
      );
    }

    // Fallback
    if (image.src) {
      if (__DEV__) {
        testInputs(options);
      }

      const { pixels, requestMode } = cleanInputs(options);

      return await srcFetchImageData(image.src, pixels, requestMode);
    }
  }

  if (__DEV__) {
    testInputs(options);
  }

  // Browser version
  const { pixels, crossOrigin } = cleanInputs(options);
  return await loadImageToImageData(image, pixels, crossOrigin);
}

/**
 * Extract RGB colors from an ImageData object.
 *
 * @param imageData Data of the image
 * @param options Process configuration
 * @param options.pixels Total pixel number of the resized picture for calculation
 * @param options.distance From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param options.colorValidator Test function to enable only some colors
 * @param options.saturationDistance Minimum saturation value between two colors otherwise the colors will be merged (from 0 to 1)
 * @param options.lightnessDistance inimum lightness value between two colors otherwise the colors will be merged (from 0 to 1)
 * @param options.hueDistance minimum hue value between two colors otherwise the colors will be merged (from 0 to 1)
 * @param options.crossOrigin support for CORS (only for browser)
 * @param options.requestMode support for CORS (only for Web Workers in browser)
 *
 * @returns List of extracted colors
 */
export function extract<Type extends ColorClassification>(
  imageData: ImageData | ImageDataAlt,
  options: BrowserOptions<Type> = {}
) {
  if (__DEV__) {
    testInputs(options);
  }

  const { pixels, fastDistance, colorValidator } = cleanInputs(options);

  return extractCore(imageData, pixels, fastDistance, colorValidator);
}

export function refine(
  { colors, count }: { colors: RGBColor[]; count: number },
  options: RefineOptions = {}
): FinalColor[] {
  if (__DEV__) {
    testInputs(options);
  }

  const { distance } = cleanInputs(options);

  return refineCore(colors, count, distance);
}

export function classify<Type extends ColorClassification>(
  colors: FinalColor[],
  options: ClassifyOptions<Type> = {}
) {
  if (__DEV__) {
    testInputs(options);
  }

  const { colorClassifications } = cleanInputs(options);
  return classifyCore(colors, colorClassifications);
}

export function addDefault<Type extends ColorClassification>(
  classified: PartialClassified<Type>,
  options: AddDefaultOptions<Type> = {}
) {
  if (__DEV__) {
    testInputs(options);
  }

  const { defaultColors } = cleanInputs(options);
  return addDefaultCore(classified, defaultColors);
}

export async function extractColors<Type extends ColorClassification>(
  picture: string | HTMLImageElement | ImageData | ImageDataAlt,
  options: BrowserOptions<Type> = {}
) {
  let imageData: ImageDataAlt | undefined;

  if (__DEV__) {
    testInputs(options);
  }

  const inputs = cleanInputs(options);

  if (checkIsWorker()) {
    // Worker version
    if (__DEV__) {
      if (checkIsWorker()) {
        if (options?.crossOrigin) {
          console.warn(
            "options.crossOrigin not supported in Web Worker, use options.requestMode instead"
          );
        }
      }
    }

    if (picture instanceof Image) {
      if (__DEV__) {
        console.warn(
          "HTMLImageElement not enable on worker, a fallback is used to extract src from your HTMLImageElement, please send 'src' instead HTMLImageElement"
        );
      }

      // Fallback
      if (picture.src) {
        imageData = await srcFetchImageData(
          picture.src,
          inputs.pixels,
          inputs.requestMode
        );
      }
    }

    if (
      picture instanceof ImageData ||
      (picture instanceof Object && (picture as ImageDataAlt).data)
    ) {
      imageData = picture as ImageData | ImageDataAlt;
    }

    if (typeof picture === "string") {
      imageData = await srcToImageData(picture, options);
    }
  } else if (checkIsBrowser()) {
    // Browser version
    if (__DEV__) {
      if (checkIsBrowser()) {
        if (options?.requestMode) {
          console.warn(
            "options.requestMode not supported in Browser, use options.crossOrigin instead"
          );
        }
      }
    }

    if (picture instanceof Image) {
      imageData = await loadImageToImageData(
        picture,
        inputs.pixels,
        inputs.crossOrigin
      );
    } else if (
      picture instanceof ImageData ||
      (picture instanceof Object && (picture as ImageDataAlt).data)
    ) {
      imageData = picture as ImageData | ImageDataAlt;
    } else if (typeof picture === "string") {
      imageData = await srcToImageData(picture, options);
    }
  } else if (checkIsNode()) {
    // Node.js version
    if (__DEV__) {
      if (picture instanceof String) {
        throw new Error(
          "Send imageData to extractColors (Image src or HTMLImageElement not supported in Nodejs)"
        );
      }

      if (!(picture as ImageData).data) {
        throw new Error(
          "Send imageData to extractColors (needed for Node.js). Please use an external library (example: get-pixels) to convert your image path to an ImageData object"
        );
      }

      if (options?.crossOrigin) {
        console.warn("options.crossOrigin not supported in Node.js");
      }
    }

    imageData = picture as ImageData | ImageDataAlt;
  }

  if (imageData) {
    const { colors, count } = extractCore(
      imageData,
      inputs.pixels,
      inputs.fastDistance,
      inputs.colorValidator
    );
    const hslColors = refineCore(colors, count, inputs.distance);
    const classedColors = classifyCore(hslColors, inputs.colorClassifications);
    return addDefaultCore(classedColors, inputs.defaultColors);
  }

  throw new Error(`Can not analyse picture`);
}
