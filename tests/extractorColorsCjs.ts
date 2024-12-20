/**
 * @vitest-environment node
 */
import { describe, it, expect } from "vitest";
import type { extractColors as extractColorsSrc } from "../src/main";
import { extractColors as extractColorsCjs } from "../lib/extract-colors.cjs";

// For typing cjs source
const extractColors = extractColorsCjs as typeof extractColorsSrc;

let seed = 654654331 % 2147483647;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const createImageData = (width: number, height: number) => {
  return {
    width,
    height,
    data: new Array(width * height)
      .fill(true)
      .map(() => [
        Math.floor(rand() * 0xff),
        Math.floor(rand() * 0xff),
        Math.floor(rand() * 0xff),
        0xff,
      ])
      .flat(),
  };
};

const createCustomImageData = (colors: number[]) => {
  return {
    width: colors.length,
    height: 1,
    data: colors
      .map((color) => [
        (color >> 16) & 0xff,
        (color >> 8) & 0xff,
        (color >> 0) & 0xff,
        0xff,
      ])
      .flat(),
  };
};

describe("CJS", () => {
  it("Not near options", () =>
    new Promise((done) => {
      const imageData = createImageData(3, 3);
      return extractColors(imageData, {
        fastDistance: 0,
        distance: 0,
      }).then((data) => {
        expect(data.list.length).toBe(3 * 3);
        done(undefined);
      });
    }));

  it("Little pixels", () =>
    new Promise((done) => {
      const imageData = createImageData(3, 3);
      return extractColors(imageData, {
        pixels: 1,
        fastDistance: 0,
        distance: 0,
      }).then((data) => {
        expect(data.list.length).toBe(1);
        done(undefined);
      });
    }));

  it("Big pixels", () =>
    new Promise((done) => {
      const imageData = createImageData(3, 3);
      return extractColors(imageData, {
        pixels: 1000,
        fastDistance: 0,
        distance: 0,
      }).then((data) => {
        expect(data.list.length).toBe(3 * 3);
        done(undefined);
      });
    }));

  it("Small distance", () =>
    new Promise((done) => {
      const imageData = createCustomImageData([0xffffff, 0xeeeeee]);
      return extractColors(imageData, {
        fastDistance: 0,
        distance: 0,
      }).then((data) => {
        expect(data.list.length).toBe(2);
        done(undefined);
      });
    }));

  it("Big distance", () =>
    new Promise((done) => {
      const imageData = createCustomImageData([0xffffff, 0xcccccc]);
      return extractColors(imageData, {
        fastDistance: 0.3,
        distance: 0,
      }).then((data) => {
        expect(data.list.length).toBe(1);
        done(undefined);
      });
    }));

  it("Big distance", () =>
    new Promise((done) => {
      const imageData = createCustomImageData([0xffffff, 0xeeeeee]);
      return extractColors(imageData, {
        fastDistance: 0.01,
        distance: 0,
      }).then((data) => {
        expect(data.list.length).toBe(2);
        done(undefined);
      });
    }));

  it("Color validator", () =>
    new Promise((done) => {
      const imageData = createCustomImageData([0xffffff, 0xff00bb]);
      return extractColors(imageData, {
        colorValidator: (r, g, b) => r === 0xff && g === 0x00 && b === 0xbb,
        distance: 0,
      }).then((data) => {
        expect(data.list.length).toBe(1);
        expect(data.list[0].hex).toBe(0xff00bb);
        done(undefined);
      });
    }));

  it("Small distance", () =>
    new Promise((done) => {
      const imageData = createCustomImageData([0xff0000, 0xff1100]);
      return extractColors(imageData, {
        fastDistance: 0,
        distance: 0,
      }).then((data) => {
        expect(data.list.length).toBe(2);
        done(undefined);
      });
    }));

  it("Big distance", () =>
    new Promise((done) => {
      const imageData = createCustomImageData([0xff0000, 0xff1100]);
      return extractColors(imageData, {
        fastDistance: 0,
        distance: 1,
      }).then((data) => {
        expect(data.list.length).toBe(1);
        done(undefined);
      });
    }));
});
