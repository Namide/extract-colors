export interface ImageDataAlt {
  data: Uint8ClampedArray | number[];
  width?: number;
  height?: number;
}

export interface SorterOptions {
  saturationDistance?: number;
  lightnessDistance?: number;
  hueDistance?: number;
}

export interface ExtractorOptions {
  pixels?: number;
  distance?: number;
  colorValidator?: (
    red: number,
    green: number,
    blue: number,
    alpha: number,
  ) => boolean;
}

export type BrowserOptions = ExtractorOptions & {
  crossOrigin?: "anonymous" | "use-credentials" | "" | null;
  requestMode?: RequestMode;
} & SorterOptions;

export type NodeOptions = ExtractorOptions & SorterOptions;

export type OptionsCleaned = [
  number,
  number,
  (red: number, green: number, blue: number, alpha: number) => boolean,
  number,
  number,
  number,
  "" | "anonymous" | "use-credentials" | null,
  RequestMode,
];
