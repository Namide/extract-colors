import { describe, it, expect } from "vitest";
import HSLColor from "../src/color/HSLColor";
import { AverageHSLGroup } from "../src/sort/AverageHSLGroup";

describe("Average group", () => {
  it("Near average", () => {
    const av = new AverageHSLGroup();
    av.addColor(new HSLColor(0xff, 0xff, 0xff, 1));
    av.addColor(new HSLColor(0xfd, 0xfd, 0xfd, 1));
    expect(av.average.r).toBe(0xfe);
    expect(av.average.g).toBe(0xfe);
    expect(av.average.b).toBe(0xfe);
  });

  it("Extreme average", () => {
    const av = new AverageHSLGroup();
    av.addColor(new HSLColor(0xff, 0xff, 0xff, 1));
    av.addColor(new HSLColor(0x00, 0x00, 0x00, 1));
    expect(av.average.r).toBe(0x80);
    expect(av.average.g).toBe(0x80);
    expect(av.average.b).toBe(0x80);
  });

  it("Extreme 3 average", () => {
    const av = new AverageHSLGroup();
    av.addColor(new HSLColor(0xff, 0xff, 0xff, 1));
    av.addColor(new HSLColor(0x80, 0x80, 0x80, 1));
    av.addColor(new HSLColor(0x00, 0x00, 0x00, 1));
    expect(av.average.r).toBe(0x80);
    expect(av.average.g).toBe(0x80);
    expect(av.average.b).toBe(0x80);
  });

  it("Same palette", () => {
    const av = new AverageHSLGroup();
    av.addColor(new HSLColor(0xff, 0xff, 0xff, 1));
    expect(
      av.isSamePalette(new HSLColor(0xf0, 0xf0, 0xf0, 1), 0.1, 0.1, 0.1)
    ).toBeTruthy();
  });

  it("Not same palette", () => {
    const av = new AverageHSLGroup();
    av.addColor(new HSLColor(0x70, 0x70, 0x70, 1));
    expect(
      av.isSamePalette(new HSLColor(0xf0, 0xf0, 0xf0, 1), 0.1, 0.1, 0.1)
    ).toBeFalsy();
  });
});
