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

  isSamePalette(color: Color, hue: number, saturation: number, lightness: number) {
    for (let i = 0; i < this.colors.length; i++) {
      const currentColor = this.colors[i]
      const isSame = 
        hueDistance(currentColor._hue, color._hue) < hue &&
        distance(currentColor._saturation, color._saturation) < saturation &&
        distance(currentColor._lightness, color._lightness) < lightness

      if (!isSame) {
        return false
      }
    }
    return true
  }

  get average () {
    if (!this._average) {
      const { r, g, b } = this.colors.reduce((total, color) => {
        total.r += color._red
        total.g += color._green
        total.b += color._blue
        return total
      }, { r: 0, g: 0, b: 0 })

      const total = this.colors.reduce((_count, color) => _count + color._count, 0)
      this._average = new Color(
        Math.round(r / this.colors.length),
        Math.round(g / this.colors.length),
        Math.round(b / this.colors.length)
      )
      this._average._count = total
    }
    return this._average
  } 
}