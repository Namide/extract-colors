import { describe, it, expect } from "vitest";
import { AverageColorGroup } from "../src/sort/AverageColorGroup";
import { hexToFinalColor } from "./testHelpers";

describe("Average group", () => {
  it("Near average", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToFinalColor(0xffdd0d));
    av.addColor(hexToFinalColor(0xfdfdfa));
    expect(av.average.r).toBe(0xfe);
    expect(av.average.g).toBe(0xed);
    expect(av.average.b).toBe(0x84);
  });

  it("Extreme average", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToFinalColor(0xffffff));
    av.addColor(hexToFinalColor(0x000000));
    expect(av.average.r).toBe(0x80);
    expect(av.average.g).toBe(0x80);
    expect(av.average.b).toBe(0x80);
  });

  it("Extreme 3 average", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToFinalColor(0xffffff));
    av.addColor(hexToFinalColor(0x808080));
    av.addColor(hexToFinalColor(0x000000));
    expect(av.average.r).toBe(0x80);
    expect(av.average.g).toBe(0x80);
    expect(av.average.b).toBe(0x80);
  });

  it("Proportional average", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToFinalColor(0xffffff, 2));
    av.addColor(hexToFinalColor(0x000000, 1));
    expect(av.average.r).toBe(0xaa);
    expect(av.average.g).toBe(0xaa);
    expect(av.average.b).toBe(0xaa);
  });

  it("Same palette", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToFinalColor(0xffffff));
    expect(av.isSamePalette(hexToFinalColor(0xf0f0f0), 0.1)).toBeTruthy();
  });

  it("Not same palette", () => {
    const av = new AverageColorGroup();
    av.addColor(hexToFinalColor(0x707070, 1));
    expect(av.isSamePalette(hexToFinalColor(0xf0f0f0), 0.1)).toBeFalsy();
  });
});
