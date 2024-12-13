/**
 * Informations like saturation or count of pixels in image.
 *
 * @class
 * @classdesc Calculate some informations and store data about color.
 */
export default class RGBColor {
  /**
   * Set red, green and blue colors to create the Color object.
   */
  constructor(
    public r: number,
    public g: number,
    public b: number,
    public count = 1
  ) {}

  clone() {
    return new RGBColor(this.r, this.g, this.b, this.count);
  }

  /**
   * Distance between two colors.
   * - Minimum is 0 (between two same colors)
   * - Maximum is 1 (for example between black and white)
   */
  static distance(colorA: RGBColor, colorB: RGBColor) {
    return (
      (Math.abs(colorB.r - colorA.r) +
        Math.abs(colorB.g - colorA.g) +
        Math.abs(colorB.b - colorA.b)) /
      (3 * 0xff)
    );
  }
}
