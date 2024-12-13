import RGBColor from "./RGBColor";
import LeafGroup from "./LeafGroup";

/**
 * RootGroup colors with algorithms to optimize and merge neighbors colors.
 *
 * @class
 * @classdesc Manage list of colors or groups.
 */
export default class RootGroup {
  count: number = 0;
  children: Record<number, LeafGroup> = {};

  /**
   * Get list of groups of list of colors.
   */
  getList() {
    return (Object.keys(this.children) as unknown[] as number[]).map(
      (key) => this.children[key]
    );
  }

  addColor(r: number, g: number, b: number) {
    const full = (r << 16) | (g << 8) | b;
    const loss =
      (((r >> 4) & 0xf) << 8) | (((g >> 4) & 0xf) << 4) | ((b >> 4) & 0xf);
    this.count++;
    return this.getLeafGroup(loss).addColor(full, r, g, b);
  }

  /**
   * Add a key for a color, this key is a simplification to find neighboring colors.
   * Neighboring colors has same key.
   */
  getLeafGroup(key: number) {
    if (!this.children[key]) {
      this.children[key] = new LeafGroup();
    }
    return this.children[key] as LeafGroup;
  }

  /**
   * List of colors sorted by importance (neighboring hare calculated by distance and removed).
   * Importance is calculated with the saturation and count of neighboring colors.
   */
  getColors(_distance: number) {
    const list = this.getList().map((child) => child.createMainColor());

    list.sort((a, b) => b.count - a.count);

    const newList: RGBColor[] = [];
    while (list.length) {
      const current = list.shift() as RGBColor;
      list
        .filter((color) => RGBColor.distance(current, color) < _distance)
        .forEach((near) => {
          current.count += near.count;
          const i = list.findIndex((color) => color === near);
          list.splice(i, 1);
        });

      newList.push(current);
    }

    return newList;
  }
}
