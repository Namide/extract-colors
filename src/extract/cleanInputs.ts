import { BrowserOptions } from "../types/Options"

/**
 * Default extractor values
 */
export const enum EXTRACTOR_DEFAULT {
  PIXELS = 64000,
  DISTANCE = 0.22
}

/**
 * Default average values
 */
export const enum AVERAGE_DEFAULT {
  HUE = 1/12,
  SATURATION = 1/5,
  LIGHTNESS = 1/5,
}

export default ({
  pixels = EXTRACTOR_DEFAULT.PIXELS,
  distance = EXTRACTOR_DEFAULT.DISTANCE,
  colorValidator = (_red: number, _green: number, _blue: number, _alpha?: number) => (_alpha ?? 255) > 250,
  hueDistance = AVERAGE_DEFAULT.HUE,
  saturationDistance = AVERAGE_DEFAULT.LIGHTNESS,
  lightnessDistance = AVERAGE_DEFAULT.SATURATION,
  crossOrigin = null
}:BrowserOptions = {}): [
  number,
  number,
  (red: number, green: number, blue: number, alpha: number) => boolean,
  number,
  number,
  number,
  "" | "anonymous" | "use-credentials" | null,
] => {
  if (__DEV__) {

    /**
     * Test if value is an integer.
     */
    const testUint = (label: string, val: number, min = 0, max = Number.MAX_SAFE_INTEGER) => {
      if (!Number.isInteger(val)) {
        throw new Error(`${label} is not a valid number (${ val })`)
      }

      if (val < min) {
        console.warn(`${label} can not be less than ${min} (it's ${val})`)
      }

      if (val > max) {
        console.warn(`${label} can not be more than ${max} (it's ${val})`)
      }

      return Math.min(Math.max(val, min), max)
    }

    /**
     * Test if value is a number.
     */
    const testNumber = (label: string, val: number, min = 0, max = Number.MAX_VALUE) => {
      if (Number(val) !== val) {
        throw new Error(`${label} is not a valid number (${ val })`)
      }

      if (val < min) {
        console.warn(`${label} can not be less than ${min} (it's ${val})`)
      }

      if (val > max) {
        console.warn(`${label} can not be more than ${max} (it's ${val})`)
      }

      return Math.min(Math.max(val, min), max)
    }

    /**
     * Test if value is a function.
     */
    const testFunction = <T = () => void>(label: string, val: T) => {
      if (!val || {}.toString.call(val) !== '[object Function]') {
        throw new Error(`${label} is not a function (${ val })`)
      }

      return val
    }

    testUint('pixels', pixels || 0, 1)
    testNumber('distance', distance, 0, 1)
    testFunction('colorValidator', colorValidator)
    testNumber('hueDistance', hueDistance, 0, 1)
    testNumber('saturationDistance', saturationDistance, 0, 1)
    testNumber('lightnessDistance', lightnessDistance, 0, 1)
  }

  return [
    Math.max(pixels, 1),
    Math.min(Math.max(distance, 0), 1),
    colorValidator,
    Math.min(Math.max(hueDistance, 0), 1),
    Math.min(Math.max(saturationDistance, 0), 1),
    Math.min(Math.max(lightnessDistance, 0), 1),
    crossOrigin
  ] 
}
