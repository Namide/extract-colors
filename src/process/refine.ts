import { rgbColorToDetailledColor } from "../color/DetailledColor";
import RGBColor from "../color/RGBColor";
import sortColors from "../sort/sortColors";

/**
 * Sort colors and generate standard list of colors.
 *
 * @param colors List of colors
 * @param pixels Count of pixels in the image
 * @param distance Maximal distance between colors before colors merging
 * @returns Sorted colors list
 */
export const refine = (colors: RGBColor[], count: number, distance: number) => {
  const fullColors = colors.map((color) =>
    rgbColorToDetailledColor(color, count)
  );
  return sortColors(fullColors, count, distance);
};
