/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from "vitest";
import {
  extractColors,
  extractColorsFromImage,
  extractColorsFromSrc,
} from "../src/extractColors";

const warns: string[] = [];

vi.spyOn(global.console, "warn").mockImplementation((message) => {
  warns.push(message);
});

describe("Node", () => {
  it("Check by color data", () =>
    new Promise((done) => {
      const imageData = {
        width: 2,
        height: 2,
        data: [
          0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00,
          0xff, 0xff, 0x00, 0x00, 0xff,
        ],
      };

      return extractColors(imageData as unknown as ImageData).then((data) => {
        expect(data.length).toBeGreaterThan(0);
        done(undefined);
      });
    }));

  it("Check bad distance", () =>
    new Promise((done) => {
      const imageData = {
        width: 2,
        height: 2,
        data: [
          0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00,
          0xff, 0xff, 0x00, 0x00, 0xff,
        ],
      };

      const options = {
        distance: 1.1,
      };

      return extractColors(imageData as unknown as ImageData, options).then(
        () => {
          expect(warns.pop()).toBe(
            "distance can not be more than 1 (it's 1.1)"
          );
          done(undefined);
        }
      );
    }));

  it("Use custom pixels", () =>
    new Promise((done) => {
      const imageData = {
        width: 2,
        height: 2,
        data: [
          0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00,
          0xff, 0xff, 0x00, 0x00, 0xff,
        ],
      };

      const options = {
        pixels: 1,
      };

      return extractColors(imageData as unknown as ImageData, options).then(
        (data) => {
          expect(data.length).toBe(1);
          done(undefined);
        }
      );
    }));

  it("Bad imageData", () =>
    new Promise((done) => {
      return new Promise((resolve, reject) => {
        try {
          const out = extractColors({} as ImageData);
          resolve(out);
        } catch (error) {
          reject(error);
        }
      }).catch((error) => {
        expect(error.message).toBe("Send imageData to extractColors");
        done(undefined);
      });
    }));

  it("Can not open extractColorsFromImage", () =>
    new Promise((done) => {
      return new Promise((resolve, reject) => {
        return extractColorsFromImage({} as HTMLImageElement)
          .then(resolve)
          .catch(reject);
      }).catch((error) => {
        expect(error.message).toBe(
          "Use extractColors instead extractColorsFromImage for Node.js"
        );
        done(undefined);
      });
    }));

  it("Can not open extractColorsFromSrc", () =>
    new Promise((done) => {
      return new Promise((resolve, reject) => {
        return extractColorsFromSrc("").then(resolve).catch(reject);
      }).catch((error) => {
        expect(error.message).toBe(
          "Can not use extractColorsFromSrc for Node.js"
        );
        done(undefined);
      });
    }));
});
