import { describe, it, expect } from "vitest";
import Color from "../src/color/Color";
import { AverageGroup } from "../src/sort/AverageGroup";

describe("Average group", () => {
  it("Near average", () => {
    const av = new AverageGroup();
    av.addColor(new Color(0xff, 0xff, 0xff));
    av.addColor(new Color(0xfd, 0xfd, 0xfd));
    expect(av.average._red).toBe(0xfe);
    expect(av.average._green).toBe(0xfe);
    expect(av.average._blue).toBe(0xfe);
  });

  it("Extreme average", () => {
    const av = new AverageGroup();
    av.addColor(new Color(0xff, 0xff, 0xff));
    av.addColor(new Color(0x00, 0x00, 0x00));
    expect(av.average._red).toBe(0x80);
    expect(av.average._green).toBe(0x80);
    expect(av.average._blue).toBe(0x80);
  });

  it("Extreme 3 average", () => {
    const av = new AverageGroup();
    av.addColor(new Color(0xff, 0xff, 0xff));
    av.addColor(new Color(0x80, 0x80, 0x80));
    av.addColor(new Color(0x00, 0x00, 0x00));
    expect(av.average._red).toBe(0x80);
    expect(av.average._green).toBe(0x80);
    expect(av.average._blue).toBe(0x80);
  });

  it("Same palette", () => {
    const av = new AverageGroup();
    av.addColor(new Color(0xff, 0xff, 0xff));
    expect(
      av.isSamePalette(new Color(0xf0, 0xf0, 0xf0), 0.1, 0.1, 0.1)
    ).toBeTruthy();
  });

  it("Not same palette", () => {
    const av = new AverageGroup();
    av.addColor(new Color(0x70, 0x70, 0x70));
    expect(
      av.isSamePalette(new Color(0xf0, 0xf0, 0xf0), 0.1, 0.1, 0.1)
    ).toBeFalsy();
  });
});
