import HSLColor from "../color/HSLColor";

const distance = (a: number, b: number) => Math.abs(a - b);
const hueDistance = (a: number, b: number) =>
  Math.min(distance(a, b), distance((a + 0.5) % 1, (b + 0.5) % 1));

export class AverageHSLGroup {
  colors: HSLColor[] = [];
  private _average: HSLColor | null = null;

  addColor(color: HSLColor) {
    this.colors.push(color);
    this._average = null;
  }

  isSamePalette(
    color: HSLColor,
    hue: number,
    saturation: number,
    lightness: number
  ) {
    for (const currentColor of this.colors) {
      const isSame =
        hueDistance(currentColor.h, color.h) < hue &&
        distance(currentColor.s, color.s) < saturation &&
        distance(currentColor.l, color.l) < lightness;

      if (!isSame) {
        return false;
      }
    }
    return true;
  }

  get average() {
    if (!this._average) {
      const { r, g, b } = this.colors.reduce(
        (total, color) => {
          total.r += color.r;
          total.g += color.g;
          total.b += color.b;
          return total;
        },
        { r: 0, g: 0, b: 0 }
      );

      const total = this.colors.reduce(
        (count, color) => count + color.count,
        0
      );
      this._average = new HSLColor(
        Math.round(r / this.colors.length),
        Math.round(g / this.colors.length),
        Math.round(b / this.colors.length),
        total
      );
    }
    return this._average;
  }
}
