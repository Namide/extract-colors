export type Options = {
  pixels?: number;
  distance?: number;
  splitPower?: number;
  colorValidator?: (red: number, green: number, blue: number, alpha: number) => boolean;
}

export type BrowserOptions = Options & {
  crossOrigin?: "anonymous" | "use-credentials" | "";
}