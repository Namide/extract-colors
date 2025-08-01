import {
  type ColorClassification,
  colorClassificationFull,
} from "../types/Color";
import type { BrowserOptions, OptionsCleaned } from "../types/Options";

const EXTRACTOR_PIXELS_DEFAULT = 64000;
const EXTRACTOR_DISTANCE_DEFAULT = 0.125;
const AVERAGE_DISTANCE_DEFAULT = 0.25;
const DEFAULT_MAIN_COLOR = 0x0077ff;

export function testInputs<Type extends ColorClassification>({
  pixels = EXTRACTOR_PIXELS_DEFAULT,
  distance,
  fastDistance,
  colorValidator = (
    _red: number,
    _green: number,
    _blue: number,
    alpha?: number
  ) => (alpha ?? 255) > 250,
  crossOrigin = "",
  requestMode = "cors",
  colorClassifications = colorClassificationFull as unknown as Type[],
  defaultColors = false,
  defaultMainColor = DEFAULT_MAIN_COLOR,
}: BrowserOptions<Type> = {}) {
  distance =
    distance ??
    (fastDistance !== undefined && fastDistance >= 0 && fastDistance <= 1
      ? fastDistance * 2
      : AVERAGE_DISTANCE_DEFAULT);
  fastDistance =
    fastDistance ??
    (distance !== undefined && distance >= 0 && distance <= 1
      ? distance / 2
      : EXTRACTOR_DISTANCE_DEFAULT);

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
  const testValueInList = <T>(label: string, val: T, list: readonly T[]) => {
    if (list.indexOf(val) < 0) {
      console.warn(
        `${label} can be one of this values ${list
          .map((v) => `"${v}"`)
          .join(", ")} (it's "${val}")`
      );
    }
  };

  testUint("pixels", pixels || 0, 1, Infinity);
  testNumber("distance", distance, 0, 1);
  testFunction("colorValidator", colorValidator);
  testNumber("fastDistance", fastDistance, 0, 1);

  if (
    distance >= 0 &&
    fastDistance >= 0 &&
    distance <= 1 &&
    fastDistance <= 1 &&
    fastDistance > distance
  ) {
    console.warn(
      `"fastDistance" is used before "distance", so it's better for "fastDistance" to be less than "distance"`
    );
  }

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
  for (const type of colorClassifications) {
    testValueInList("colorClassifications", type, colorClassificationFull);
  }

  if (defaultColors !== false && defaultColors !== true) {
    if (!(defaultColors instanceof Object)) {
      throw new Error(`defaultColors is not a Boolean or Object`);
    } else {
      for (const key of Object.keys(defaultColors) as Type[]) {
        testValueInList(`defaultColors.${key}`, key, colorClassifications);
        switch (true) {
          case defaultColors[key] === false:
          case defaultColors[key] === true:
          case defaultColors[key] instanceof Function:
            break;
          case Number(defaultColors[key]) === defaultColors[key]:
            testUint(`defaultColors.${key}`, defaultColors[key], 0, 0xffffff);
            break;
          default:
            throw new Error(
              `defaultColors.${key} can not be "${defaultColors[key]}", the value expected are boolean, hexadecimal uint color or a function to generate an hexadecimal uint color`
            );
        }
      }
    }
  }

  testUint("defaultMainColor", defaultMainColor, 0, 0xffffff);
}

export default function cleanInputs<Type extends ColorClassification>({
  pixels = EXTRACTOR_PIXELS_DEFAULT,
  fastDistance,
  colorValidator = (
    _red: number,
    _green: number,
    _blue: number,
    alpha?: number
  ) => (alpha ?? 255) > 250,
  distance,
  crossOrigin = "",
  requestMode = "cors",
  colorClassifications = colorClassificationFull as unknown as Type[], // Remove readonly property of the array
  defaultColors = false,
  defaultMainColor = DEFAULT_MAIN_COLOR,
}: BrowserOptions<Type> = {}): OptionsCleaned<Type> {
  distance =
    distance ??
    (fastDistance !== undefined ? fastDistance * 2 : AVERAGE_DISTANCE_DEFAULT);
  fastDistance =
    fastDistance ??
    (distance !== undefined ? distance / 2 : EXTRACTOR_DISTANCE_DEFAULT);

  return {
    pixels: Math.max(pixels, 1),
    fastDistance: Math.min(Math.max(fastDistance, 0), 1),
    colorValidator,
    distance: Math.min(Math.max(distance, 0), 1),
    crossOrigin,
    requestMode,
    colorClassifications,
    defaultColors,
    defaultMainColor: Math.min(Math.max(defaultMainColor, 0), 0xffffff),
  };
}
