/**
 * Informations like saturation or count of pixels in image.
 * 
 * @class
 * @classdesc Calculate some informations and store data about color.
 */
export default class Color {
  
  _red: number
  _green: number
  _blue: number
  _hex: number
  _count = 1

  private __saturation = -1
  private __hue = -1
  private __lightness = -1
  private __intensity = -1

  /**
   * Set red, green and blue colors to create the Color object.
   */
  constructor (red: number, green: number, blue: number, hex = red << 16 | green << 8 | blue) {
    this._red = red
    this._green = green
    this._blue = blue
    this._hex = hex
  }

  /**
   * Distance between two colors.
   * - Minimum is 0 (between two same colors)
   * - Maximum is 1 (for example between black and white)
   */
  static distance (colorA: Color, colorB: Color) {
    return (Math.abs(colorB._red - colorA._red) + Math.abs(colorB._green - colorA._green) + Math.abs(colorB._blue - colorA._blue)) / (3 * 0xFF)
  }

  clone() {
    const color = new Color(this._red, this._green, this._blue, this._hex)
    color._count = this._count
    return color
  }

  updateHSL () {
    const red = this._red / 255
    const green = this._green / 255
    const blue = this._blue / 255

    const max = Math.max(red, green, blue)
    const min = Math.min(red, green, blue)

    this.__lightness = (max + min) / 2

    // achromatic
    if (max === min) {
      this.__hue = 0
      this.__saturation = 0
      this.__intensity = 0
    } else {
      const distance = max - min;
      
      this.__saturation = this.__lightness > 0.5 ? distance / (2 - max - min) : distance / (max + min)
      this.__intensity = this.__saturation * ((0.5 - Math.abs(0.5 - this.__lightness)) * 2)
      switch (max) {
        case red:
          this.__hue = ((green - blue) / distance + (green < blue ? 6 : 0)) / 6
          break;
        case green:
          this.__hue = ((blue - red) / distance + 2) / 6
          break;
        case blue:
          this.__hue = ((red - green) / distance + 4) / 6
          break;
      }
    }
  }

  /**
   * Hue from 0 to 1
   */
  get _hue () {
    if (this.__hue === -1) {
      this.updateHSL()
    }
    return this.__hue
  }

  /**
   * Saturation from 0 to 1
   */
  get _saturation () {
    if (this.__saturation === -1) {
      this.updateHSL()
    }
    return this.__saturation
  }

  /**
   * Lightness from 0 to 1
   */
  get _lightness () {
    if (this.__lightness === -1) {
      this.updateHSL()
    }
    return this.__lightness
  }
  
  /**
   * Color intensity from 0 to 1
   */
  get _intensity () {
    if (this.__intensity === -1) {
      this.updateHSL()
    }
    return this.__intensity
  }
}
