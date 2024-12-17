import { createFinalColor } from "../color/FinalColor";
import RGBColor from "../color/RGBColor";
import sortColors from "../sort/sortColors";

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
export const refine = (colors: RGBColor[], count: number, distance: number) => {
  const fullColors = colors.map((color) => createFinalColor(color, count));
  return sortColors(fullColors, count, distance);
};
