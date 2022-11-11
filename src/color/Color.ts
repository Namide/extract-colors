/**
 * Informations like saturation or count of pixels in image.
 *
 * @module Color
 * @memberof module:core
 */

/**
 * @class
 * @classdesc Calculate some informations and store data about color.
 */
export default class Color {

  red: number
  green: number
  blue: number
  hex: number
  count = 1

  /**
   * Set red, green and blue colors to create the Color object.
   *
   * @param {Number} red  Red channel integer from 0 to 255
   * @param {Number} green  Green channel integer from 0 to 255
   * @param {Number} blue  Blue channel integer from 0 to 255
   * @param {Number=} hex  Optional hexadecimal color from 0x000000 to 0xFFFFFF
   * @returns {Color}
   */
  constructor (red: number, green: number, blue: number, hex = red << 16 | green << 8 | blue) {

    this.red = red
    this.green = green
    this.blue = blue
    this.hex = hex
  }

  /**
   * Distance between two colors.
   * - Minimum is 0 (between two same colors)
   * - Maximum is 1 (for example between black and white)
   *
   * @param {Color} colorA  Color to compare
   * @param {Color} colorB  Color to compare
   * @returns {Number}
   */
  static distance (colorA: Color, colorB: Color) {
    return (Math.abs(colorB.red - colorA.red) + Math.abs(colorB.green - colorA.green) + Math.abs(colorB.blue - colorA.blue)) / (3 * 0xFF)
  }
}
