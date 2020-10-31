import Color from './Color'

/**
 * Group colors with algorithms to optimize and merge neighbors colors.
 * 
 * @module ColorGroup
 * @memberof module:core
 */

/** 
 * @class
 * @classdesc Manage list of colors or groups.
 */
export default class ColorGroup {
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
  addGroup (key) {
    if (this.children[key]) {
      this.children[key].count++
    } else {
      this.children[key] = new ColorGroup()
    }

    return this.children[key]
  }

  /**
   * Add color to the group.
   * 
   * @param {Number} hex  Hexadecimal color from 0x000000 to 0xFFFFFF
   * @param {Number} red  Integer red chanel from 0 to 255
   * @param {Number} green  Integer green chanel from 0 to 255
   * @param {Number} blue  Integer blue chanel from 0 to 255
   */
  addColor (hex, red, green, blue) {
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
    return Object.keys(this.children)
      .map((key) => this.children[key])
  }

  /**
   * Max color weight between the children colors, depends of his saturation and his count.
   * 
   * @param {Number} saturationImportance  Determine the weight of the saturation for the calcul (from 0 to 1)
   * @param {Number} count  Number of pixels in the image.
   * @returns {Number}
   */
  getMaxWeight (saturationImportance, count) {
    if (this.maxWeight === undefined) {
      const list = this.getList()
        .map((child) => (child.isColor ? child.getWeight(saturationImportance, count) : child.getMaxWeight(saturationImportance, count)))

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
  getMaxWeightColor (saturationImportance, count) {
    const list = this.getList()
    list.sort((a, b) => {
      if (a.isColor) {
        return b.getWeight(saturationImportance, count) - a.getWeight(saturationImportance, count)
      }
      return b.getMaxWeight(saturationImportance, count) - a.getMaxWeight(saturationImportance, count)
    })

    return list[0].isColor ? list[0] : list[0].getMaxWeightColor(saturationImportance, count)
  }

  /**
   * Max count of colors for a group of colors.
   * 
   * @returns {Number}
   */
  getMaxCountColor () {
    const list = this.getList()
    list.sort((a, b) => {
      if (a.isColor) {
        return b.count - a.count
      }
      return b.getMaxCountColor() - a.getMaxCountColor()
    })

    return list[0].isColor ? list[0] : list[0].getMaxCountColor()
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
  getColors (distance, saturationImportance, count) {
    const list = this.getList()
      .map((child) => {
        const { count } = child
        const color = child.getMaxCountColor()
        color.count = count
        return color
      })

    list.sort((a, b) => b.getWeight(saturationImportance, count) - a.getWeight(saturationImportance, count))

    const newList = []
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
