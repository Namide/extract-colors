import RGBColor from "./RGBColor";

/**
 * Informations like saturation or count of pixels in image.
 *
 * @class
 * @classdesc Calculate some informations and store data about color.
 */
export default class HSLColor extends RGBColor {
  /**
   * Hue from 0 to 1
   */
  public h: number;

  /**
   * Saturation from 0 to 1
   */
  public s: number;

  /**
   * Lightness from 0 to 1
   */
  public l: number;

  /**
   * Color intensity from 0 to 1
   */
  public i: number;

  /**
   * Set red, green and blue colors to create the Color object.
   */
  constructor(red: number, green: number, blue: number, count: number) {
    super(red, green, blue, count);

    const r = red / 255;
    const g = green / 255;
    const b = blue / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    this.l = (max + min) / 2;

    // achromatic
    if (max === min) {
      this.h = 0;
      this.s = 0;
      this.i = 0;
    } else {
      const distance = max - min;

      this.s =
        this.l > 0.5 ? distance / (2 - max - min) : distance / (max + min);
      this.i = this.s * ((0.5 - Math.abs(0.5 - this.l)) * 2);
      switch (max) {
        case r:
          this.h = ((g - b) / distance + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          this.h = ((b - r) / distance + 2) / 6;
          break;
        default: // case b:
          this.h = ((r - g) / distance + 4) / 6;
          break;
      }
    }
  }
}
