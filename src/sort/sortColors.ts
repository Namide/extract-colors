import { createFinalColor } from "../color/FinalColor";
import { FinalColor } from "../types/Color";
import { AverageColorManager } from "./AverageColorManager";

export default (list: FinalColor[], count: number, distance: number) => {
  const averageHSLManager = new AverageColorManager(distance);
  list.forEach((color) => averageHSLManager.addColor(color));
  return averageHSLManager
    .getGroups()
    .map((rgb) => createFinalColor(rgb, rgb.count))
    .sort((a, b) => {
      const bPower = (b.hsl[1] + 0.1) * (0.9 - b.count / count);
      const aPower = (a.hsl[1] + 0.1) * (0.9 - a.count / count);
      return bPower - aPower;
    });
};
