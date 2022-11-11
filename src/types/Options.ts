export type SorterOptions = {
  saturationDistance?: number;
  lightnessDistance?: number;
  hueDistance?: number;
}

export type ExtractorOptions = {
  pixels?: number;
  distance?: number;
  splitPower?: number;
  colorValidator?: (red: number, green: number, blue: number, alpha: number) => boolean;
}

export type BrowserOptions = ExtractorOptions & {
  crossOrigin?: "anonymous" | "use-credentials" | "";
} & SorterOptions

export type NodeOptions = ExtractorOptions & SorterOptions