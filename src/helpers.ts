import Color from "./color/Color";
import sortColors from "./sort/sortColors";
import { createFinalColor } from "./color/FinalColor";

/**
 * Browser context detection
 *
 * @returns Is a browser context
 */
export const checkIsBrowser = () =>
  typeof window !== "undefined" && typeof window.document !== "undefined";

/**
 * Worker in Browser context detection
 *
 * @returns Is a worker browser context
 */
export const checkIsWorker = () =>
  typeof self === "object" &&
  self.constructor &&
  self.constructor.name === "DedicatedWorkerGlobalScope";

/**
 * Node.js context detection
 *
 * @returns Is Node.js context
 */
export const checkIsNode = () =>
  typeof window === "undefined" &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  typeof process !== "undefined" &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.versions != null &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.versions.node != null;

/**
 * Sort colors and generate standard list of colors.
 *
 * @param _colors List of colors
 * @param _pixels Count of pixels in the image
 * @param _hueDistance Maximal HUE distance between pixel before pixel merging
 * @param _saturationDistance Maximal saturation distance between pixel before pixel merging
 * @param _lightnessDistance Maximal lightness distance between pixel before pixel merging
 * @returns Sorted colors list
 */
export const sortFinalColors = (
  _colors: Color[],
  _pixels: number,
  _hueDistance: number,
  _saturationDistance: number,
  _lightnessDistance: number,
) => {
  const list = sortColors(
    _colors,
    _pixels,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance,
  );
  return list.map((color) => createFinalColor(color, _pixels));
};

/**
 * Extract ImageData from image.
 * Reduce image to a pixel count.
 * Browser only
 *
 * @param _image HTML image element or Image Bitmap
 * @param _pixels Count of maximum pixels accepted for the calculation
 * @returns Data of the reduced image
 */
export const extractImageData = (
  _image: HTMLImageElement | ImageBitmap,
  _pixels: number,
) => {
  const currentPixels = _image.width * _image.height;
  const width =
    currentPixels < _pixels
      ? _image.width
      : Math.round(_image.width * Math.sqrt(_pixels / currentPixels));
  const height =
    currentPixels < _pixels
      ? _image.height
      : Math.round(_image.height * Math.sqrt(_pixels / currentPixels));

  const canvas = ((width: number, height: number) => {
    if (checkIsWorker()) {
      return new OffscreenCanvas(width, height);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  })(width, height);

  const context = canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  context.drawImage(
    _image,
    0,
    0,
    _image.width,
    _image.height,
    0,
    0,
    width,
    height,
  );

  return context.getImageData(0, 0, width, height);
};
