import type { PartialClassified } from "./Classified";
import type { ColorClassification } from "./Color";
import type { ImageDataAlt, OptionsCleaned } from "./Options";

export type WorkerQueryMessageOptions<Type extends ColorClassification> = {
  id: number;
  attributes: [string | ImageData | ImageDataAlt, OptionsCleaned<Type>];
};

export type WorkerResponseMessageOptions<Type extends ColorClassification> = {
  id: number;
  classified?: PartialClassified<Type>;
  error?: Error;
};
