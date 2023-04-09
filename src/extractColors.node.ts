import { extractColorsFromImageData } from './extractColors'
import { FinalColor } from './types/Color'
import type { NodeOptions } from "./types/Options"

/**
 * Extract colors from an imageData.
 */
const extractColors = (imageData: ImageData | { data: Uint8ClampedArray | number[], width?: number, height?: number }, options?: NodeOptions) => {
  if (__DEV__) {
    if (!imageData.data) {
      throw new Error('Send imageData to extractColors')
    }
  }
  
  return new Promise((resolve: (value: FinalColor[]) => void) => {
    resolve(extractColorsFromImageData(imageData, options))
  })
}

let extractColorsFromImage
let extractColorsFromSrc

if (__DEV__) {
  extractColorsFromImage = () => {
    throw new Error('Can not use extractColorsFromImage for Node.js')
  }
  
  extractColorsFromSrc = () => {
    throw new Error('Can not use extractColorsFromSrc for Node.js')
  }
}

export {
  extractColorsFromImageData,
  extractColorsFromImage,
  extractColorsFromSrc,
  extractColors
}

export default extractColors
