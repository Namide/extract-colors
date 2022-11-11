import Color from "../color/Color";
import { AverageGroup } from "./AverageGroup";

const nearest = (a: number, b: number, distance = 0.1) => Math.abs(a - b) <= distance
const hueNearest = (a: number, b: number, distance = 0.1) =>
  nearest(a, b, distance) || nearest((a + 0.5) % 1, (b + 0.5) % 1, distance)

export class AverageManager {
  private _groups: { [code : number]: AverageGroup } = { }

  addColor(color: Color) {
    const key =
      Math.max(Math.floor(color.lightness * 3), 2) +
      Math.max(Math.floor(color.saturation * 3), 2) * 10 +
      Math.max(Math.floor(color.saturation * 13), 12) * 100

    const group = this._groups[key] || (this._groups[key] = new AverageGroup())
    group.addColor(color)
  }

  getGroups() {
    const list = (Object.keys(this._groups) as unknown[] as number[])
      .map((key) => this._groups[key])

    const groups: AverageGroup[][] = []

    while (list.length) {
      const avg = list.pop() as AverageGroup
      const samePalette = groups.find(g => {
        hueNearest(g[0].average.hue, avg.average.hue) ||
        nearest(g[0].average.saturation, avg.average.saturation) ||
        nearest(g[0].average.lightness, avg.average.lightness)
      })
      if (samePalette) {
        samePalette.push(avg)
      } else {
        groups.push([avg])
      }
    }

    return groups.map(g => g.reduce((list, avg) => list.concat(avg.colors), [] as Color[])).flat()
  }
}