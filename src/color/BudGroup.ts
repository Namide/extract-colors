import Color from './Color'

/**
 * Manage list of colors to optimize and merge neighbors colors.
 *
 * @export
 * @class BudGroup
 */
export default class BudGroup {

  count: number
  children: { [key: number]: Color }
  maxWeight: number | undefined

  /**
   * Store colors or groups and count similiar groups in the image.
   */
  constructor () {
    this.count = 1
    this.children = { }
  }

  /**
   * Add color to the group.
   */
  addColor (hex: number, red: number, green: number, blue: number) {
    if (this.children[hex]) {
      this.children[hex].count++
    } else {
      this.children[hex] = new Color(red, green, blue, hex)
    }

    return this.children[hex]
  }

  /**
   * Get list of groups of list of colors.
   */
  getList () {
    return (Object.keys(this.children) as unknown[] as number[])
      .map((key) => this.children[key])
  }

  /**
   * Max color weight between the children colors, depends of his saturation and his count.
   */
   getMaxWeight (count: number): number {
    if (this.maxWeight === undefined) {
      const list = this.getList()
        .map((child) => child.count / count)

      list.sort((a, b) => b - a)
      this.maxWeight = list[0] || 0
    }

    return this.maxWeight 
  }

  /**
   * Color with the the max weight between the children colors, depends of his saturation and his count.
   */
  getMaxWeightColor (count: number) {
    const list = this.getList()
    list.sort((a, b) => {
      return (b.count / count) - (a.count / count)
    })

    return list[0]
  }

  /**
   * Max count of colors for a group of colors.
   */
  getMaxCountColor () {
    const list = this.getList()
    const biggest = list.reduce((a, b) => a.count >= b.count ? a : b)
    return biggest
  }
}
