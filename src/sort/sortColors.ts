import Color from "../color/Color";
import { SorterOptions } from "../types/Options";
import { AverageManager } from "./AverageManager";

export default (
  list: Color[],
  pixels: number,
  {
    saturationDistance,
    lightnessDistance,
    hueDistance
  } : SorterOptions = {}
) => {
  const averageManager = new AverageManager({ hue: hueDistance, saturation: saturationDistance, lightness: lightnessDistance })
  list.forEach(color => averageManager.addColor(color))

  const sorted = averageManager.getGroups()

  sorted.sort((a, b) => {
    const bPower = (b.intensity + 0.1) * (0.9 - b.count / pixels)
    const aPower = (a.intensity + 0.1) * (0.9 - a.count / pixels)
    return bPower - aPower 
  })
  return sorted
} 
