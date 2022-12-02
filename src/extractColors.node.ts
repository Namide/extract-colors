import Color from './color/Color'
import { createFinalColor } from './color/FinalColor'
import Extractor from './extract/Extractor'
import sortColors from "./sort/sortColors"
import { FinalColor } from './types/Color'
import type { NodeOptions, SorterOptions } from "./types/Options"

const sortFinalColors = (colors: Color[], pixels: number, options?: SorterOptions) => {
  const list = sortColors(colors, pixels, options)
  return list.map(color => createFinalColor(color, pixels))
}

/**
 * Extract colors from an ImageData object.
 *
 * @param {Array<Number>} imageData
 * @param {Object=} options  Optional data
 * @param {String=} options.pixels  Total pixel number of the resized picture for calculation
 * @param {String=} options.distance  From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param {String=} options.splitPower  Approximation power in the first color splitting during process (from 2 to 15)
 * @param {String=} options.colorValidator  Callback with test to enable only some colors
 * @returns {Array<Object>}
 */
const extractColorsFromImageData = ({ data, width = Number.MAX_SAFE_INTEGER, height = Number.MAX_SAFE_INTEGER }: { data: Uint8ClampedArray | number[], width?: number, height?: number }, options?: NodeOptions) => {
  const extractor = new Extractor(options)
  const colors = extractor.process({ data, width, height })
  return sortFinalColors(colors, extractor.pixels, options)
}

const extractColors = (imageData: ImageData, options?: NodeOptions) => {
  if (imageData.data) {
    return new Promise((resolve: (value: FinalColor[]) => void) => {
      resolve(extractColorsFromImageData(imageData, options))
    })
  }

  throw new Error('Send imageData to extractColors')
}

const extractColorsFromImage = () => {
  throw new Error('Can not use extractColorsFromImage for Node.js')
}

const extractColorsFromSrc = () => {
  throw new Error('Can not use extractColorsFromSrc for Node.js')
}

export {
  extractColorsFromImageData,
  extractColorsFromImage,
  extractColorsFromSrc,
  extractColors
}

export default extractColors
