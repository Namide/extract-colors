import { FinalColor } from "../types/Color";
import HSLColor from "./HSLColor";

/**
 * Normalize color
 *
 * @param color Initial color
 * @param pixels Pixel count of this color
 *
 * @returns Normalized color
 */
export const createFinalColor = (
  color: HSLColor,
  count: number
): FinalColor => {
  const hexStr = ((color.r << 16) | (color.g << 8) | color.b).toString(16);
  return {
    hex: `#${"0".repeat(6 - hexStr.length)}${hexStr}`,
    red: color.r,
    green: color.g,
    blue: color.b,
    area: color.count / count,
    hue: color.h,
    saturation: color.s,
    lightness: color.l,
    intensity: color.i,
  };
};
