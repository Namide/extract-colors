import { ExtractorOptions } from '../types/Options'
import RootGroup from '../color/RootGroup'

/**
 * Test if value is an integer.
 */
const testUint = <T = number>(label: string, val: T, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  if (!Number.isInteger(val) || val < min || val > max) {
    throw new Error(`${label} is invalid (${ val })`)
  }

  return val
}

/**
 * Test if value is a number.
 */
const testNumber = <T = number>(label: string, val: T, min = 0, max = Number.MAX_VALUE) => {
  if (Number(val) !== val || val < min || val > max) {
    throw new Error(`${label} is invalid (${ val })`)
  }

  return val
}

/**
 * Test if value is a function.
 */
const testFunction = <T = () => void>(label: string, val: T) => {
  if (!val || {}.toString.call(val) !== '[object Function]') {
    throw new Error(`${label} is invalid (${ val })`)
  }

  return val
}

/**
 * Process to extract main colors from list of colors.
 * 
 * @class
 * @classdesc Process to extract neighboring colors.
 */
export default class Extractor {

  pixels: number
  splitPower: number 
  distance: number 
  colorValidator: (red: number, green: number, blue: number, alpha: number) => boolean

  static pixelsDefault = 10000
  static distanceDefault = 0.12
  static splitPowerDefault = 10
  static colorValidatorDefault = (_red: number, _green: number, _blue: number, alpha?: number) => (alpha ?? 255) > 250

  constructor ({
    pixels = Extractor.pixelsDefault,
    distance = Extractor.distanceDefault,
    splitPower = Extractor.splitPowerDefault,
    colorValidator = Extractor.colorValidatorDefault
  }: ExtractorOptions = {}) {
    this.pixels = testUint('pixels', pixels, 1) ?? Extractor.pixelsDefault
    this.splitPower = testNumber('splitPower', splitPower, 2, 15) ?? Extractor.splitPowerDefault
    this.distance = testNumber('distance', distance, 0, 1) ?? Extractor.distanceDefault
    this.colorValidator = testFunction('colorValidator', colorValidator) ?? Extractor.colorValidatorDefault
  }

  /**
   * Run extract process and get list of colors.
   */
  process ({ data, width, height }: ImageData | { data: Uint8ClampedArray | number[], width?: number, height?: number }) {
    const rootGroup = new RootGroup()
    const acc = this.splitPower
    const reducer = (width && height) ? Math.floor(Math.sqrt(width * height) / this.pixels) || 1 : 1

    for (let i = 0; i < data.length; i += 4 * reducer) {
      const r = data[i] // 0 -> 255
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      if (this.colorValidator(r, g, b, a)) {
        const real = r << 16 | g << 8 | b
        const medium = (r >> 4 & 0xF) << 2 | (g >> 4 & 0xF) << 1 | (b >> 4 & 0xF)
        const small = Math.round(r * (acc - 1) / 255) * (acc * acc) + Math.round(g * (acc - 1) / 255) * acc + Math.round(b * (acc - 1) / 255)

        const smallGroup = rootGroup.addRootGroup(small)
        const mediumGroup = smallGroup.addBudGroup(medium)
        mediumGroup.addColor(real, r, g, b)
      }
    }

    return rootGroup.getColors(this.distance, this.pixels)
  }
}
