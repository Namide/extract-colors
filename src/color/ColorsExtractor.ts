import { Options } from '../types/Options'
import type { Output } from '../types/Output'
import GroupGroup from './GroupGroup'

/**
 * Process to extract main colors from list of colors.
 *
 * @module ColorsExtractor
 * @memberof module:core
 */

/**
 * Test if value is an integer.
 *
 * @param {String} label
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 */
const testUint = <T = number>(label: string, val: T, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  if (!Number.isInteger(val) || val < min || val > max) {
    throw new Error(`${label} is invalid`)
  }

  return val
}

/**
 * Test if value is a number.
 *
 * @param {String} label
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 */
const testNumber = <T = number>(label: string, val: T, min = 0, max = Number.MAX_VALUE) => {
  if (Number(val) !== val || val < min || val > max) {
    throw new Error(`${label} is invalid`)
  }

  return val
}

/**
 * Test if value is a function.
 *
 * @param {String} label
 * @param {Function} val
 */
const testFunction = <T = () => void>(label: string, val: T) => {
  if (!val || {}.toString.call(val) !== '[object Function]') {
    throw new Error(`${label} is invalid`)
  }

  return val
}

/**
 * @class
 * @classdesc Process to extract neighboring colors.
 */
export default class ColorsExtractor {

  pixels: number
  splitPower: number 
  distance: number 
  saturationImportance: number 
  colorValidator: (red: number, green: number, blue: number, alpha: number) => boolean

  static pixelsDefault = 10000
  static distanceDefault = 0.2
  static saturationImportanceDefault = 0.2
  static splitPowerDefault = 10
  static colorValidatorDefault = (_red: number, _green: number, _blue: number, alpha?: number) => (alpha ?? 255) > 250

  /**
   * @param {Object=} options  Optional data
   * @param {String=} options.pixels  Total pixel number of the resized picture for calculation
   * @param {String=} options.distance  From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
   * @param {String=} options.saturationImportance  Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size)
   * @param {String=} options.splitPower  Approximation power in the first color splitting during process (from 2 to 16)
   * @param {String=} options.colorValidator  Callback with test to enable only some colors
   */
  constructor ({
    pixels = ColorsExtractor.pixelsDefault,
    distance = ColorsExtractor.distanceDefault,
    saturationImportance = ColorsExtractor.saturationImportanceDefault,
    splitPower = ColorsExtractor.splitPowerDefault,
    colorValidator = ColorsExtractor.colorValidatorDefault
  }: Options = {}) {
    this.pixels = testUint('pixels', pixels, 1)
    this.splitPower = testNumber('splitPower', splitPower, 2, 16)
    this.distance = testNumber('distance', distance, 0, 1)
    this.saturationImportance = testNumber('saturationImportance', saturationImportance, 0, 1)
    this.colorValidator = testFunction('colorValidator', colorValidator)
  }

  /**
   * Run extract process and get list of colors.
   *
   * @param {Array<Number>} data  List of colors with an array of flat colors by chanels with 0 to 255 per chanel (red, green, blue, alpha)
   * @returns {Array<Color>}
   */
  process (data: Uint8ClampedArray) {
    const rootGroup = new GroupGroup()
    const acc = this.splitPower

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] // 0 -> 255
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      if (this.colorValidator(r, g, b, a)) {
        const real = r << 16 | g << 8 | b
        const medium = (r >> 4 & 0xF) << 2 | (g >> 4 & 0xF) << 1 | (b >> 4 & 0xF)
        const small = Math.round(r * (acc - 1) / 255) * (acc * acc) + Math.round(g * (acc - 1) / 255) * acc + Math.round(b * (acc - 1) / 255)

        const smallGroup = rootGroup.addGroup(small)
        const mediumGroup = smallGroup.addColorGroup(medium)
        mediumGroup.addColor(real, r, g, b)
      }
    }

    return rootGroup.getColors(this.distance, this.saturationImportance, this.pixels)
  }

  /**
   * Extract colors from data.
   *
   * @param {Array<Number>} data  List of colors with an array of flat colors by chanels with 0 to 255 per chanel (red, green, blue, alpha)
   * @returns {Array<Object>} { hex, red, green, blue, area, saturation }
   */
  extract (data: Uint8ClampedArray): Output[] {
    return this.process(data)
      .map((color) => ({
        hex: `#${'0'.repeat(6 - color.hex.toString(16).length)}${color.hex.toString(16)}`,
        red: color.red,
        green: color.green,
        blue: color.blue,
        area: color.count / this.pixels,
        saturation: color.getSaturation()
      }))
  }
}
