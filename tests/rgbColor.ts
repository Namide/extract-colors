import { describe, it, expect } from "vitest";
import RGBColor from "../src/color/RGBColor";

describe("Color", () => {
  it("Color hexa from chanels", () => {
    const red = 0xf7;
    const green = 0x78;
    const blue = 0x01;
    const color = new RGBColor(red, green, blue);
    expect(color.r).toBe(red);
    expect(color.g).toBe(green);
    expect(color.b).toBe(blue);
    expect(color.count).toBe(1);
  });

  it("Color distance far", () => {
    const color1 = new RGBColor(0xff, 0xff, 0xff);
    const color2 = new RGBColor(0x00, 0x00, 0x00);
    expect(RGBColor.distance(color1, color2)).toBe(1);
    expect(RGBColor.distance(color2, color1)).toBe(1);
  });

  it("Color distance near", () => {
    const color1 = new RGBColor(0xff, 0xff, 0xff);
    const color2 = new RGBColor(0xff, 0xff, 0xff);
    expect(RGBColor.distance(color1, color2)).toBe(0);
    expect(RGBColor.distance(color2, color1)).toBe(0);
  });
});
