import { createFinalColor } from "../src/color/FinalColor";
import RGBColor from "../src/color/RGBColor";

export function hexToFinalColor(hex: number, count = 1, totalCount = 2) {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return createFinalColor(new RGBColor(r, g, b, count), totalCount);
}
