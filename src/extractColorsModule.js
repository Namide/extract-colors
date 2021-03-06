import ColorsExtractor from './color/ColorsExtractor'

/**
 * Node exported functions.
 * 
 * @example
 * const path = require('path')
 * const { extractColors } = require('extract-colors')
 * 
 * const src = path.join(__dirname, './my-image.jpg')
 * 
 * extractColors(src)
 *   .then(console.log)
 *   .catch(console.log)
 * 
 * @example
 * import { extractColorsFromImageData } from 'extract-colors'
 * 
 * const imageData = { data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF] }
 * 
 * extractColorsFromImageData(imageData)
 *   .then(console.log)
 *   .catch(console.error)
 * 
 * @module Node
 * @memberof node
 */

const { createCanvas, loadImage } = require('canvas')

/**
 * Extract ImageData from image.
 * Reduce image to a pixel count.
 * 
 * @param {Image} image  Source image
 * @param {Number} pixels  Maximum number of pixels for process
 * @returns {ImageData}
 */
const getImageData = (image, pixels) => {
  const currentPixels = image.width * image.height
  const width = currentPixels < pixels ? image.width : Math.round(image.width * Math.sqrt(pixels / currentPixels))
  const height = currentPixels < pixels ? image.height : Math.round(image.height * Math.sqrt(pixels / currentPixels))

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)
  return context.getImageData(0, 0, width, height)
}

/**
 * Extract colors from an ImageData object.
 * 
 * @param {ImageData} imageData  
 * @param {Object=} options  Optional data
 * @param {String=} options.pixels  Total pixel number of the resized picture for calculation
 * @param {String=} options.distance  From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param {String=} options.saturationImportance  Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size)
 * @param {String=} options.splitPower  Approximation power in the first color splitting during process (from 2 to 16)
 * @param {String=} options.colorValidator  Callback with test to enable only some colors
 * @returns {Array<Object>}
 */
const extractColorsFromImageData = (imageData, options) => {
  const colorsExtractor = new ColorsExtractor(options)
  return colorsExtractor.extract(imageData.data)
}

/**
 * Extract colors from a path.
 * The image will be downloaded.
 * 
 * @param {String} src 
 * @param {Object=} options  Optional data
 * @param {String=} options.pixels  Total pixel number of the resized picture for calculation
 * @param {String=} options.distance  From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param {String=} options.saturationImportance  Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size)
 * @param {String=} options.splitPower  Approximation power in the first color splitting during process (from 2 to 16)
 * @param {String=} options.colorValidator  Callback with test to enable only some colors
 * @returns {Array<Object>}
 */
const extractColorsFromSrc = (src, options) => loadImage(src)
  .then((image) => {
    const colorsExtractor = new ColorsExtractor(options)
    const imageData = getImageData(image, colorsExtractor.pixels)
    return colorsExtractor.extract(imageData.data)
  })

/**
 * Extract colors from a picture.
 * 
 * @param {String|Image|ImageData} picture  Src, Image or ImageData
 * @param {Object=} options  Optional data
 * @param {String=} options.pixels  Total pixel number of the resized picture for calculation
 * @param {String=} options.distance  From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param {String=} options.saturationImportance  Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size)
 * @param {String=} options.splitPower  Approximation power in the first color splitting during process (from 2 to 16)
 * @param {String=} options.colorValidator  Callback with test to enable only some colors
 * @returns {Array<Object>}
 */
const extractColors = (picture, options) => {
  if (picture.width && picture.height && picture.data && picture.data.length) {
    return new Promise((resolve) => {
      resolve(extractColorsFromImageData(picture, options))
    })
  }

  return extractColorsFromSrc(picture, options)
}

module.exports = {
  extractColorsFromImageData,
  extractColorsFromSrc,
  extractColors
}
