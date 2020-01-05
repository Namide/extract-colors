module.exports = class Color {
  constructor (red, green, blue, hex) {
    this.isColor = true

    this.red = red
    this.green = green
    this.blue = blue
    this.hex = hex

    this.count = 1
  }

  distance (color) {
    return Math.abs(color.red - this.red) + Math.abs(color.green - this.green) + Math.abs(color.blue - this.blue)
  }

  getWeight (saturationImportance) {
    return this.count + this.getSaturation() * saturationImportance
  }

  getSaturation () {
    if (this.saturation === undefined) {
      this.saturation = Math.max(
        Math.abs(this.red - this.green),
        Math.abs(this.red - this.blue),
        Math.abs(this.green - this.blue)
      )
    }

    return this.saturation
  }
}