import { describe, it, expect } from "vitest";
import sortColors from "../src/sort/sortColors";
import { hexToDetailledColor } from "../src/color/DetailledColor";

/**
 * Default average values
 */
export const AVERAGE_DEFAULT = 1 / 5;

describe("Sort color", () => {
  it("Sort by area", () => {
    const colors = sortColors(
      [
        hexToDetailledColor(0xffffff, 1, 2),
        hexToDetailledColor(0xffffff, 1, 2),
        hexToDetailledColor(0x777777, 1, 2),
      ],
      10,
      AVERAGE_DEFAULT
    );

    expect(colors.length).toBe(2);
    expect(colors[0].rgb[0]).toBe(0x77);
  });

  it("Sort by saturation", () => {
    const colors = sortColors(
      [
        hexToDetailledColor(0x737672, 1, 2),
        hexToDetailledColor(0xff0077, 1, 2),
      ],
      10,
      AVERAGE_DEFAULT
    );

    expect(colors.length).toBe(2);
    expect(colors[0].rgb[0]).toBe(0xff);
  });
});
