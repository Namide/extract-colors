import ColorsGroup from './ColorsGroup'

const testUint = (label, val, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  if (!Number.isInteger(val) || val < min || val > max) {
    throw new Error(`${label} is invalid`)
  }

  return parseInt(val)
}

const testNumber = (label, val, min = 0, max = Number.MAX_VALUE) => {
  if (Number(val) !== val || val < min || val > max) {
    throw new Error(`${label} is invalid`)
  }

  return Number(val)
}

const testFunction = (label, val) => {
  if (!val || {}.toString.call(val) !== '[object Function]') {
    throw new Error(`${label} is invalid`)
  }

  return val
}

export default class ColorsExtractor {
  constructor ({
    pixels = ColorsExtractor.pixelsDefault,
    distance = ColorsExtractor.distanceDefault,
    saturationImportance = ColorsExtractor.saturationImportanceDefault,
    splitPower = ColorsExtractor.splitPowerDefault,
    colorValidator = ColorsExtractor.colorValidatorDefault
  } = {}) {
    this.pixels = testUint('pixels', pixels, 1)
    this.splitPower = testNumber('splitPower', splitPower, 2, 16)
    this.distance = testNumber('distance', distance, 0, 1)
    this.saturationImportance = testNumber('saturationImportance', saturationImportance, 0, 1)
    this.colorValidator = testFunction('colorValidator', colorValidator)
  }

  process (data) {
    const store = new ColorsGroup()
    const acc = this.splitPower
    let group

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i] // 0 -> 255
      const g = data[i + 1]
      const b = data[i + 2]
      const a = data[i + 3]

      if (this.colorValidator(r, g, b, a)) {
        const real = r << 16 | g << 8 | b
        const medium = (r >> 4 & 0xF) << 2 | (g >> 4 & 0xF) << 1 | (b >> 4 & 0xF)
        const small = Math.round(r * (acc - 1) / 255) * (acc * acc) + Math.round(g * (acc - 1) / 255) * acc + Math.round(b * (acc - 1) / 255)

        group = store.addGroup(small)
        group = group.addGroup(medium)
        group.addColor(real, r, g, b)
      }
    }

    return store.getColors(this.distance, this.saturationImportance, this.pixels)
  }

  extract (data) {
    return this.process(data)
      .map((color) => ({
        hex: `#${'0'.repeat(6 - color.hex.toString(16).length)}${color.hex.toString(16)}`,
        red: color.red,
        green: color.green,
        blue: color.blue,
        area: color.count / this.pixels,
        saturation: color.saturation / 0xFF
      }))
  }
}

ColorsExtractor.pixelsDefault = 10000
ColorsExtractor.distanceDefault = 0.2
ColorsExtractor.saturationImportanceDefault = 0.2
ColorsExtractor.splitPowerDefault = 10
ColorsExtractor.colorValidatorDefault = (red, green, blue, alpha = 255) => alpha > 250
