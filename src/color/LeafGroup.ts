import Color from './Color'

/**
 * Manage list of colors to optimize and merge neighbors colors.
 *
 * @export
 * @class LeafGroup
 */
export default class LeafGroup {

  _count: number
  _children: { [key: number]: Color }

  /**
   * Store colors or groups and _count similiar groups in the image.
   */
  constructor () {
    this._count = 0
    this._children = { }
  }

  /**
   * Add color to the group.
   */
  addColor (_hex: number, _red: number, _green: number, _blue: number) {
    this._count++
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
   * Representative color of leaf.
   */
  createMainColor () {
    const list = this.getList()
    const biggest = list.reduce((a, b) => a._count >= b._count ? a : b)
    const main = biggest.clone()
    main._count = this._count
    return main
  }
}
