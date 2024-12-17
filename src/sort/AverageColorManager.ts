import { FinalColor } from "../types/Color";
import { AverageColorGroup } from "./AverageColorGroup";

export class AverageColorManager {
  distance: number;
  private groups: AverageColorGroup[] = [];

  constructor(distance: number) {
    this.distance = distance;
  }

  addColor(color: FinalColor) {
    const samePalette = this.groups.find((averageColorGroup) =>
      averageColorGroup.isSamePalette(color, this.distance)
    );

    if (samePalette) {
      samePalette.addColor(color);
    } else {
      const averageHSLGroup = new AverageColorGroup();
      averageHSLGroup.addColor(color);
      this.groups.push(averageHSLGroup);
    }
  }

  getGroups() {
    return this.groups.map((averageColorGroup) => averageColorGroup.average);
  }
}
