import RGBColor from "./RGBColor";

/**
 * Manage list of colors to optimize and merge neighbors colors.
 *
 * @export
 * @class LeafGroup
 */
export default class LeafGroup {
  count: number = 0;
  children: Record<number, RGBColor> = {};

  /**
   * Add color to the group.
   *
   * @param hex Hexadecimal color
   * @param red Red chanel amount of the color
   * @param green Green chanel amount of the color
   * @param blue Blue chanel amount of the color
   * @returns The color
   */
  addColor(hex: number, red: number, green: number, blue: number) {
    this.count++;
    if (this.children[hex]) {
      this.children[hex].count++;
    } else {
      this.children[hex] = new RGBColor(red, green, blue);
    }
    return this.children[hex];
  }

  /**
   * Get list of groups of list of colors.
   *
   * @returns List of colors
   */
  getList() {
    return (Object.keys(this.children) as unknown[] as number[]).map(
      (key) => this.children[key]
    );
  }

  /**
   * Representative color of leaf.
   *
   * @returns Main color of the leaf
   */
  createMainColor() {
    const list = this.getList();
    const biggest = list.reduce((a, b) => (a.count >= b.count ? a : b));
    const main = biggest.clone();
    main.count = this.count;
    return main;
  }
}
