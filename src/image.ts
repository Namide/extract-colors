import { ImageDataAlt } from "./types/Options";

/**
 * Extract ImageData from image.
 * Reduce image to a pixel count.
 * Browser only
 *
 * @param image HTML image element or Image Bitmap
 * @param options.pixels Count of maximum pixels accepted for the calculation
 * @returns Data of the reduced image
 */
async function imageToImageData(
  image: HTMLImageElement | ImageBitmap,
  pixels: number,
  createCanvas: (
    width: number,
    height: number
  ) => OffscreenCanvas | HTMLCanvasElement
) {
  const currentPixels = image.width * image.height;
  const width =
    currentPixels < pixels
      ? image.width
      : Math.round(image.width * Math.sqrt(pixels / currentPixels));
  const height =
    currentPixels < pixels
      ? image.height
      : Math.round(image.height * Math.sqrt(pixels / currentPixels));

  const canvas = createCanvas(width, height);

  const context = canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D;
  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    width,
    height
  );

  return context.getImageData(0, 0, width, height);
}

// Web Worker version
export async function srcFetchImageData(
  src: string,
  pixels: number,
  requestMode: RequestMode
): Promise<ImageDataAlt> {
  const response = await fetch(src, { mode: requestMode });
  const blob = await response.blob();

  const bitmap = await createImageBitmap(blob);
  const imageData = await imageToImageData(
    bitmap,
    pixels,
    (width, height) => new OffscreenCanvas(width, height)
  );
  bitmap.close();

  return imageData;
}

// Browser version
export async function srcLoadImageData(
  src: string,
  pixels: number,
  crossOrigin: "anonymous" | "use-credentials" | "" | null
): Promise<ImageDataAlt> {
  const image = new Image();
  image.src = src;
  image.crossOrigin = crossOrigin;
  return await loadImageToImageData(image, pixels, crossOrigin);
}

export async function loadImageToImageData(
  image: HTMLImageElement,
  pixels: number,
  crossOrigin: "" | "anonymous" | "use-credentials" | null
): Promise<ImageDataAlt> {
  image.crossOrigin = crossOrigin;

  if (image.complete) {
    return await imageToImageData(image, pixels, createCanvas);
  }

  return await new Promise((resolve: (value: ImageData) => void) => {
    const imageLoaded = async () => {
      image.removeEventListener("load", imageLoaded);
      const imageData = await imageToImageData(image, pixels, createCanvas);
      resolve(imageData);
    };
    image.addEventListener("load", imageLoaded);
  });
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
