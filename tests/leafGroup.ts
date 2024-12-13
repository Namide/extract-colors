import { describe, it, expect } from "vitest";

import LeafGroup from "../src/color/LeafGroup";

describe("LeafGroup", () => {
  it("Init", () => {
    const group = new LeafGroup();
    expect(typeof group.children).toBe("object");
    expect(group.count).toBe(0);
  });

  it("Group colors", () => {
    const group = new LeafGroup();
    group.addColor(0xff0077, 0xff, 0x00, 0x77);
    group.addColor(0x777777, 0x77, 0x77, 0x77);
    group.addColor(0x777777, 0x77, 0x77, 0x77);
    expect(group.getList().length).toBe(2);
    expect(group.count).toBe(3);
    // expect(group.getMaxWeightColor()._hex).toBe(0x777777)
  });

  it("Get max count color for 1 color", () => {
    const group = new LeafGroup();
    group.addColor(0xffffff, 0xff, 0xff, 0xff);
    group.addColor(0xffffff, 0xff, 0xff, 0xff);
    group.addColor(0x000000, 0x00, 0x00, 0x00);
    // expect(group.getMaxCountColor().count).toBe(2)
    // expect(group.getMaxCountColor()._hex).toBe(0xFFFFFF)
  });

  it("Add color", () => {
    const group = new LeafGroup();
    const color1 = group.addColor(0xff0077, 0xff, 0x00, 0x77);
    group.addColor(0xff0077, 0xff, 0x00, 0x77);
    const color3 = group.addColor(0xff0000, 0xff, 0x00, 0x00);
    expect(color1.count).toBe(2);
    expect(group.getList().length).toBe(2);
    expect(color3.count).toBe(1);
    // expect(group.getMaxWeight()).toBeCloseTo(2 / 3, 5)
    // expect(group.getMaxWeightColor()._hex).toBe(0xFF0077)
  });

  it("Max weight", () => {
    const group = new LeafGroup();
    group.addColor(0x0000ff, 0x00, 0x00, 0x77);
    group.addColor(0x0000ff, 0x00, 0x00, 0x77);
    group.addColor(0xff0000, 0xff, 0x00, 0x00);
    // expect(group.getMaxWeight()).toBe(2/3)
    // expect(group.getMaxWeight()).toBe(2/3)
  });
});
