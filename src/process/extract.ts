import RootGroup from "../color/RootGroup";
import type { ImageDataAlt } from "../types/Options";

/**
 * Run extract process and get list of colors.
 *
 * @param imageData ImageData or same Object ({ data: Uint8ClampedArray | number[]; width?: number; height?: number })
 * @param pixels Max pixels for calculation
 * @param distance Distance used between pixels
 * @param colorValidator Callback to validate if color is used for calculation
 */
export function extract(
  { data, width, height }: ImageDataAlt, // ImageData
  pixels: number,
  distance: number,
  colorValidator: (
    red: number,
    green: number,
    blue: number,
    alpha: number
  ) => boolean
) {
  const colorGroup = new RootGroup();
  const reducer =
    width && height ? Math.floor((width * height) / pixels) || 1 : 1;
  let ignoredColorsCount = 0;

  for (let i = 0; i < data.length; i += 4 * reducer) {
    const r = data[i]; // 0 -> 255
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (colorValidator(r, g, b, a)) {
      colorGroup.addColor(r, g, b);
    } else {
      ignoredColorsCount++;
    }
  }

  return {
    colors: colorGroup.getColors(distance),
    count: colorGroup.count + ignoredColorsCount,
  };
}
