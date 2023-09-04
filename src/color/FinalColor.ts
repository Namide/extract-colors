import { FinalColor } from "../types/Color";
import Color from "./Color";

/**
 * Normalize color
 * 
 * @param color Initial color
 * @param pixels Pixel count of this color
 * 
 * @returns Normalized color
 */
export const createFinalColor = (color: Color, pixels: number): FinalColor => {
  return {
    hex: `#${'0'.repeat(6 - color._hex.toString(16).length)}${color._hex.toString(16)}`,
    red: color._red,
    green: color._green,
    blue: color._blue,
    area: color._count / pixels,
    hue: color._hue,
    saturation: color._saturation,
    lightness: color._lightness,
    intensity: color._intensity,
  }
}