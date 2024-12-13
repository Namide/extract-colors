import HSLColor from "../color/HSLColor";
import { AverageHSLGroup } from "./AverageHSLGroup";

export class AverageHSLManager {
  _hue: number;
  _saturation: number;
  _lightness: number;

  private _groups: AverageHSLGroup[] = [];

  constructor(hue: number, saturation: number, lightness: number) {
    this._hue = hue;
    this._saturation = saturation;
    this._lightness = lightness;
  }

  addColor(color: HSLColor) {
    const samePalette = this._groups.find((AverageHSLGroup) =>
      AverageHSLGroup.isSamePalette(
        color,
        this._hue,
        this._saturation,
        this._lightness
      )
    );
    if (samePalette) {
      samePalette.addColor(color);
    } else {
      const averageHSLGroup = new AverageHSLGroup();
      averageHSLGroup.addColor(color);
      this._groups.push(averageHSLGroup);
    }
  }

  getGroups() {
    return this._groups.map((AverageHSLGroup) => AverageHSLGroup.average);
  }
}
