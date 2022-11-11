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

  private _saturation = -1
  private _hue = -1
  private _lightness = -1
  private _intensity = -1

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

  updateHSL () {
    const red = this.red / 255
    const green = this.green / 255
    const blue = this.blue / 255

    const max = Math.max(red, green, blue)
    const min = Math.min(red, green, blue)

    this._lightness = (max + min) / 2

    // achromatic
    if (max === min) {
      this._hue = 0
      this._saturation = 0
      this._intensity = 0
    } else {
      const distance = max - min;
      
      this._saturation = this._lightness > 0.5 ? distance / (2 - max - min) : distance / (max + min)
      this._intensity = this._saturation * ((0.5 - Math.abs(0.5 - this._lightness)) * 2)
      switch (max) {
        case red:
          this._hue = ((green - blue) / distance + (green < blue ? 6 : 0)) / 6
          break;
        case green:
          this._hue = ((blue - red) / distance + 2) / 6
          break;
        case blue:
          this._hue = ((red - green) / distance + 4) / 6
          break;
      }
    }

  }

  /**
   * Hue from 0 to 1
   */
  get hue () {
    if (this._hue === -1) {
      this.updateHSL()
    }
    return this._hue
  }

  /**
   * Saturation from 0 to 1
   */
  get saturation () {
    if (this._saturation === -1) {
      this.updateHSL()
    }
    return this._saturation
  }

  /**
   * Lightness from 0 to 1
   */
  get lightness () {
    if (this._lightness === -1) {
      this.updateHSL()
    }
    return this._lightness
  }
  
  /**
   * Color intensity from 0 to 1
   */
  get intensity () {
    if (this._intensity === -1) {
      this.updateHSL()
    }
    return this._intensity
  }
}
