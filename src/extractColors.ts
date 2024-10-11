import cleanInputs, { testInputs } from "./extract/cleanInputs";
import extractor from "./extract/extractor";
import {
  checkIsBrowser,
  checkIsNode,
  checkIsWorker,
  extractImageData,
  sortFinalColors,
} from "./helpers";
import { FinalColor } from "./types/Color";
import { BrowserOptions, ImageDataAlt, NodeOptions } from "./types/Options";

/**
 * Extract colors from an ImageData object.
 *
 * @param imageData Data of the image
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
export const extractColorsFromImageData = (
  imageData: ImageData | ImageDataAlt,
  options: NodeOptions | BrowserOptions = {}
) => {
  if (__DEV__) {
    testInputs(options);
  }

  const [
    _pixels,
    _distance,
    _colorValidator,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance,
  ] = cleanInputs(options);
  const { colors, count } = extractor(
    imageData,
    _pixels,
    _distance,
    _colorValidator
  );
  return sortFinalColors(
    colors,
    count,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance
  );
};

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
export const extractColorsFromImage = async (
  image: HTMLImageElement,
  options: BrowserOptions = {}
): Promise<FinalColor[]> => {
  // Node.js version
  if (checkIsNode()) {
    if (__DEV__) {
      throw new Error(
        "Use extractColors instead extractColorsFromImage for Node.js"
      );
    }
    return [];
  }

  if (__DEV__) {
    testInputs(options);
  }

  // Browser version
  const [
    _pixels,
    _distance,
    _colorValidator,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance,
    _crossOrigin,
  ] = cleanInputs(options);
  image.crossOrigin = _crossOrigin;
  return new Promise((resolve: (value: FinalColor[]) => void) => {
    const extract = (image: HTMLImageElement) => {
      const imageData = extractImageData(image, _pixels);
      const { colors, count } = extractor(
        imageData,
        _pixels,
        _distance,
        _colorValidator
      );
      resolve(
        sortFinalColors(
          colors,
          count,
          _hueDistance,
          _saturationDistance,
          _lightnessDistance
        )
      );
    };

    if (image.complete) {
      extract(image);
    } else {
      const imageLoaded = () => {
        image.removeEventListener("load", imageLoaded);
        extract(image);
      };
      image.addEventListener("load", imageLoaded);
    }
  });
};

export const extractColorsFromImageBitmap = async (
  image: ImageBitmap,
  options: BrowserOptions = {}
): Promise<FinalColor[]> => {
  // Node.js version
  if (checkIsNode()) {
    if (__DEV__) {
      throw new Error(
        "Use extractColors instead extractColorsFromImageBitmap for Node.js"
      );
    }
    return [];
  }

  if (__DEV__) {
    testInputs(options);
  }

  const [
    _pixels,
    _distance,
    _colorValidator,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance,
  ] = cleanInputs(options);

  const imageData = extractImageData(image, _pixels);
  const { colors, count } = extractor(
    imageData,
    _pixels,
    _distance,
    _colorValidator
  );

  return sortFinalColors(
    colors,
    count,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance
  );
};

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
export const extractColorsFromSrc = async (
  src: string,
  options: BrowserOptions = {}
): Promise<FinalColor[]> => {
  // Node.js version
  if (checkIsNode()) {
    if (__DEV__) {
      throw new Error("Can not use extractColorsFromSrc for Node.js");
    }
    return [];
  }

  if (__DEV__) {
    testInputs(options);
  }

  // Web Worker version
  if (checkIsWorker()) {
    const inputs = cleanInputs(options);
    const response = await fetch(src, { mode: inputs[7] });
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob);
    const colors = await extractColorsFromImageBitmap(bitmap, options);
    bitmap.close();
    return colors;
  }

  // Browser version
  const image = new Image();
  image.src = src;
  return extractColorsFromImage(image, options);
};

/**
 * Extract colors from a picture.
 *
 * @param picture Image, image source or image data (node.js context only support image data)
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
export const extractColors = (
  picture: string | HTMLImageElement | ImageData | ImageDataAlt,
  options?: BrowserOptions
) => {
  // Browser version
  if (checkIsBrowser()) {
    if (__DEV__) {
      if (options?.requestMode) {
        console.warn(
          "options.requestMode not supported in Browser, use options.crossOrigin instead"
        );
      }
    }

    if (picture instanceof Image) {
      return extractColorsFromImage(picture, options);
    }

    if (
      picture instanceof ImageData ||
      (picture instanceof Object && picture.data)
    ) {
      return new Promise((resolve: (value: FinalColor[]) => void) => {
        resolve(extractColorsFromImageData(picture, options));
      });
    }

    if (typeof picture === "string") {
      return extractColorsFromSrc(picture, options);
    }
  }

  // Worker version
  if (checkIsWorker()) {
    if (__DEV__) {
      if (options?.crossOrigin) {
        console.warn(
          "options.crossOrigin not supported in Web Worker, use options.requestMode instead"
        );
      }
    }

    if (
      picture instanceof ImageData ||
      (picture instanceof Object && (picture as ImageDataAlt).data)
    ) {
      return new Promise((resolve: (value: FinalColor[]) => void) => {
        resolve(
          extractColorsFromImageData(
            picture as ImageData | ImageDataAlt,
            options
          )
        );
      });
    }

    if (typeof picture === "string") {
      return extractColorsFromSrc(picture, options);
    }

    // HTMLImageElement not enable on Worker, switch to src fallback
    if ((picture as HTMLImageElement).src) {
      if (__DEV__) {
        console.warn(
          "HTMLImageElement not enable on worker, a fallback is used to extract src from your HTMLImageElement, please send 'src' instead HTMLImageElement"
        );
      }
      return extractColorsFromSrc((picture as HTMLImageElement).src, options);
    }
  }

  // Node.js version
  if (checkIsNode()) {
    if (__DEV__) {
      if (picture instanceof String) {
        throw new Error(
          "Send imageData to extractColors (Image src or HTMLImageElement not supported in Nodejs)"
        );
      }

      if (!(picture as ImageData).data) {
        throw new Error("Send imageData to extractColors");
      }

      if (options?.crossOrigin) {
        console.warn("options.crossOrigin not supported in Node.js");
      }
    }

    return new Promise((resolve: (value: FinalColor[]) => void) => {
      resolve(
        extractColorsFromImageData(picture as ImageData | ImageDataAlt, options)
      );
    });
  }

  throw new Error(`Can not analyse picture`);
};
