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
      .map(key => this.children[key])
  }

  getMaxWeight (saturationImportance) {
    if (this.maxWeight === undefined) {
      const list = this.getList()
        .map(child => child.isColor ? child.getWeight(saturationImportance) : child.getMaxWeight(saturationImportance))

      list.sort((a, b) => b - a)
      this.maxWeight = list[0] || 0
    }

    return this.maxWeight
  }

  getMaxWeightColor (saturationImportance) {
    const list = this.getList()
    list.sort((a, b) => {
      if (a.isColor) {
        return b.getWeight(saturationImportance) - a.getWeight(saturationImportance)
      }
      return b.getMaxWeight(saturationImportance) - a.getMaxWeight(saturationImportance)
    })

    return list[0].isColor ? list[0] : list[0].getMaxWeightColor(saturationImportance)
  }

  getColors (distance, saturationImportance) {
    const list = this.getList()
      .map(child => {
        const count = child.count
        const color = child.getMaxWeightColor(saturationImportance)
        color.count = count
        return color
      })

    list.sort((a, b) => b.getWeight(saturationImportance) - a.getWeight(saturationImportance))

    const newList = []
    list.forEach(color => {
      const near = newList.find(col => col.distance(color) < distance)
      if (!near) {
        newList.push(color)
      } else {
        near.count += color.count
      }
    })

    return newList
  }
}