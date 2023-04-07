import Color from './Color'
import LeafGroup from './LeafGroup'

/**
 * RootGroup colors with algorithms to optimize and merge neighbors colors.
 * 
 * @class
 * @classdesc Manage list of colors or groups.
 */
export default class RootGroup {
  _count: number
  _children: { [key: number]: LeafGroup }
  _maxWeight: number | undefined

  /**
   * Store colors or groups and _count similiar groups in the image.
   */
  constructor () {
    this._count = 1
    this._children = { }
  }

  /**
   * Get list of groups of list of colors.
   */
  getList () {
    return (Object.keys(this._children) as unknown[] as number[])
      .map((key) => this._children[key])
  }

  /**
   * Add a key for a color, this key is a simplification to find neighboring colors.
   * Neighboring colors has same key.
   */
   addLeafGroup (key: number) {
    if (this._children[key]) {
      this._children[key]._count++
    } else {
      this._children[key] = new LeafGroup()
    }

    return this._children[key] as LeafGroup
  }

  /**
   * List of colors sorted by importance (neighboring hare calculated by distance and removed).
   * Importance is calculated with the saturation and _count of neighboring colors.
   */
  getColors (_distance: number, _count: number) {
    const list = this.getList()
      .map((child) => {
        const { _count } = child
        const color = child.getMaxCountColor()
        color._count = _count
        return color
      })

    list.sort((a, b) => (b._count / _count) - (a._count / _count))

    const newList: Color[] = []
    list.forEach((color) => {
      const near = newList.find((col) => Color.distance(col, color) < _distance)
      if (!near) {
        newList.push(color)
      } else {
        near._count += color._count
      }
    })

    return newList
  }
}
