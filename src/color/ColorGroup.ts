import Color from './Color'

/**
 * GroupGroup colors with algorithms to optimize and merge neighbors colors.
 *
 * @module ColorGroup
 * @memberof module:core
 */

/**
 * @class
 * @classdesc Manage list of colors or groups.
 */
export default class ColorGroup {

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
   *
   * @param {Number} hex  Hexadecimal color from 0x000000 to 0xFFFFFF
   * @param {Number} red  Integer red chanel from 0 to 255
   * @param {Number} green  Integer green chanel from 0 to 255
   * @param {Number} blue  Integer blue chanel from 0 to 255
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
   *
   * @param {Number} saturationImportance  Determine the weight of the saturation for the calcul (from 0 to 1)
   * @param {Number} count  Number of pixels in the image.
   * @returns {Number}
   */
   getMaxWeight (saturationImportance: number, count: number): number {
    if (this.maxWeight === undefined) {
      const list = this.getList()
        .map((child) =>
          child.getWeight(saturationImportance, count)
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
   * @returns {Number}
   */
  getMaxWeightColor (saturationImportance: number, count: number) {
    const list = this.getList()
    list.sort((a, b) => {
      return b.getWeight(saturationImportance, count) - a.getWeight(saturationImportance, count)
    })

    return list[0]
  }

  /**
   * Max count of colors for a group of colors.
   *
   * @returns {Number}
   */
  getMaxCountColor () {
    const list = this.getList()
    const biggest = list.reduce((a, b) => a.count >= b.count ? a : b)
    return biggest
  }
}
