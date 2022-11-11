import Color from "../color/Color";

export class AverageGroup {
  colors: Color[] = []
  private _average: Color | null = null

  addColor(color: Color) {
    this.colors.push(color)
  }

  get average () {
    if (!this._average) {
      const { red, green, blue } = this.colors.reduce((total, color) => {
        total.red += color.red
        total.green += color.green
        total.blue += color.blue
        return total
      }, { red: 0, green: 0, blue: 0 })

      this._average = new Color(
        Math.round(red / this.colors.length),
        Math.round(green / this.colors.length),
        Math.round(blue / this.colors.length)
      )
      this._average.count = this.colors.reduce((count, color) => count + color.count, 0)
    }
    return this._average
  } 
}