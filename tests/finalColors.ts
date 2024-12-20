import { describe, it, expect } from "vitest";
import {
  hexToDetailledColor,
  rgbColorToDetailledColor,
} from "../src/color/DetailledColor";
import RGBColor from "../src/color/RGBColor";

describe("Final color", () => {
  it("create", () => {
    const red = 0xf7;
    const green = 0x78;
    const blue = 0x01;
    const color = rgbColorToDetailledColor(
      new RGBColor(red, green, blue, 1),
      10
    );
    expect(color.rgb[0]).toBe(red);
    expect(color.rgb[1]).toBe(green);
    expect(color.rgb[2]).toBe(blue);
    expect(color.hsl[0]).toBe(0.08062330623306234);
    expect(color.hsl[1]).toBe(0.9919354838709677);
    expect(color.hsl[2]).toBe(0.48627450980392156);
    expect(color.hex).toBe("#f77801");
    expect(color.area).toBe(0.1);
  });

  it("Test white conversion", () => {
    const color = hexToDetailledColor(0xffffff, 1, 2);

    expect(color.rgb[0]).toBe(0xff);
    expect(color.rgb[1]).toBe(0xff);
    expect(color.rgb[2]).toBe(0xff);

    expect(color.hsl[0]).toBe(0);
    expect(color.hsl[1]).toBe(0);
    expect(color.hsl[2]).toBe(1);

    expect(color.lab[0]).toBeCloseTo(100, 1);
    expect(color.lab[1]).toBeCloseTo(0.0, 1);
    expect(color.lab[2]).toBeCloseTo(-0.0, 1);
  });

  it("Test black conversion", () => {
    const color = hexToDetailledColor(0x000000, 1, 2);

    expect(color.rgb[0]).toBe(0x00);
    expect(color.rgb[1]).toBe(0x00);
    expect(color.rgb[2]).toBe(0x00);

    expect(color.hsl[0]).toBe(0);
    expect(color.hsl[1]).toBe(0);
    expect(color.hsl[2]).toBe(0);

    expect(color.lab[0]).toBeCloseTo(0, 1);
    expect(color.lab[1]).toBeCloseTo(0.0, 1);
    expect(color.lab[2]).toBeCloseTo(-0.0, 1);
  });

  it("Test blue conversion", () => {
    const color = hexToDetailledColor(0x0000ff, 1, 2);

    expect(color.rgb[0]).toBe(0x00);
    expect(color.rgb[1]).toBe(0x00);
    expect(color.rgb[2]).toBe(0xff);

    expect(color.hsl[0]).toBeCloseTo(240 / 360, 1);
    expect(color.hsl[1]).toBeCloseTo(1, 1);
    expect(color.hsl[2]).toBeCloseTo(0.5, 1);

    expect(color.lab[0]).toBeCloseTo(32.297, 1);
    expect(color.lab[1]).toBeCloseTo(79.188, 1);
    expect(color.lab[2]).toBeCloseTo(-107.86, 1);
  });

  it("Test blue conversion", () => {
    const color = hexToDetailledColor(0x0000ff, 1, 2);

    expect(color.rgb[0]).toBe(0x00);
    expect(color.rgb[1]).toBe(0x00);
    expect(color.rgb[2]).toBe(0xff);

    expect(color.hsl[0]).toBeCloseTo(240 / 360, 1);
    expect(color.hsl[1]).toBeCloseTo(1, 1);
    expect(color.hsl[2]).toBeCloseTo(0.5, 1);

    expect(color.lab[0]).toBeCloseTo(32.297, 1);
    expect(color.lab[1]).toBeCloseTo(79.188, 1);
    expect(color.lab[2]).toBeCloseTo(-107.86, 1);
  });

  it("Test pink conversion", () => {
    const color = hexToDetailledColor(0xff0077, 1, 2);

    expect(color.rgb[0]).toBe(0xff);
    expect(color.rgb[1]).toBe(0x00);
    expect(color.rgb[2]).toBe(0x77);

    expect(color.hsl[0]).toBeCloseTo(0.92222, 1);
    expect(color.hsl[1]).toBeCloseTo(1, 1);
    expect(color.hsl[2]).toBeCloseTo(0.5, 1);

    expect(color.lab[0]).toBeCloseTo(54.657, 1);
    expect(color.lab[1]).toBeCloseTo(83.911, 1);
    expect(color.lab[2]).toBeCloseTo(9.157, 1);
  });

  it("Test lavand color conversion", () => {
    const color = hexToDetailledColor(0xaf95e3, 1, 2);

    expect(color.rgb[0]).toBe(0xaf);
    expect(color.rgb[1]).toBe(0x95);
    expect(color.rgb[2]).toBe(0xe3);

    expect(color.hsl[0]).toBeCloseTo(0.72222, 1);
    expect(color.hsl[1]).toBeCloseTo(0.58209, 1);
    expect(color.hsl[2]).toBeCloseTo(0.73725, 1);

    expect(color.lab[0]).toBeCloseTo(66.638, 1);
    expect(color.lab[1]).toBeCloseTo(25.511, 1);
    expect(color.lab[2]).toBeCloseTo(-36.022, 1);
  });
});
