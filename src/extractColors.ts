import Color from "./color/Color"
import sortColors from "./sort/sortColors"
import { createFinalColor } from "./color/FinalColor"
import { BrowserOptions, NodeOptions } from "./types/Options"
import cleanInputs from "./extract/cleanInputs"
import extractor from "./extract/extractor"

/**
 * Sort colors and generate standard list of colors.
 */
export const sortFinalColors = (_colors: Color[], _pixels: number, _hueDistance: number, _saturationDistance: number, _lightnessDistance: number) => {
  const list = sortColors(_colors, _pixels, _hueDistance, _saturationDistance, _lightnessDistance)
  return list.map(color => createFinalColor(color, _pixels))
}

/**
 * Extract colors from an ImageData object.
 */
export const extractColorsFromImageData = (imageData: ImageData | { data: Uint8ClampedArray | number[], width?: number, height?: number }, options: NodeOptions | BrowserOptions = {}) => {
  const [_pixels, _distance, _colorValidator, _hueDistance, _saturationDistance, _lightnessDistance] = cleanInputs(options)
  const colors = extractor(imageData, _pixels, _distance, _colorValidator)
  const px = (imageData.width && imageData.height) ? Math.min(imageData.width * imageData.height, _pixels) : _pixels
  return sortFinalColors(colors, px, _hueDistance, _saturationDistance, _lightnessDistance)
}
