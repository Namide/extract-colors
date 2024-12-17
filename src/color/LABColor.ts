import RGBColor from "./RGBColor";

// https://github.com/antimatter15/rgb-lab/blob/master/color.js

/**
 * @classdesc Calculate some informations and store data about color.
 */
export default class HSLColor extends RGBColor {
  /**
   * Lightness from the CIELAB color space
   */
  public L: number;

  /**
   * A* from the CIELAB color space
   */
  public A: number;

  /**
   * B* from the CIELAB color space
   */
  public B: number;

  /**
   * Set red, green and blue colors to create the Color object.
   */
  constructor(red: number, green: number, blue: number, count: number) {
    super(red, green, blue, count);

    let r = red / 255;
    let g = green / 255;
    let b = blue / 255;

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
    let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

    this.L = 116 * y - 16;
    this.A = 500 * (x - y);
    this.B = 200 * (y - z);
  }

  public static deltaE(
    labA: { L: number; A: number; B: number },
    labB: { L: number; A: number; B: number }
  ) {
    const deltaL = labA.L - labB.L;
    const deltaA = labA.A - labB.A;
    const deltaB = labA.B - labB.B;
    const c1 = Math.sqrt(labA.A * labA.A + labA.B * labA.B);
    const c2 = Math.sqrt(labB.A * labB.A + labB.B * labB.B);
    const deltaC = c1 - c2;
    let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
    deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
    const sc = 1.0 + 0.045 * c1;
    const sh = 1.0 + 0.015 * c1;
    const deltaLKlsl = deltaL / 1.0;
    const deltaCkcsc = deltaC / sc;
    const deltaHkhsh = deltaH / sh;
    const i =
      deltaLKlsl * deltaLKlsl +
      deltaCkcsc * deltaCkcsc +
      deltaHkhsh * deltaHkhsh;
    return i < 0 ? 0 : Math.sqrt(i);
  }
}
