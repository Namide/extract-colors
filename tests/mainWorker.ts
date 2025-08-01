import { describe, it, expect, vi } from "vitest";
import { extractColors } from "../src/main";

// Mock ImageBitmap
class ImageBitmap {
  complete = true;
  width = 2;
  height = 2;
  close() {
    return 0;
  }
}

// Mock ImageData
class ImageData {
  colorSpace = "srgb";
  data = new Uint8ClampedArray([
    0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00, 0xff,
    0xff, 0x00, 0x00, 0xff,
  ]);
  width = 2;
  height = 2;
}

vi.stubGlobal("Image", ImageBitmap);
vi.stubGlobal(
  "fetch",
  () =>
    new Promise((resolve) =>
      resolve({
        blob() {
          return new Promise((resolve) => resolve(""));
        },
      })
    )
);
vi.stubGlobal(
  "createImageBitmap",
  () => new Promise((resolve) => resolve(new ImageBitmap()))
);

vi.stubGlobal("self", { constructor: { name: "DedicatedWorkerGlobalScope" } });

vi.stubGlobal("ImageData", ImageData);

// createElement: () => ({
//   width: 2,
//   height: 2,
//   getContext: () => ({
//     drawImage: () => 0,
//     getImageData: () => new ImageData(),
//   }),
// }),

class OffscreenCanvas {
  getContext() {
    return {
      drawImage: () => 0,
      getImageData: () => new ImageData(),
    };
  }
}

vi.stubGlobal("OffscreenCanvas", OffscreenCanvas);

// Mock document
const document = {
  createElement: () => ({
    width: 2,
    height: 2,
    getContext: () => ({
      drawImage: () => 0,
      getImageData: () => new ImageData(),
    }),
  }),
};

vi.stubGlobal("document", document);

// Mock window
const window = {
  document,
};

vi.stubGlobal("window", window);

// Disable Node.js context
vi.stubGlobal("process.versions.node", undefined);

describe("Browser", () => {
  it("Extract from imageData", () =>
    new Promise((done) => {
      const imageData = new ImageData();
      return extractColors(imageData).then((data) => {
        expect(data.list.length).toBeGreaterThan(0);
        done(undefined);
      });
    }));

  it("Extract from imageData 2", () =>
    new Promise((done) => {
      const imageData = new ImageData();
      return extractColors(imageData).then((data) => {
        expect(data.list.length).toBeGreaterThan(0);
        done(undefined);
      });
    }));

  it("Extract from src", () =>
    new Promise((done) => {
      extractColors("fakesrc.jpg").then((data) => {
        expect(data.list.length).toBeGreaterThan(0);
        done(undefined);
      });
    }));

  it("Bad arg", () =>
    new Promise((done) => {
      return new Promise((resolve, reject) => {
        try {
          const out = extractColors(123 as unknown as string);
          resolve(out);
        } catch (error) {
          reject(error);
        }
      }).catch((error) => {
        expect(error.message).toBe("Can not analyse picture");
        done(undefined);
      });
    }));
});
