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

  /**
   * Store colors or groups and _count similiar groups in the image.
   */
  constructor () {
    this._count = 0
    this._children = { }
  }

  /**
   * Get list of groups of list of colors.
   */
  getList () {
    return (Object.keys(this._children) as unknown[] as number[])
      .map((key) => this._children[key])
  }

  addColor(r: number, g: number, b: number) {
    const full = r << 16 | g << 8 | b
    const loss = (r >> 4 & 0xF) << 8 | (g >> 4 & 0xF) << 4 | (b >> 4 & 0xF)
    this._count++
    return this.getLeafGroup(loss).addColor(full, r, g, b)
  }

  /**
   * Add a key for a color, this key is a simplification to find neighboring colors.
   * Neighboring colors has same key.
   */
  getLeafGroup (key: number) {
    if (!this._children[key]) {
      this._children[key] = new LeafGroup()
    }
    return this._children[key] as LeafGroup
  }

  /**
   * List of colors sorted by importance (neighboring hare calculated by distance and removed).
   * Importance is calculated with the saturation and _count of neighboring colors.
   */
  getColors (_distance: number) {
    const list = this.getList()
      .map((child) => child.createMainColor())

    list.sort((a, b) => b._count - a._count)

    const newList: Color[] = []
    while (list.length) {
      const current = list.shift() as Color
      list
        .filter((color) => Color.distance(current, color) < _distance)
        .forEach(near => {
          current._count += near._count
          const i = list.findIndex(color => color === near) 
          list.splice(i, 1)
        })
      
      newList.push(current)
    }

    return newList
  }
}
