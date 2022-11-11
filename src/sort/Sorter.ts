import Color from "../color/Color";
import { SorterOptions } from "../types/Options";
import { AverageManager } from "./AverageManager";

export class Sorter {
  saturation: number;
  luminosity: number;
  hue: number;
  abundance: number;
  uniqueness: number;

  constructor ({
    saturation = 0,
    luminosity = 0,
    hue = 0,
    abundance = 0,
    uniqueness = 1
  } : SorterOptions = {}) {

    this.saturation = saturation
    this.luminosity = luminosity
    this.hue = hue
    this.abundance = abundance
    this.uniqueness = uniqueness
  }

  process (list: Color[], pixels: number) {
    const averageManager = new AverageManager()
    list.forEach(color => averageManager.addColor(color))

    const sorted = averageManager.getGroups()

    sorted.sort((a, b) => {
      const bPower = (b.intensity + 0.1) * (0.9 - b.count / pixels)
      const aPower = (a.intensity + 0.1) * (0.9 - a.count / pixels)
      return bPower - aPower 
    })
    return sorted
  }
}