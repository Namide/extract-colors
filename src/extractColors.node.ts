import Color from './color/Color'
import { createFinalColor } from './color/FinalColor'
import Extractor from './extract/Extractor'
import sortColors from "./sort/sortColors"
import { FinalColor } from './types/Color'
import type { NodeOptions, SorterOptions } from "./types/Options"

/**
 * Sort colors and generate standard list of colors.
 */
const sortFinalColors = (colors: Color[], pixels: number, options?: SorterOptions) => {
  const list = sortColors(colors, pixels, options)
  return list.map(color => createFinalColor(color, pixels))
}

/**
 * Extract colors from an ImageData object.
 */
const extractColorsFromImageData = ({ data, width = Number.MAX_SAFE_INTEGER, height = Number.MAX_SAFE_INTEGER }: { data: Uint8ClampedArray | number[], width?: number, height?: number }, options?: NodeOptions) => {
  const extractor = new Extractor(options)
  const colors = extractor.process({ data, width, height })
  return sortFinalColors(colors, extractor.pixels, options)
}

/**
 * Extract colors from an imageData.
 */
const extractColors = (imageData: ImageData | { data: Uint8ClampedArray | number[], width?: number, height?: number }, options?: NodeOptions) => {
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
