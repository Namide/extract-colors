import { describe, it, expect } from "vitest";
import HSLColor from "../src/color/HSLColor";
import { AverageHSLManager } from "../src/sort/AverageHSLManager";

/**
 * Default average values
 */
export const AVERAGE_HUE_DEFAULT = 1 / 12;
export const AVERAGE_SATURATION_DEFAULT = 1 / 5;
export const AVERAGE_LIGHTNESS_DEFAULT = 1 / 5;

describe("Average group", () => {
  it("Differents groups", () => {
    const avm = new AverageHSLManager(
      AVERAGE_HUE_DEFAULT,
      AVERAGE_SATURATION_DEFAULT,
      AVERAGE_LIGHTNESS_DEFAULT
    );
    avm.addColor(new HSLColor(0xff, 0xff, 0xff, 0));
    avm.addColor(new HSLColor(0x00, 0x00, 0x00, 0));
    avm.addColor(new HSLColor(0x77, 0x77, 0x77, 0));

    expect(avm.getGroups().length).toBe(3);
  });

  it("Similar groups", () => {
    const avm = new AverageHSLManager(
      AVERAGE_HUE_DEFAULT,
      AVERAGE_SATURATION_DEFAULT,
      AVERAGE_LIGHTNESS_DEFAULT
    );
    avm.addColor(new HSLColor(0xff, 0xff, 0xff, 0));
    avm.addColor(new HSLColor(0xee, 0xee, 0xee, 0));
    avm.addColor(new HSLColor(0x77, 0x77, 0x77, 0));

    expect(avm.getGroups().length).toBe(2);
  });
});
