import { BrowserOptions, NodeOptions } from "../types/Options"

/**
 * Default extractor values
 */
export const enum EXTRACTOR_DEFAULT {
  PIXELS = 10000,
  DISTANCE = 0.12,
  SPLIT_POWER = 10
}

/**
 * Default average values
 */
export const enum AVERAGE_DEFAULT {
  HUE = 1/12,
  SATURATION = 1/5,
  LIGHTNESS = 1/5,
}

/**
 * Test if value is an integer.
 */
const testUint = <T = number>(label: string, val: T, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  if (!Number.isInteger(val) || val < min || val > max) {
    throw new Error(`${label} is invalid (${ val })`)
  }

  return val
}

/**
 * Test if value is a number.
 */
const testNumber = <T = number>(label: string, val: T, min = 0, max = Number.MAX_VALUE) => {
  if (Number(val) !== val || val < min || val > max) {
    throw new Error(`${label} is invalid (${ val })`)
  }

  return val
}

/**
 * Test if value is a function.
 */
const testFunction = <T = () => void>(label: string, val: T) => {
  if (!val || {}.toString.call(val) !== '[object Function]') {
    throw new Error(`${label} is invalid (${ val })`)
  }

  return val
}

export default (options:BrowserOptions | NodeOptions): [
  number,
  number,
  number,
  (red: number, green: number, blue: number, alpha: number) => boolean,
  number,
  number,
  number,
  "" | "anonymous" | "use-credentials" | null,
] => {
  return [
    testUint('pixels', options.pixels ?? EXTRACTOR_DEFAULT.PIXELS, 1),
    testNumber('distance', options.distance ?? EXTRACTOR_DEFAULT.DISTANCE, 0, 1),
    testUint('splitPower', options.splitPower ?? EXTRACTOR_DEFAULT.SPLIT_POWER, 2, 15),
    testFunction('colorValidator', options.colorValidator ?? ((_red: number, _green: number, _blue: number, _alpha?: number) => (_alpha ?? 255) > 250)),
    testNumber('hueDistance', options.hueDistance ?? AVERAGE_DEFAULT.HUE, 0, 1),
    testNumber('saturationDistance', options.saturationDistance ?? AVERAGE_DEFAULT.LIGHTNESS, 0, 1),
    testNumber('lightnessDistance', options.lightnessDistance ?? AVERAGE_DEFAULT.SATURATION, 0, 1),
    (options as BrowserOptions).crossOrigin ?? null
  ]
}
