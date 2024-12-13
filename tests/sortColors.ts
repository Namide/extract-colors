import { describe, it, expect } from "vitest";
import HSLColor from "../src/color/HSLColor";
import sortHSLColors from "../src/sort/sortHSLColors";

/**
 * Default average values
 */
export const AVERAGE_HUE_DEFAULT = 1 / 12;
export const AVERAGE_SATURATION_DEFAULT = 1 / 5;
export const AVERAGE_LIGHTNESS_DEFAULT = 1 / 5;

describe("Sort color", () => {
  it("Sort by area", () => {
    const colors = sortHSLColors(
      [
        new HSLColor(0xff, 0xff, 0xff, 1),
        new HSLColor(0xff, 0xff, 0xff, 1),
        new HSLColor(0x77, 0x77, 0x77, 1),
      ],
      10,
      AVERAGE_HUE_DEFAULT,
      AVERAGE_SATURATION_DEFAULT,
      AVERAGE_LIGHTNESS_DEFAULT
    );

    expect(colors.length).toBe(2);
    expect(colors[0].r).toBe(0x77);
  });

  it("Sort by saturation", () => {
    const colors = sortHSLColors(
      [new HSLColor(0x73, 0x76, 0x72, 1), new HSLColor(0xff, 0x00, 0x77, 1)],
      10,
      AVERAGE_HUE_DEFAULT,
      AVERAGE_SATURATION_DEFAULT,
      AVERAGE_LIGHTNESS_DEFAULT
    );

    expect(colors.length).toBe(2);
    expect(colors[0].r).toBe(0xff);
  });
});
