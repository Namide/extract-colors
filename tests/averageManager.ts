import { describe, it, expect } from "vitest";
import Color from "../src/color/Color";
import {
  AVERAGE_HUE_DEFAULT,
  AVERAGE_SATURATION_DEFAULT,
  AVERAGE_LIGHTNESS_DEFAULT,
} from "../src/extract/cleanInputs";
import { AverageManager } from "../src/sort/AverageManager";

describe("Average group", () => {
  it("Differents groups", () => {
    const avm = new AverageManager(
      AVERAGE_HUE_DEFAULT,
      AVERAGE_SATURATION_DEFAULT,
      AVERAGE_LIGHTNESS_DEFAULT
    );
    avm.addColor(new Color(0xff, 0xff, 0xff));
    avm.addColor(new Color(0x00, 0x00, 0x00));
    avm.addColor(new Color(0x77, 0x77, 0x77));

    expect(avm.getGroups().length).toBe(3);
  });

  it("Similar groups", () => {
    const avm = new AverageManager(
      AVERAGE_HUE_DEFAULT,
      AVERAGE_SATURATION_DEFAULT,
      AVERAGE_LIGHTNESS_DEFAULT
    );
    avm.addColor(new Color(0xff, 0xff, 0xff));
    avm.addColor(new Color(0xee, 0xee, 0xee));
    avm.addColor(new Color(0x77, 0x77, 0x77));

    expect(avm.getGroups().length).toBe(2);
  });
});
