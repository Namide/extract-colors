import { ColorClassification, DetailledColor } from "./Color";

export type PartialClassified<Type extends ColorClassification> = {
  [type in Type]: DetailledColor[];
} & {
  list: DetailledColor[];
};

export type Classified<Type extends ColorClassification> = {
  [type in Type]: [DetailledColor, ...DetailledColor[]];
} & {
  list: DetailledColor[];
};
