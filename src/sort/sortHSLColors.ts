import HSLColor from "../color/HSLColor";
import { AverageHSLManager } from "./AverageHSLManager";

export default (
  list: HSLColor[],
  count: number,
  hueDistance: number,
  saturationDistance: number,
  lightnessDistance: number
) => {
  const averageHSLManager = new AverageHSLManager(
    hueDistance,
    saturationDistance,
    lightnessDistance
  );

  list.forEach((color) => averageHSLManager.addColor(color));

  const sorted = averageHSLManager.getGroups();
  return sorted.sort((a, b) => {
    const bPower = (b.i + 0.1) * (0.9 - b.count / count);
    const aPower = (a.i + 0.1) * (0.9 - a.count / count);
    return bPower - aPower;
  });
};
