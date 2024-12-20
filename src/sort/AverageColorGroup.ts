import { deltaE } from "../color/DetailledColor";
import RGBColor from "../color/RGBColor";
import { DetailledColor } from "../types/Color";

export class AverageColorGroup {
  colors: DetailledColor[] = [];
  private _average: RGBColor | null = null;

  addColor(color: DetailledColor) {
    this.colors.push(color);
    this._average = null;
  }

  isSamePalette(color: DetailledColor, distance: number) {
    for (const currentColor of this.colors) {
      const isSame = deltaE(currentColor, color) / 100 < distance;
      if (!isSame) {
        return false;
      }
    }
    return true;
  }

  get average() {
    if (!this._average) {
      const { r, g, b, count } = this.colors.reduce(
        (total, color) => {
          total.r += color.rgb[0] * color.count;
          total.g += color.rgb[1] * color.count;
          total.b += color.rgb[2] * color.count;
          total.count += color.count;
          return total;
        },
        { r: 0, g: 0, b: 0, count: 0 }
      );

      this._average = new RGBColor(
        Math.round(r / count),
        Math.round(g / count),
        Math.round(b / count),
        count
      );
    }

    return this._average;
  }
}
