import { describe, it, expect } from "vitest";
import sortColors from "../src/sort/sortColors";
import { hexToFinalColor } from "./testHelpers";

/**
 * Default average values
 */
export const AVERAGE_DEFAULT = 1 / 5;

describe("Sort color", () => {
  it("Sort by area", () => {
    const colors = sortColors(
      [
        hexToFinalColor(0xffffff),
        hexToFinalColor(0xffffff),
        hexToFinalColor(0x777777),
      ],
      10,
      AVERAGE_DEFAULT
    );

    expect(colors.length).toBe(2);
    expect(colors[0].rgb[0]).toBe(0x77);
  });

  it("Sort by saturation", () => {
    const colors = sortColors(
      [hexToFinalColor(0x737672), hexToFinalColor(0xff0077)],
      10,
      AVERAGE_DEFAULT
    );

    expect(colors.length).toBe(2);
    expect(colors[0].rgb[0]).toBe(0xff);
  });
});
