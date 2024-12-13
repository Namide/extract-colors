import { describe, it, expect } from "vitest";
import RootGroup from "../src/color/RootGroup";

describe("RootGroup", () => {
  it("Color group init", () => {
    const group = new RootGroup();
    expect(typeof group.children).toBe("object");
    expect(group.count).toBe(0);
  });

  it("Add group", () => {
    const group = new RootGroup();
    group.addColor(0xff, 0x00, 0x77);
    group.addColor(0x77, 0x77, 0x77);
    group.addColor(0x77, 0x77, 0x77);
    expect(group.count).toBe(3);
    expect(group.getList().length).toBe(2);
  });

  it("Get max count color for 1 color", () => {
    const group = new RootGroup();
    group.addColor(0xff, 0xff, 0xff);
    group.addColor(0xff, 0xff, 0xff);
    group.addColor(0x00, 0x00, 0x00);
    expect(group.getColors(0).length).toBe(2);
    expect(group.count).toBe(3);
    expect(
      group.getColors(0).reduce((total, color) => total + color.count, 0)
    ).toBe(3);
    expect(group.getColors(0).length).toBe(2);
  });

  it("Add deep group", () => {
    const group = new RootGroup();
    const group4 = group.getLeafGroup(0xffff);
    group4.addColor(0xffffff, 0xff, 0xff, 0xff);
    group4.addColor(0xffffff, 0xff, 0xff, 0xff);
    group4.addColor(0xf7f7f7, 0xf7, 0xf7, 0xf7);
    group4.addColor(0xf9f9f9, 0xf9, 0xf9, 0xf9);
  });
});
