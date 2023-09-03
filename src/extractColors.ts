import Color from "./color/Color"
import sortColors from "./sort/sortColors"
import { createFinalColor } from "./color/FinalColor"
import { BrowserOptions, NodeOptions } from "./types/Options"
import cleanInputs from "./extract/cleanInputs"
import extractor from "./extract/extractor"
import { FinalColor } from './types/Color'

type ImageDataAlt = { data: Uint8ClampedArray | number[], width?: number, height?: number }

/**
 * Browser or Node.js context detection
 */
const _isBrowser = () => typeof window !== 'undefined'

/**
 * Sort colors and generate standard list of colors.
 */
const _sortFinalColors = (_colors: Color[], _pixels: number, _hueDistance: number, _saturationDistance: number, _lightnessDistance: number) => {
  const list = sortColors(_colors, _pixels, _hueDistance, _saturationDistance, _lightnessDistance)
  return list.map(color => createFinalColor(color, _pixels))
}

/**
 * Extract ImageData from image.
 * Reduce image to a pixel count.
 * Browser only
 */
const _getImageData = (_image: HTMLImageElement, _pixels: number) => {
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
 * Extract colors from an ImageData object.
 */
export const extractColorsFromImageData = (imageData: ImageData | ImageDataAlt, options: NodeOptions | BrowserOptions = {}) => {
  const [_pixels, _distance, _colorValidator, _hueDistance, _saturationDistance, _lightnessDistance] = cleanInputs(options)
  const { colors, count } = extractor(imageData, _pixels, _distance, _colorValidator)
  return _sortFinalColors(colors, count, _hueDistance, _saturationDistance, _lightnessDistance)
}

/**
 * Extract colors from an HTMLImageElement.
 * Browser only
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 
export const extractColorsFromImage = (image: HTMLImageElement, options: BrowserOptions = {}): Promise<FinalColor[]> => {

  // Browser version
  if (_isBrowser()) {
    const [_pixels, _distance, _colorValidator, _hueDistance, _saturationDistance, _lightnessDistance, _crossOrigin] = cleanInputs(options)
    image.crossOrigin = _crossOrigin
    return new Promise((resolve: (value: FinalColor[]) => void) => {
      const extract = (image: HTMLImageElement) => {
        const imageData = _getImageData(image, _pixels)
        const { colors, count } = extractor(imageData, _pixels, _distance, _colorValidator)
        resolve(_sortFinalColors(colors, count, _hueDistance, _saturationDistance, _lightnessDistance))
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

  // Node.js version
  } else {
    if (__DEV__) {
      throw new Error('Can not use extractColorsFromImage for Node.js')
    }
  }
}

/**
 * Extract colors from a path.
 * The image will be downloaded.
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore 
export const extractColorsFromSrc = (src: string, options: BrowserOptions = {}): Promise<FinalColor[]> => {
  
  // Browser version
  if (_isBrowser()) {
    const image = new Image()
    image.src = src
    return extractColorsFromImage(image, options)


  // Node.js version
  } else {
    if (__DEV__) {
      throw new Error('Can not use extractColorsFromSrc for Node.js')
    }
  }
}

/**
 * Extract colors from a picture.
 * Node and Browser support
 */
export const extractColors = (picture: string | HTMLImageElement | ImageData | ImageDataAlt, options?: BrowserOptions) => {

  // Browser version
  if (_isBrowser()) {
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
  
  // Node.js version
  } else {
    if (__DEV__) {

      if (picture instanceof String ) {
        throw new Error('Send imageData to extractColors (Image src or HTMLImageElement not supported in Nodejs)')
      }

      if (!(picture as ImageData).data) {
        throw new Error('Send imageData to extractColors')
      }

      if (options?.crossOrigin) {
        console.warn('options.crossOrigin not supported in Node.js')
      }
    }
    
    return new Promise((resolve: (value: FinalColor[]) => void) => {
      resolve(extractColorsFromImageData(picture as ImageData | ImageDataAlt, options))
    })
  }

  throw new Error(`Can not analyse picture`)
}
