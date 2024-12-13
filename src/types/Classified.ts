import { ColorClassification, FinalColor } from "./Color";

export type PartialClassified<Type extends ColorClassification> = {
  [type in Type]: FinalColor[];
} & {
  list: FinalColor[];
};

export type Classified<Type extends ColorClassification> = {
  [type in Type]: [FinalColor, ...FinalColor[]];
} & {
  list: FinalColor[];
};
