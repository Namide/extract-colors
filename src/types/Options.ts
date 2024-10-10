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
