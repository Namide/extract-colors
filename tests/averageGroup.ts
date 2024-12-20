import { describe, it, expect } from "vitest";
import { AverageColorGroup } from "../src/sort/AverageColorGroup";
import { hexToDetailledColor } from "../src/color/DetailledColor";

describe("Average group", () => {
  it("Near average", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToDetailledColor(0xffdd0d, 1, 2));
    av.addColor(hexToDetailledColor(0xfdfdfa, 1, 2));
    expect(av.average.r).toBe(0xfe);
    expect(av.average.g).toBe(0xed);
    expect(av.average.b).toBe(0x84);
  });

  it("Extreme average", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToDetailledColor(0xffffff, 1, 2));
    av.addColor(hexToDetailledColor(0x000000, 1, 2));
    expect(av.average.r).toBe(0x80);
    expect(av.average.g).toBe(0x80);
    expect(av.average.b).toBe(0x80);
  });

  it("Extreme 3 average", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToDetailledColor(0xffffff, 1, 2));
    av.addColor(hexToDetailledColor(0x808080, 1, 2));
    av.addColor(hexToDetailledColor(0x000000, 1, 2));
    expect(av.average.r).toBe(0x80);
    expect(av.average.g).toBe(0x80);
    expect(av.average.b).toBe(0x80);
  });

  it("Proportional average", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToDetailledColor(0xffffff, 2, 2));
    av.addColor(hexToDetailledColor(0x000000, 1, 2));
    expect(av.average.r).toBe(0xaa);
    expect(av.average.g).toBe(0xaa);
    expect(av.average.b).toBe(0xaa);
  });

  it("Same palette", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToDetailledColor(0xffffff, 1, 2));
    expect(
      av.isSamePalette(hexToDetailledColor(0xf0f0f0, 1, 2), 0.1)
    ).toBeTruthy();
  });

  it("Not same palette", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToDetailledColor(0x707070, 1, 2));
    expect(
      av.isSamePalette(hexToDetailledColor(0xf0f0f0, 1, 2), 0.1)
    ).toBeFalsy();
  });
});
