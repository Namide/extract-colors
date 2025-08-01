import WorkerWrapper from "./worker?worker&inline";
import cleanInputs, { testInputs } from "./process/cleanInputs";
import type { BrowserOptions, ImageDataAlt } from "./types/Options";
import type { ColorClassification } from "./types/Color";
import type { WorkerResponseMessageOptions } from "./types/Worker";
import type { PartialClassified } from "./types/Classified";

/**
 * Extract colors from a picture with Web Worker support.
 *
 * @param picture image source or image data
 * @param options Process configuration
 * @param options.pixels Total pixel number of the resized picture for calculation
 * @param options.distance From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)
 * @param options.colorValidator Test function to enable only some colors
 * @param options.requestMode support for CORS (only for Web Workers in browser)
 *
 * @returns List of extracted colors
 */
export const extractColorsWorker = () => {
  const worker: Worker = new WorkerWrapper();

  let id = 0;
  let list: {
    callback: (data: WorkerResponseMessageOptions<ColorClassification>) => void;
    id: number;
  }[] = [];
  let listeners: {
    name: "error";
    callback: (error: Error | ErrorEvent) => void;
  }[] = [];

  worker.addEventListener(
    "message",
    (
      message: MessageEvent<WorkerResponseMessageOptions<ColorClassification>>
    ) => {
      list
        .filter(({ id }) => id === message.data.id)
        .forEach(({ callback }) => callback(message.data));

      let index = list.findIndex(({ id }) => id === message.data.id);
      while (index > -1) {
        list.splice(index, 1);
        index = list.findIndex(({ id }) => id === message.data.id);
      }
    }
  );

  worker.addEventListener("error", (error) => {
    listeners
      .filter(({ name }) => name === "error")
      .forEach(({ callback }) => callback(error));
  });

  return {
    on: (name: "error", callback: (error: Error | ErrorEvent) => void) => {
      listeners.push({ name, callback });
    },

    off: (name: "error", callback: (error: Error | ErrorEvent) => void) => {
      const index = listeners.findIndex(
        (l) => l.name === name && l.callback === callback
      );
      listeners.splice(index, 1);
    },

    terminate: () => {
      if (list.length > 0) {
        const error = new Error(
          `ExtractColors worker closed without ${list.length} process ended`
        );
        for (const { callback } of listeners.filter(
          ({ name }) => name === "error"
        )) {
          callback(error);
        }
      }

      list = [];
      listeners = [];

      worker.terminate();
    },

    extractColors: <Type extends ColorClassification>(
      picture: string | ImageData | ImageDataAlt,
      options: BrowserOptions<Type> = {}
    ) => {
      if (__DEV__) {
        testInputs(options);
      }

      if (picture instanceof HTMLImageElement) {
        if (__DEV__) {
          console.warn(
            "HTMLImageElement not enable on worker, please send 'src' or image data instead HTMLImageElement"
          );
        }

        // HTMLImageElement not enable on Worker, switch to src fallback
        picture = picture.src;
      }

      const inputs = cleanInputs(options);

      // Wrap worker inside Promise
      return new Promise<PartialClassified<Type>>((resolve, reject) => {
        const currentId = id++;
        try {
          worker.postMessage({
            id: currentId,
            attributes: [picture, inputs] as const,
          });

          list.push({
            id: currentId,
            callback: (data) => {
              if (data.error) {
                reject(data.error);
              } else if (data.classified) {
                resolve(data.classified as PartialClassified<Type>);
              }
            },
          });
        } catch (error) {
          listeners
            .filter(({ name }) => name === "error")
            .forEach(({ callback }) => callback(error as Error));
        }
      });
    },
  };
};
