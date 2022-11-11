import { FinalColor } from "../types/Color";
import Color from "./Color";

export const createFinalColor = (color: Color, pixels: number): FinalColor => {
  return {
    hex: `#${'0'.repeat(6 - color.hex.toString(16).length)}${color.hex.toString(16)}`,
    red: color.red,
    green: color.green,
    blue: color.blue,
    area: color.count / pixels,
    hue: color.hue,
    saturation: color.saturation,
    lightness: color.lightness,
    intensity: color.intensity,
  }
}