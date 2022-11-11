import Color from "../color/Color";
import { AverageGroup } from "./AverageGroup";

export class AverageManager {

  hue:number
  saturation:number
  lightness:number

  private _groups: AverageGroup[] = []

  static hueDefault = 1/12
  static saturationDefault = 1/5
  static lightnessDefault = 1/5

  constructor ({
    hue = AverageManager.hueDefault,
    saturation= AverageManager.saturationDefault,
    lightness = AverageManager.lightnessDefault
  } = {}) {
    this.hue = hue
    this.saturation = saturation
    this.lightness = lightness
  }

  addColor(color: Color) {
    const samePalette = this._groups.find(averageGroup => averageGroup.isSamePalette(color, this.hue, this.saturation, this.lightness))
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