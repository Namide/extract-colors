import Color from "./color/Color";
import sortColors from "./sort/sortColors";
import { createFinalColor } from "./color/FinalColor";
import type { ImageDataAlt, OptionsCleaned } from "./types/Options";
import extractor from "./extract/extractor";
import type { FinalColor } from "./types/Color";

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
const _sortFinalColors = (
  _colors: Color[],
  _pixels: number,
  _hueDistance: number,
  _saturationDistance: number,
  _lightnessDistance: number
) => {
  const list = sortColors(
    _colors,
    _pixels,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance
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
const _getImageData = (
  _image: HTMLImageElement | ImageBitmap,
  _pixels: number
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

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
  context.drawImage(
    _image,
    0,
    0,
    _image.width,
    _image.height,
    0,
    0,
    width,
    height
  );

  return context.getImageData(0, 0, width, height);
};

/**
 * Extract colors from an ImageData object.
 *
 * @param imageData Data of the image
 * @param cleanOptions Process configuration options cleaned
 *
 * @returns List of extracted colors
 */
const _extractColorsFromImageData = (
  imageData: ImageData | ImageDataAlt,
  cleanOptions: OptionsCleaned
) => {
  const [
    _pixels,
    _distance,
    _colorValidator,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance,
  ] = cleanOptions;
  const { colors, count } = extractor(
    imageData,
    _pixels,
    _distance,
    _colorValidator
  );
  return _sortFinalColors(
    colors,
    count,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance
  );
};

/**
 * Extract colors from an ImageBitmap object.
 *
 * @param image image bitmap
 * @param cleanOptions Process configuration options cleaned
 *
 * @returns List of extracted colors
 */
const _extractColorsFromImageBitmap = async (
  image: ImageBitmap,
  cleanOptions: OptionsCleaned
): Promise<FinalColor[]> => {
  const [
    _pixels,
    _distance,
    _colorValidator,
    _hueDistance,
    _saturationDistance,
    _lightnessDistance,
  ] = cleanOptions;

  const imageData = _getImageData(image, _pixels);
  const { colors, count } = extractor(
    imageData,
    _pixels,
    _distance,
    _colorValidator
  );

  return _sortFinalColors(
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
 * @param cleanOptions Process configuration options cleaned
 *
 * @returns List of extracted colors
 */
const _extractColorsFromSrc = async (
  src: string,
  cleanOptions: OptionsCleaned
): Promise<FinalColor[]> => {
  const response = await fetch(src, { mode: cleanOptions[7] });
  const blob = await response.blob();
  const bitmap = await createImageBitmap(blob);
  const colors = await _extractColorsFromImageBitmap(bitmap, cleanOptions);
  bitmap.close();
  return colors;
};

/**
 * Extract colors from a picture.
 *
 * @param picture image source or image data (node.js context only support image data)
 * @param cleanOptions Process configuration options cleaned
 * @param callback Function with list of extracted colors in first parameter
 */
const extractColors = async (
  picture: string | ImageData | ImageDataAlt,
  cleanOptions: OptionsCleaned,
  callback: (list: FinalColor[]) => void
) => {
  if (
    picture instanceof ImageData ||
    (picture instanceof Object && (picture as ImageDataAlt).data)
  ) {
    return callback(
      _extractColorsFromImageData(
        picture as ImageData | ImageDataAlt,
        cleanOptions
      )
    );
  }

  if (typeof picture === "string") {
    return callback(await _extractColorsFromSrc(picture, cleanOptions));
  }

  throw new Error(`Can not analyse picture`);
};

// Listend and send data to Worker Wrapper
onmessage = (message) => {
  const [
    picture,
    [_pixels, _distance, _colorValidatorStr, ..._cleanInputsRest],
  ] = message.data as Parameters<typeof extractColors>;
  extractColors(
    picture,
    [
      _pixels,
      _distance,
      Function(`return ${_colorValidatorStr}`)(),
      ..._cleanInputsRest,
    ],
    postMessage
  );
};
