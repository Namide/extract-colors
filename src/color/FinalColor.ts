import type { FinalColor } from "../types/Color";
import RGBColor from "./RGBColor";

/**
 * Normalize color
 *
 * @param color Initial color
 * @param pixels Pixel count of this color
 *
 * @returns Normalized color
 */
export function createFinalColor(color: RGBColor, count: number): FinalColor {
  const hexStr = ((color.r << 16) | (color.g << 8) | color.b).toString(16);
  return {
    hex: `#${"0".repeat(6 - hexStr.length)}${hexStr}`,
    area: color.count / count,
    rgb: [color.r, color.g, color.b],
    hsl: getHSL(color.r, color.g, color.b),
    lab: getLAB(color.r, color.g, color.b),
    count: color.count,
  };
}

function getHSL(
  red: number,
  green: number,
  blue: number
): [number, number, number] {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let hue = 0;
  let saturation = 0;
  let lightness = (max + min) / 2;

  if (max === min) {
    hue = saturation = 0;
  } else {
    const dist = max - min;
    saturation = lightness > 0.5 ? dist / (2 - max - min) : dist / (max + min);
    switch (max) {
      case r:
        hue = (g - b) / dist + (g < b ? 6 : 0);
        break;
      case g:
        hue = (b - r) / dist + 2;
        break;
      case b:
        hue = (r - g) / dist + 4;
    }
    hue /= 6;
  }

  return [hue, saturation, lightness];
}

// https://github.com/antimatter15/rgb-lab/blob/master/color.js
function getLAB(
  red: number,
  green: number,
  blue: number
): [number, number, number] {
  let r = red / 255;
  let g = green / 255;
  let b = blue / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  let x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  let y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.0;
  let z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
  y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
  z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

export function deltaE(a: FinalColor, b: FinalColor) {
  const deltaL = a.lab[0] - b.lab[0];
  const deltaA = a.lab[1] - b.lab[1];
  const deltaB = a.lab[2] - b.lab[2];
  const c1 = Math.sqrt(a.lab[1] * a.lab[1] + a.lab[2] * a.lab[2]);
  const c2 = Math.sqrt(b.lab[1] * b.lab[1] + b.lab[2] * b.lab[2]);
  const deltaC = c1 - c2;
  let deltaH = deltaA * deltaA + deltaB * deltaB - deltaC * deltaC;
  deltaH = deltaH < 0 ? 0 : Math.sqrt(deltaH);
  const sc = 1.0 + 0.045 * c1;
  const sh = 1.0 + 0.015 * c1;
  const deltaLKlsl = deltaL / 1.0;
  const deltaCkcsc = deltaC / sc;
  const deltaHkhsh = deltaH / sh;
  const i =
    deltaLKlsl * deltaLKlsl + deltaCkcsc * deltaCkcsc + deltaHkhsh * deltaHkhsh;
  return i < 0 ? 0 : Math.sqrt(i);
}
