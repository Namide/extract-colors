export default class Color {
  constructor (red, green, blue, hex = red << 16 | green << 8 | blue) {
    this.isColor = true

    this.red = red
    this.green = green
    this.blue = blue
    this.hex = hex

    this.count = 1
  }

  distance (color) {
    return (Math.abs(color.red - this.red) + Math.abs(color.green - this.green) + Math.abs(color.blue - this.blue)) / (3 * 0xFF)
  }

  getWeight (saturationImportance, maxCount) {
    return this.count / maxCount + this.getSaturation() * saturationImportance
  }

  getSaturation () {
    if (this.saturation === undefined) {
      this.saturation = Math.max(
        Math.abs(this.red - this.green) / 0xFF,
        Math.abs(this.red - this.blue) / 0xFF,
        Math.abs(this.green - this.blue) / 0xFF
      )
    }

    return this.saturation
  }
}
