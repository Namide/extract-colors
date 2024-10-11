import { BrowserOptions, OptionsCleaned } from "../types/Options";

/**
 * Default extractor values
 */
export const EXTRACTOR_PIXELS_DEFAULT = 64000;
export const EXTRACTOR_DISTANCE_DEFAULT = 0.22;

/**
 * Default average values
 */
export const AVERAGE_HUE_DEFAULT = 1 / 12;
export const AVERAGE_SATURATION_DEFAULT = 1 / 5;
export const AVERAGE_LIGHTNESS_DEFAULT = 1 / 5;

export function testInputs({
  pixels = EXTRACTOR_PIXELS_DEFAULT,
  distance = EXTRACTOR_DISTANCE_DEFAULT,
  colorValidator = (
    _red: number,
    _green: number,
    _blue: number,
    _alpha?: number
  ) => (_alpha ?? 255) > 250,
  hueDistance = AVERAGE_HUE_DEFAULT,
  saturationDistance = AVERAGE_LIGHTNESS_DEFAULT,
  lightnessDistance = AVERAGE_SATURATION_DEFAULT,
  crossOrigin = "",
  requestMode = "cors",
}: BrowserOptions = {}) {
  /**
   * Test if value is an integer.
   */
  const testUint = (
    label: string,
    val: number,
    min = 0,
    max = Number.MAX_SAFE_INTEGER
  ) => {
    if (!Number.isInteger(val)) {
      throw new Error(`${label} is not a valid number (${val})`);
    }

    if (val < min) {
      console.warn(`${label} can not be less than ${min} (it's ${val})`);
    }

    if (val > max) {
      console.warn(`${label} can not be more than ${max} (it's ${val})`);
    }

    return Math.min(Math.max(val, min), max);
  };

  /**
   * Test if value is a number.
   */
  const testNumber = (
    label: string,
    val: number,
    min = 0,
    max = Number.MAX_VALUE
  ) => {
    if (Number(val) !== val) {
      throw new Error(`${label} is not a valid number (${val})`);
    }

    if (val < min) {
      console.warn(`${label} can not be less than ${min} (it's ${val})`);
    }

    if (val > max) {
      console.warn(`${label} can not be more than ${max} (it's ${val})`);
    }

    return Math.min(Math.max(val, min), max);
  };

  /**
   * Test if value is a function.
   */
  const testFunction = <T = () => void>(label: string, val: T) => {
    if (!val || {}.toString.call(val) !== "[object Function]") {
      throw new Error(`${label} is not a function (${val})`);
    }

    return val;
  };

  /**
   * Test if value is in the list of values
   */
  const testValueInList = <T>(label: string, val: T, list: T[]) => {
    if (list.indexOf(val) < 0) {
      console.warn(
        `${label} can be one of this values ${list
          .map((v) => `"${v}"`)
          .join(", ")} (it's "${val}")`
      );
    }
  };

  testUint("pixels", pixels || 0, 1);
  testNumber("distance", distance, 0, 1);
  testFunction("colorValidator", colorValidator);
  testNumber("hueDistance", hueDistance, 0, 1);
  testNumber("saturationDistance", saturationDistance, 0, 1);
  testNumber("lightnessDistance", lightnessDistance, 0, 1);
  testValueInList("crossOrigin", crossOrigin, [
    "",
    "anonymous",
    "use-credentials",
  ]);
  testValueInList("requestMode", requestMode, [
    "cors",
    "navigate",
    "no-cors",
    "same-origin",
  ]);
}

export default ({
  pixels = EXTRACTOR_PIXELS_DEFAULT,
  distance = EXTRACTOR_DISTANCE_DEFAULT,
  colorValidator = (
    _red: number,
    _green: number,
    _blue: number,
    _alpha?: number
  ) => (_alpha ?? 255) > 250,
  hueDistance = AVERAGE_HUE_DEFAULT,
  saturationDistance = AVERAGE_LIGHTNESS_DEFAULT,
  lightnessDistance = AVERAGE_SATURATION_DEFAULT,
  crossOrigin = "",
  requestMode = "cors",
}: BrowserOptions = {}): OptionsCleaned => {
  return [
    Math.max(pixels, 1),
    Math.min(Math.max(distance, 0), 1),
    colorValidator,
    Math.min(Math.max(hueDistance, 0), 1),
    Math.min(Math.max(saturationDistance, 0), 1),
    Math.min(Math.max(lightnessDistance, 0), 1),
    crossOrigin,
    requestMode,
  ];
};
