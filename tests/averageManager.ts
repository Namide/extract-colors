import { describe, it, expect } from "vitest";
import { AverageColorManager } from "../src/sort/AverageColorManager";
import { hexToDetailledColor } from "../src/color/DetailledColor";

/**
 * Default average values
 */
export const AVERAGE_DEFAULT = 1 / 5;

describe("Average group", () => {
  it("Differents groups", () => {
    const avm = new AverageColorManager(AVERAGE_DEFAULT);

    avm.addColor(hexToDetailledColor(0xffffff, 1, 2));
    avm.addColor(hexToDetailledColor(0x000000, 1, 2));
    avm.addColor(hexToDetailledColor(0x777777, 1, 2));

    expect(avm.getGroups().length).toBe(3);
  });

  it("Similar groups", () => {
    const avm = new AverageColorManager(AVERAGE_DEFAULT);
    avm.addColor(hexToDetailledColor(0xffffff, 1, 2));
    avm.addColor(hexToDetailledColor(0xeeeeee, 1, 2));
    avm.addColor(hexToDetailledColor(0x777777, 1, 2));

    expect(avm.getGroups().length).toBe(2);
  });
});
