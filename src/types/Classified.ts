import { ColorClassification, DetailledColor } from "./Color";

export type PartialClassified<Type extends ColorClassification> = Record<Type, DetailledColor[]> & {
  list: DetailledColor[];
};

export type Classified<Type extends ColorClassification> = Record<Type, [DetailledColor, ...DetailledColor[]]> & {
  list: DetailledColor[];
};
