import { vi } from "vitest";

let seed = 654654331 % 2147483647;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// Mock ImageData
export class ImageData {
  colorSpace = "srgb";
  data = new Uint8ClampedArray([
    0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00, 0xff, 0xff, 0xff, 0x00, 0xff,
    0xff, 0x00, 0x00, 0xff,
  ]);
  width = 2;
  height = 2;
}

vi.stubGlobal("ImageData", ImageData);

const getRandomColors = (count: number) =>
  new Array(count).fill(1).map(() => Math.floor(rand() * 0xffffff));

/**
 * Fake ImageData object
 */
export const createImageData = (
  width = 2,
  height = 2,
  colors = getRandomColors(width * height)
) => {
  const imageData = new ImageData();
  imageData.width = width;
  imageData.height = height;
  imageData.data = new Uint8ClampedArray(
    colors
      .map((color) => [
        (color >> 16) & 0xff,
        (color >> 8) & 0xff,
        (color >> 0) & 0xff,
        0xff,
      ])
      .flat()
  );
  return imageData;
};

// Mock Image
export class Image {
  complete = true;
  width = 2;
  height = 2;
}

export class ImageLoadable extends Image {
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
