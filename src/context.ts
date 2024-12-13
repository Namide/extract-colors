/**
 * Browser context detection
 *
 * @returns Is a browser context
 */
export const checkIsBrowser = () =>
  typeof window !== "undefined" && typeof window.document !== "undefined";

/**
 * Worker in Browser context detection
 *
 * @returns Is a worker browser context
 */
export const checkIsWorker = () =>
  typeof self === "object" &&
  self.constructor &&
  self.constructor.name === "DedicatedWorkerGlobalScope";

/**
 * Node.js context detection
 *
 * @returns Is Node.js context
 */
export const checkIsNode = () =>
  typeof window === "undefined" &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  typeof process !== "undefined" &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.versions != null &&
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  process.versions.node != null;
