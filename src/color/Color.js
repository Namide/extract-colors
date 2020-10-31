/**
 * @class
 * @classdesc Calculate some informations and store data about color.
 */
export default class Color {

  /**
   * Set red, green and blue colors to create the Color object.
   * 
   * @param {Number} red  Red channel integer from 0 to 255
   * @param {Number} green  Green channel integer from 0 to 255
   * @param {Number} blue  Blue channel integer from 0 to 255
   * @param {Number=} hex  Optional hexadecimal color from 0x000000 to 0xFFFFFF
   * @returns {Color}
   */
  constructor (red, green, blue, hex = red << 16 | green << 8 | blue) {
    this.isColor = true

    this.red = red
    this.green = green
    this.blue = blue
    this.hex = hex

    this.count = 1
  }

  /**
   * Distance between two colors.
   * - Minimum is 0 (between two same colors)
   * - Maximum is 1 (for example between black and white)
   * 
   * @param {Color} color  Color to compare
   * @returns {Number}
   */
  distance (color) {
    return (Math.abs(color.red - this.red) + Math.abs(color.green - this.green) + Math.abs(color.blue - this.blue)) / (3 * 0xFF)
  }

  /**
   * Weight of the color depends of his saturation and his count.
   * 
   * @param {Number} saturationImportance  Determine the weight of the saturation for the calcul (from 0 to 1)
   * @param {Number} maxCount  Number of pixels in the image.
   * @returns {Number}
   */
  getWeight (saturationImportance, maxCount) {
    return (this.count / maxCount) * (1 - saturationImportance) + this.getSaturation() * saturationImportance
  }

  /**
   * Saturation of the color from 0 to 1.
   * 
   * @returns {Number}
   */
  getSaturation () {
    if (this.saturation === undefined) {
      this.saturation = Math.max(
        Math.abs(this.red - this.green) / 0xFF,
        Math.abs(this.red - this.blue) / 0xFF,
        Math.abs(this.green - this.blue) / 0xFF
      )
    }

    return this.saturation
  }
}
