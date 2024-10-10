import { extractColors } from "./extractColors";

onmessage = async (message) => {
  const list = await extractColors(
    ...(message.data as Parameters<typeof extractColors>),
  );
  postMessage(list);
};
