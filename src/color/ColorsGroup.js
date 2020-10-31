import Color from './Color'

export default class ColorGroup {
  constructor () {
    this.count = 1
    this.children = { }
  }

  addGroup (key) {
    if (this.children[key]) {
      this.children[key].count++
    } else {
      this.children[key] = new ColorGroup()
    }

    return this.children[key]
  }

  addColor (hex, red, green, blue) {
    if (this.children[hex]) {
      this.children[hex].count++
    } else {
      this.children[hex] = new Color(red, green, blue, hex)
    }

    return this.children[hex]
  }

  getList () {
    return Object.keys(this.children)
      .map((key) => this.children[key])
  }

  getMaxWeight (saturationImportance, count) {
    if (this.maxWeight === undefined) {
      const list = this.getList()
        .map((child) => (child.isColor ? child.getWeight(saturationImportance, count) : child.getMaxWeight(saturationImportance, count)))

      list.sort((a, b) => b - a)
      this.maxWeight = list[0] || 0
    }

    return this.maxWeight
  }

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
