import type { ImageDataAlt, OptionsCleaned } from "./types/Options";
import type { ColorClassification } from "./types/Color";
import { extract } from "./process/extract";
import { refine } from "./process/refine";
import {
  WorkerQueryMessageOptions,
  WorkerResponseMessageOptions,
} from "./types/Worker";
import { srcFetchImageData } from "./image";
import { classify } from "./process/classify";
import { addDefault } from "./process/addDefault";

async function extractColors<Type extends ColorClassification>(
  picture: string | ImageData | ImageDataAlt,
  inputs: OptionsCleaned<Type>
) {
  let imageData: ImageDataAlt | undefined;

  if (
    picture instanceof ImageData ||
    (picture instanceof Object && (picture as ImageDataAlt).data)
  ) {
    imageData = picture as ImageData | ImageDataAlt;
  }

  if (typeof picture === "string") {
    imageData = await srcFetchImageData(
      picture,
      inputs.pixels,
      inputs.requestMode
    );
  }

  if (imageData) {
    const { colors, count } = extract(
      imageData,
      inputs.pixels,
      inputs.distance,
      inputs.colorValidator
    );
    const hslColors = refine(
      colors,
      count,
      inputs.hueDistance,
      inputs.saturationDistance,
      inputs.lightnessDistance
    );
    const classedColors = classify(hslColors, inputs.colorClassifications);
    return addDefault(classedColors, inputs.defaultColors);
  }

  throw new Error(`Can not analyse picture`);
}

// Listend and send data to Worker Wrapper
onmessage = (
  message: MessageEvent<WorkerQueryMessageOptions<ColorClassification>>
) => {
  const {
    id,
    attributes: [picture, inputs],
  } = message.data;

  extractColors(picture, inputs)
    .then((classified) => {
      postMessage({
        id,
        classified,
      });
    })
    .catch((error) => {
      postMessage({
        id,
        error,
      });
    });
};
