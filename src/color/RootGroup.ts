import Color from './Color'
import BudGroup from './BudGroup'

/**
 * RootGroup colors with algorithms to optimize and merge neighbors colors.
 *
 * @module RootGroup
 * @memberof module:core
 */

/**
 * @class
 * @classdesc Manage list of colors or groups.
 */
export default class RootGroup {

  isColor = false
  count: number
  children: { [key: number]: RootGroup | BudGroup }
  maxWeight: number | undefined

  /**
   * Store colors or groups and count similiar groups in the image.
   */
  constructor () {
    this.count = 1
    this.children = { }
  }

  /**
   * Add a key for a color, this key is a simplification to find neighboring colors.
   * Neighboring colors has same key.
   *
   * @param {Number} key  Simplication of color
   */
  addRootGroup (key: number) {
    if (this.children[key]) {
      this.children[key].count++
    } else {
      this.children[key] = new RootGroup()
    }

    return this.children[key] as RootGroup
  }

  /**
   * Get list of groups of list of colors.
   */
  getList () {
    return (Object.keys(this.children) as unknown[] as number[])
      .map((key) => this.children[key])
  }

  /**
   * Add a key for a color, this key is a simplification to find neighboring colors.
   * Neighboring colors has same key.
   *
   * @param {Number} key  Simplication of color
   */
   addBudGroup (key: number) {
    if (this.children[key]) {
      this.children[key].count++
    } else {
      this.children[key] = new BudGroup()
    }

    return this.children[key] as BudGroup
  }

  /**
   * Max color weight between the children colors, depends of his saturation and his count.
   *
   * @param {Number} saturationImportance  Determine the weight of the saturation for the calcul (from 0 to 1)
   * @param {Number} count  Number of pixels in the image.
   * @returns {Number}
   */
  getMaxWeight (saturationImportance: number, count: number): number {
    if (this.maxWeight === undefined) {
      const list = this.getList()
        .map((child) =>
          child.getMaxWeight(saturationImportance, count)
        )

      list.sort((a, b) => b - a)
      this.maxWeight = list[0] || 0
    }

    return this.maxWeight 
  }

  /**
   * Color with the the max weight between the children colors, depends of his saturation and his count.
   *
   * @param {Number} saturationImportance  Determine the weight of the saturation for the calcul (from 0 to 1)
   * @param {Number} count  Number of pixels in the image.
   * @returns {Color}
   */
  getMaxWeightColor (saturationImportance: number, count: number): Color {
    const list = this.getList()
    list.sort((a, b) => {
      return b.getMaxWeight(saturationImportance, count) - a.getMaxWeight(saturationImportance, count)
    })

    return list[0].getMaxWeightColor(saturationImportance, count)
  }

  /**
   * Max count of colors for a group of colors.
   *
   * @returns {Color}
   */
  getMaxCountColor (): Color {
    const list = this.getList()
    const biggest = list.reduce((a, b) => a.getMaxCountColor().count >= b.getMaxCountColor().count ? a : b)
    return biggest.getMaxCountColor()
  }

  /**
   * List of colors sorted by importance (neighboring hare calculated by distance and removed).
   * Importance is calculated with the saturation and count of neighboring colors.
   *
   * @param {Number} distance  Minimum distance between colors (from 0 to 1)
   * @param {Number} saturationImportance  Determine the weight of the saturation for the calcul (from 0 to 1)
   * @param {Number} count  Total pixels of image
   * @returns {Array<Color>}
   */
  getColors (distance: number, saturationImportance: number, count: number) {
    const list = this.getList()
      .map((child) => {
        const { count } = child
        const color = child.getMaxCountColor()
        color.count = count
        return color
      })

    list.sort((a, b) => b.getWeight(saturationImportance, count) - a.getWeight(saturationImportance, count))

    const newList: Color[] = []
    list.forEach((color) => {
      const near = newList.find((col) => col.distance(color) < distance)
      if (!near) {
        newList.push(color)
      } else {
        near.count += color.count
      }
    })

    return newList
  }
}
