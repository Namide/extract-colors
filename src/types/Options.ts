import type { PartialClassified } from "./Classified";
import type { ColorClassification } from "./Color";

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export interface ImageDataAlt {
  data: Uint8ClampedArray | number[];
  width?: number;
  height?: number;
}

export interface SorterOptions {
  distance?: number;
}

export interface ExtractorOptions {
  pixels?: number;
  fastDistance?: number;
  colorValidator?: (
    red: number,
    green: number,
    blue: number,
    alpha?: number
  ) => boolean;
}

export type BrowserImageOptions = {
  crossOrigin?: "anonymous" | "use-credentials" | "";
  requestMode?: never;
};

export type WorkerImageOptions = {
  crossOrigin?: never;
  requestMode?: RequestMode;
};

export type ImageOptions = {
  pixels?: number;
};

export type OptionsCleaned<Type extends ColorClassification> = {
  pixels: number;
  fastDistance: number;
  colorValidator: (
    red: number,
    green: number,
    blue: number,
    alpha?: number
  ) => boolean;
  distance: number;
  crossOrigin: "" | "anonymous" | "use-credentials" | null;
  requestMode: RequestMode;
  colorClassifications: Type[];
  defaultColors:
    | boolean
    | PartialRecord<
        Type,
        | number
        | boolean
        | ((classifiedColorsPart: PartialClassified<Type>) => number)
      >;
  defaultMainColor: number;
};

export type RefineOptions = {
  pixels?: number;
  distance?: number;
};

export type ClassifyOptions<Type extends ColorClassification> = {
  colorClassifications?: Type[];
};

export type AddDefaultOptions<Type extends ColorClassification> = {
  defaultColors?:
    | boolean
    | PartialRecord<
        Type,
        | number
        | boolean
        | ((classifiedColorsPart: PartialClassified<Type>) => number)
      >;
  defaultMainColor?: number;
};

export type NodeOptions<Type extends ColorClassification> = SorterOptions &
  ExtractorOptions &
  ImageOptions &
  RefineOptions &
  ClassifyOptions<Type> &
  AddDefaultOptions<Type>;

export type BrowserOptions<Type extends ColorClassification> =
  NodeOptions<Type> & (BrowserImageOptions | WorkerImageOptions);
