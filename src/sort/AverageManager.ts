import Color from "../color/Color";
import { AverageGroup } from "./AverageGroup";

// const nearest = (a: number, b: number, distance = 0.1) => Math.abs(a - b) <= distance
// const hueNearest = (a: number, b: number, distance = 0.1) =>
//   nearest(a, b, distance) || nearest((a + 0.5) % 1, (b + 0.5) % 1, distance)

export class AverageManager {
  // private _groups: { [code : number]: AverageGroup } = { }
  private _groups: AverageGroup[] = []
  // private _colors: Color[][] = []

  addColor(color: Color) {
    // const key =
    //   Math.min(Math.floor(color.lightness * 3), 2) +
    //   Math.min(Math.floor(color.saturation * 3), 2) * 10 +
    //   Math.min(Math.floor(color.hue * 13), 12) * 100
    // const group = this._groups[key] || (this._groups[key] = new AverageGroup())
    // group.addColor(color)

    const samePalette = this._groups.find(averageGroup => averageGroup.isSamePalette(color))
    if (samePalette) {
      samePalette.addColor(color)
    } else {
      const averageGroup = new AverageGroup()
      averageGroup.addColor(color)
      this._groups.push(averageGroup)
    }
  }

  getGroups() {
    // const list = (Object.keys(this._groups) as unknown[] as number[])
    //   .map((key) => this._groups[key])

    // const groups: AverageGroup[][] = []
    // while (list.length) {
    //   const avg = list.pop() as AverageGroup
    //   const samePalette = groups.find(g => {
    //     hueNearest(g[0].average.hue, avg.average.hue) &&
    //     nearest(g[0].average.saturation, avg.average.saturation) &&
    //     nearest(g[0].average.lightness, avg.average.lightness)
    //   })
    //   if (samePalette) {
    //     samePalette.push(avg)
    //   } else {
    //     groups.push([avg])
    //   }

    //   const colors = avg.colors.map(color => `#${'0'.repeat(6 - color.hex.toString(16).length)}${color.hex.toString(16)}`)
    //   console.log(`%c ${colors.join(' %c ')}`, ...colors.map(color => `background: ${ color }; color: white`));
    // }

    this._groups.forEach(averageGroup => {
      const colors = [averageGroup.average, ...averageGroup.colors].map(color => `#${'0'.repeat(6 - color.hex.toString(16).length)}${color.hex.toString(16)}`)
      console.log(`%c ${colors.join(' %c ')}`, ...colors.map(color => `background: ${ color }; color: white`));
    })

    return this._groups.map(averageGroup => averageGroup.average)
  }
}