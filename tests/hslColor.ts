import { describe, it, expect } from "vitest";
import HSLColor from "../src/color/HSLColor";

describe("Color", () => {
  it("Get HSL", () => {
    const color1 = new HSLColor(0xff, 0xff, 0xff, 0);
    const color2 = new HSLColor(0x00, 0x00, 0x00, 0);
    expect(color1.s).toBe(0);
    expect(color1.l).toBe(1);
    expect(color2.l).toBe(0);
  });

  it("Test blue color", () => {
    const color1 = new HSLColor(0x00, 0x00, 0xff, 0);
    expect(color1.h).toBe(240 / 360);
  });
});
