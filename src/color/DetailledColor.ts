import type { DetailledColor } from "../types/Color";
import RGBColor from "./RGBColor";

/**
 * Normalize color
 *
 * @param color RGB color
 * @param pixels Pixel count inside all the image
 *
 * @returns Detailed color
 */
export function rgbColorToDetailledColor(
  color: RGBColor,
  count: number
): DetailledColor {
  return hexToDetailledColor(
    (color.r << 16) | (color.g << 8) | color.b,
    color.count,
    count
  );
}

export function hexToDetailledColor(
  hex: number,
  count = 0,
  total = 1
): DetailledColor {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  const hexStr = hex.toString(16);
  const lab = getLAB(r, g, b);
  return {
    hex: `#${"0".repeat(6 - hexStr.length)}${hexStr}`,
    area: count / total,
    rgb: [r, g, b],
    hsl: getHSL(r, g, b),
    lab,
    ecHsl: getPerceptiveHSL(lab),
    count,
  };
}

export function getPerceptiveHSL(
  lab: [number, number, number]
): [number, number, number] {
  const hue = (1 + Math.atan2(lab[2], lab[1]) / Math.PI) / 2; // PI * 2
  const saturation = Math.min(
    1,
    Math.max(0, Math.sqrt(lab[1] ** 2 + lab[2] ** 2) / 100)
  );
  const lightness = Math.min(1, Math.max(0, lab[0] / 100));
  return [hue, saturation, lightness];
}

export function deltaE(
  lab1: [number, number, number],
  lab2: [number, number, number]
) {
  const deltaL = lab1[0] - lab2[0];
  const deltaA = lab1[1] - lab2[1];
  const deltaB = lab1[2] - lab2[2];
  const c1 = Math.sqrt(lab1[1] * lab1[1] + lab1[2] * lab1[2]);
  const c2 = Math.sqrt(lab2[1] * lab2[1] + lab2[2] * lab2[2]);
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

// export function hslDist(
//   a: DetailledColor,
//   b: DetailledColor
// ): [number, number, number] {
//   const lightnessIncreaseA = 1 - Math.abs(a.hsl[2] * 2 - 1);
//   const lightnessIncreaseB = 1 - Math.abs(b.hsl[2] * 2 - 1);

//   const saturationIncreaseA = a.hsl[1];
//   const saturationIncreaseB = b.hsl[1];

//   const lightnessDist = Math.abs(b.hsl[2] - a.hsl[2]);
//   const saturationDist =
//     (Math.abs(b.hsl[1] - a.hsl[1]) *
//       (lightnessIncreaseA + lightnessIncreaseB)) /
//     2;
//   const hueDist =
//     (((Math.min(
//       Math.abs(b.hsl[0] - a.hsl[0]),
//       b.hsl[0] > a.hsl[0]
//         ? Math.abs(a.hsl[0] + 1 - b.hsl[0])
//         : Math.abs(b.hsl[0] + 1 - a.hsl[0])
//     ) *
//       (lightnessIncreaseA + lightnessIncreaseB)) /
//       2) *
//       (saturationIncreaseA + saturationIncreaseB)) /
//     2;

//   return [hueDist, saturationDist, lightnessDist];
// }

export function getHSL(
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
// 0 -> 100
// -100 -> 100
// -100 -> 100
export function getLAB(
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
