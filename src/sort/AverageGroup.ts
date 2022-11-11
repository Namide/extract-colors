import Color from "../color/Color";

const distance = (a: number, b: number) => Math.abs(a - b)
const hueDistance = (a: number, b: number) =>
  Math.min(distance(a, b), distance((a + 0.5) % 1, (b + 0.5) % 1))

export class AverageGroup {
  colors: Color[] = []
  private _average: Color | null = null

  addColor(color: Color) {
    this.colors.push(color)
    this._average = null
  }

  isSamePalette(color: Color) {
    for (let i = 0; i < this.colors.length; i++) {
      const currentColor = this.colors[i]
      const isSame = 
        hueDistance(currentColor.hue, color.hue) < 1/12 &&              // 1/12 = ok
        distance(currentColor.saturation, color.saturation) < 1/5 &&    // 1/5 = ok
        distance(currentColor.lightness, color.lightness) < 1/5         // 1/5 = ok

      if (!isSame) {
        return false
      }
    }
    return true
  }

  get average () {
    if (!this._average) {
      const { red, green, blue } = this.colors.reduce((total, color) => {
        total.red += color.red
        total.green += color.green
        total.blue += color.blue
        return total
      }, { red: 0, green: 0, blue: 0 })

      const total = this.colors.reduce((count, color) => count + color.count, 0)
      this._average = new Color(
        Math.round(red / this.colors.length),
        Math.round(green / this.colors.length),
        Math.round(blue / this.colors.length)
      )
      this._average.count = total
    }
    return this._average
  } 
}