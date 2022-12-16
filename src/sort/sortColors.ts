import Color from "../color/Color";
import { AverageManager } from "./AverageManager";

export default (
  list: Color[],
  _pixels: number,
  _hueDistance: number,
  _saturationDistance: number,
  _lightnessDistance: number,
) => {
  const averageManager = new AverageManager(_hueDistance, _saturationDistance, _lightnessDistance)
  list.forEach(color => averageManager.addColor(color))

  const sorted = averageManager.getGroups()

  sorted.sort((a, b) => {
    const bPower = (b._intensity + 0.1) * (0.9 - b._count / _pixels)
    const aPower = (a._intensity + 0.1) * (0.9 - a._count / _pixels)
    return bPower - aPower 
  })
  return sorted
} 
