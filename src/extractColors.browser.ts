import Color from "./color/Color"
import { createFinalColor } from "./color/FinalColor"
import Extractor from "./extract/Extractor"
import { Sorter } from "./sort/Sorter"
import { FinalColor } from "./types/Color"
import type { BrowserOptions, NodeOptions, SorterOptions } from "./types/Options"

/**
 * Browser exported functions.
 *
 * @example
 * import extractColors from 'extract-colors'
 *
 * const src = 'my-image.jpg'
 *
 * extractColors(src)
 *   .then(console.log)
 *   .catch(console.error)
 *
 * @module Browser
 * @memberof browser
 */

/**
 * Extract ImageData from image.
 * Reduce image to a pixel count.
 *
 * @param {Image} image  Source image
 * @param {Number} pixels  Maximum number of pixels for process
 * @returns {ImageData}
 */
const getImageData = (image: HTMLImageElement, pixels: number) => {
  const currentPixels = image.width * image.height
  const width = currentPixels < pixels ? image.width : Math.round(image.width * Math.sqrt(pixels / currentPixels))
  const height = currentPixels < pixels ? image.height : Math.round(image.height * Math.sqrt(pixels / currentPixels))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)

  return context.getImageData(0, 0, width, height)
}

const sortColors = (colors: Color[], pixels: number, options?: SorterOptions) => {
  const sorter = new Sorter(options)
  const list = sorter.process(colors)
  return list.map(color => createFinalColor(color, pixels))
}

/**
 * Extract colors from an ImageData object.
 *
 * @param {ImageData} imageData
 * @param {Object=} options  Optional data
 * @param {String=} options.pixels  Total pixel number of the resized picture for calculation
 * @param {String=} options.distance  From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param {String=} options.splitPower  Approximation power in the first color splitting during process (from 2 to 16)
 * @param {String=} options.colorValidator  Callback with test to enable only some colors
 * @returns {Array<Object>}
 */
const extractColorsFromImageData = (imageData: ImageData, options?: NodeOptions) => {
  const extractor = new Extractor(options)
  const colors = extractor.extract(imageData.data)
  return sortColors(colors, extractor.pixels, options)
}

/**
 * Extract colors from an Image object.
 *
 * @param {Image} image
 * @param {Object=} options  Optional data
 * @param {String=} options.pixels  Total pixel number of the resized picture for calculation
 * @param {String=} options.distance  From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param {String=} options.splitPower  Approximation power in the first color splitting during process (from 2 to 16)
 * @param {String=} options.colorValidator  Callback with test to enable only some colors
 * @returns {Array<Object>}
 */
const extractColorsFromImage = (image: HTMLImageElement, options?: BrowserOptions) => {
  image.crossOrigin = options?.crossOrigin || null
  return new Promise((resolve: (value: FinalColor[]) => void) => {
    const extract = (image: HTMLImageElement, options?: BrowserOptions) => {
      const extractor = new Extractor(options)
      const imageData = getImageData(image, extractor.pixels)
      const colors = extractor.extract(imageData.data)
      resolve(sortColors(colors, extractor.pixels, options))
    }

    if (image.complete) {
      extract(image, options)
    } else {
      const imageLoaded = () => {
        image.removeEventListener('load', imageLoaded)
        extract(image, options)
      }
      image.addEventListener('load', imageLoaded)
    }
  })
}

/**
 * Extract colors from a path.
 * The image will be downloaded.
 *
 * @param {String} src
 * @param {Object=} options  Optional data
 * @param {String=} options.pixels  Total pixel number of the resized picture for calculation
 * @param {String=} options.distance  From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param {String=} options.splitPower  Approximation power in the first color splitting during process (from 2 to 16)
 * @param {String=} options.colorValidator  Callback with test to enable only some colors
 * @returns {Array<Object>}
 */
const extractColorsFromSrc = (src: string, options?: BrowserOptions) => {
  const image = new Image()
  image.src = src
  return extractColorsFromImage(image, options)
}

/**
 * Extract colors from a picture.
 *
 * @param {String|Image|ImageData} picture  Src, Image or ImageData
 * @param {Object=} options  Optional data
 * @param {String=} options.pixels  Total pixel number of the resized picture for calculation
 * @param {String=} options.distance  From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param {String=} options.splitPower  Approximation power in the first color splitting during process (from 2 to 16)
 * @param {String=} options.colorValidator  Callback with test to enable only some colors
 * @returns {Array<Object>}
 */
const extractColors = (picture: string | HTMLImageElement | ImageData, options?: BrowserOptions) => {
  if (picture instanceof ImageData) {
    return new Promise((resolve: (value: FinalColor[]) => void) => {
      resolve(extractColorsFromImageData(picture, options))
    })
  }

  if (picture instanceof Image) {
    return extractColorsFromImage(picture, options)
  }

  return extractColorsFromSrc(picture, options)
}

export {
  extractColorsFromImageData,
  extractColorsFromImage,
  extractColorsFromSrc,
  extractColors
}

export default extractColors
