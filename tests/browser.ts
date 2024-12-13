import { describe, it, expect, vi } from "vitest";
import { extractColors } from "../src/main";

// Mock Image
class Image {
  complete = true;
  width = 2;
  height = 2;
}

class ImageLoadable extends Image {
  private _cb = () => 1;

  constructor() {
    super();
    this.complete = false;
    setTimeout(() => {
      this.complete = true;
      this._cb();
    }, 10);
  }

  addEventListener(_, cb) {
    this._cb = cb;
  }

  removeEventListener() {
    this._cb = () => 1;
  }
}

vi.stubGlobal("Image", Image);
vi.stubGlobal("HTMLImageElement", Image);

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

vi.stubGlobal("ImageData", ImageData);

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

  it("Extract from image", () =>
    new Promise((done) => {
      const image = new Image() as HTMLImageElement;
      extractColors(image).then((data) => {
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

  it("Extract and reduce image", () =>
    new Promise((done) => {
      const options = {
        pixels: 1,
      };
      extractColors(new Image() as HTMLImageElement, options).then((data) => {
        expect(data.list.length).toBeGreaterThan(0);
        done(undefined);
      });
    }));

  it("Extract from loadable image", () =>
    new Promise((done) => {
      const options = {
        pixels: 1,
      };
      extractColors(
        new ImageLoadable() as unknown as HTMLImageElement,
        options
      ).then((data) => {
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
