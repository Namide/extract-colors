import Color from './Color'

/**
 * Manage list of colors to optimize and merge neighbors colors.
 *
 * @export
 * @class BudGroup
 */
export default class BudGroup {

  _count: number
  _children: { [key: number]: Color }
  _maxWeight: number | undefined

  /**
   * Store colors or groups and _count similiar groups in the image.
   */
  constructor () {
    this._count = 1
    this._children = { }
  }

  /**
   * Add color to the group.
   */
  addColor (_hex: number, _red: number, _green: number, _blue: number) {
    if (this._children[_hex]) {
      this._children[_hex]._count++
    } else {
      this._children[_hex] = new Color(_red, _green, _blue, _hex)
    }

    return this._children[_hex]
  }

  /**
   * Get list of groups of list of colors.
   */
  getList () {
    return (Object.keys(this._children) as unknown[] as number[])
      .map((key) => this._children[key])
  }

  /**
   * Max color weight between the list colors, depends of his saturation and his _count.
   */
   getMaxWeight (_count: number): number {
    if (this._maxWeight === undefined) {
      const list = this.getList()
        .map((child) => child._count / _count)

      list.sort((a, b) => b - a)
      this._maxWeight = list[0] || 0
    }

    return this._maxWeight 
  }

  /**
   * Color with the the max weight between the list colors, depends of his saturation and his _count.
   */
  getMaxWeightColor (_count: number) {
    const list = this.getList()
    list.sort((a, b) => {
      return (b._count / _count) - (a._count / _count)
    })

    return list[0]
  }

  /**
   * Max _count of colors for a group of colors.
   */
  getMaxCountColor () {
    const list = this.getList()
    const biggest = list.reduce((a, b) => a._count >= b._count ? a : b)
    return biggest
  }
}
