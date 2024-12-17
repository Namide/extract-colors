import { describe, it, expect } from "vitest";
import { AverageColorManager } from "../src/sort/AverageColorManager";
import { hexToFinalColor } from "./testHelpers";

/**
 * Default average values
 */
export const AVERAGE_DEFAULT = 1 / 5;

describe("Average group", () => {
  it("Differents groups", () => {
    const avm = new AverageColorManager(AVERAGE_DEFAULT);

    avm.addColor(hexToFinalColor(0xffffff));
    avm.addColor(hexToFinalColor(0x000000));
    avm.addColor(hexToFinalColor(0x777777));

    expect(avm.getGroups().length).toBe(3);
  });

  it("Similar groups", () => {
    const avm = new AverageColorManager(AVERAGE_DEFAULT);
    avm.addColor(hexToFinalColor(0xffffff));
    avm.addColor(hexToFinalColor(0xeeeeee));
    avm.addColor(hexToFinalColor(0x777777));

    expect(avm.getGroups().length).toBe(2);
  });
});
