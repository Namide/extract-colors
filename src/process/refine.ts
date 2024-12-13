import { createFinalColor } from "../color/FinalColor";
import HSLColor from "../color/HSLColor";
import RGBColor from "../color/RGBColor";
import sortHSLColors from "../sort/sortHSLColors";

/**
 * Sort colors and generate standard list of colors.
 *
 * @param colors List of colors
 * @param pixels Count of pixels in the image
 * @param hueDistance Maximal HUE distance between pixel before pixel merging
 * @param saturationDistance Maximal saturation distance between pixel before pixel merging
 * @param lightnessDistance Maximal lightness distance between pixel before pixel merging
 * @returns Sorted colors list
 */
export const refine = (
  colors: RGBColor[],
  count: number,
  hueDistance: number,
  saturationDistance: number,
  lightnessDistance: number
) => {
  const hslColors = colors.map(
    (rgbColor) =>
      new HSLColor(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.count)
  );
  const list = sortHSLColors(
    hslColors,
    count,
    hueDistance,
    saturationDistance,
    lightnessDistance
  );
  return list.map((color) => createFinalColor(color, count));
};
