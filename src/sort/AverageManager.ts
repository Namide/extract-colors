import Color from "../color/Color";
import { AverageGroup } from "./AverageGroup";

export class AverageManager {

  _hue:number
  _saturation:number
  _lightness:number

  private _groups: AverageGroup[] = []

  constructor (
    hue: number,
    saturation: number,
    lightness: number
  ) {
    this._hue = hue
    this._saturation = saturation
    this._lightness = lightness
  }

  addColor(color: Color) {
    const samePalette = this._groups.find(averageGroup => averageGroup.isSamePalette(color, this._hue, this._saturation, this._lightness))
    if (samePalette) {
      samePalette.addColor(color)
    } else {
      const averageGroup = new AverageGroup()
      averageGroup.addColor(color)
      this._groups.push(averageGroup)
    }
  }

  getGroups() {
    return this._groups.map(averageGroup => averageGroup.average)
  }
}