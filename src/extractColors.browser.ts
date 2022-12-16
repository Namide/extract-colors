import { extractColorsFromImageData } from "./extractColors"
import { sortFinalColors } from "./extractColors"
import cleanInputs from "./extract/cleanInputs"
import extractor from "./extract/extractor"
import { FinalColor } from "./types/Color"
import type { BrowserOptions } from "./types/Options"

/**
 * Extract ImageData from image.
 * Reduce image to a pixel count.
 */
const getImageData = (_image: HTMLImageElement, _pixels: number) => {
  const currentPixels = _image.width * _image.height
  const width = currentPixels < _pixels ? _image.width : Math.round(_image.width * Math.sqrt(_pixels / currentPixels))
  const height = currentPixels < _pixels ? _image.height : Math.round(_image.height * Math.sqrt(_pixels / currentPixels))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d') as CanvasRenderingContext2D
  context.drawImage(_image, 0, 0, _image.width, _image.height, 0, 0, width, height)

  return context.getImageData(0, 0, width, height)
}

/**
 * Extract colors from an HTMLImageElement.
 */
const extractColorsFromImage = (image: HTMLImageElement, options: BrowserOptions = {}) => {
  const [_pixels, _distance, _splitPower, _colorValidator, _hueDistance, _saturationDistance, _lightnessDistance, _crossOrigin] = cleanInputs(options)
  image.crossOrigin = _crossOrigin
  return new Promise((resolve: (value: FinalColor[]) => void) => {
    const extract = (image: HTMLImageElement) => {
      const imageData = getImageData(image, _pixels)
      const _colors = extractor(imageData, _pixels, _distance, _splitPower, _colorValidator)
      resolve(sortFinalColors(_colors, _pixels, _hueDistance, _saturationDistance, _lightnessDistance))
    }

    if (image.complete) {
      extract(image)
    } else {
      const imageLoaded = () => {
        image.removeEventListener('load', imageLoaded)
        extract(image)
      }
      image.addEventListener('load', imageLoaded)
    }
  })
}

/**
 * Extract colors from a path.
 * The image will be downloaded.
 */
const extractColorsFromSrc = (src: string, options: BrowserOptions = {}) => {
  const image = new Image()
  image.src = src
  return extractColorsFromImage(image, options)
}

/**
 * Extract colors from a picture.
 */
const extractColors = (picture: string | HTMLImageElement | ImageData | { data: Uint8ClampedArray | number[], width?: number, height?: number }, options?: BrowserOptions) => {

  if (picture instanceof Image) {
    return extractColorsFromImage(picture, options)
  }

  if (picture instanceof ImageData || (picture instanceof Object && picture.data)) {
    return new Promise((resolve: (value: FinalColor[]) => void) => {
      resolve(extractColorsFromImageData(picture, options))
    })
  }

  if (typeof picture === "string") {
    return extractColorsFromSrc(picture, options)
  }

  throw new Error(`Can not analyse picture`)
}

export {
  extractColorsFromImageData,
  extractColorsFromImage,
  extractColorsFromSrc,
  extractColors
}

export default extractColors
