import { rgbColorToDetailledColor } from "../color/DetailledColor";
import { DetailledColor } from "../types/Color";
import { AverageColorManager } from "./AverageColorManager";

export default (list: DetailledColor[], count: number, distance: number) => {
  const averageHSLManager = new AverageColorManager(distance);
  list.forEach((color) => averageHSLManager.addColor(color));
  return averageHSLManager
    .getGroups()
    .map((rgb) => rgbColorToDetailledColor(rgb, count))
    .sort((a, b) => {
      const bPower = (b.hsl[1] + 0.1) * (0.9 - b.area);
      const aPower = (a.hsl[1] + 0.1) * (0.9 - a.area);
      return bPower - aPower;
    });
};
