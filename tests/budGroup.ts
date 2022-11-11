import { describe, it, expect } from 'vitest'

import BudGroup from '../src/color/BudGroup'

describe('BudGroup', () => {
  it('Init', () => {
    const group = new BudGroup()
    expect(typeof group.children).toBe('object')
    expect(group.count).toBe(1)
  })
  
  it('Group colors', () => {
    const group = new BudGroup()
    group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
    group.addColor(0x777777, 0x77, 0x77, 0x77)
    group.addColor(0x777777, 0x77, 0x77, 0x77)
    expect(group.getList().length).toBe(2)
    expect(group.getMaxWeightColor(3).hex).toBe(0x777777)
  })
    
  it('Get max count color for 1 color', () => {
    const group = new BudGroup()
    group.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group.addColor(0x000000, 0x00, 0x00, 0x00)
    expect(group.getMaxCountColor().count).toBe(2)
    expect(group.getMaxCountColor().hex).toBe(0xFFFFFF)
  })
  
  it('Add color', () => {
    const group = new BudGroup()
    const color1 = group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
    group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
    const color3 = group.addColor(0xFF0000, 0xFF, 0x00, 0x00)
    expect(color1.count).toBe(2)
    expect(group.getList().length).toBe(2)
    expect(color3.count).toBe(1)
    expect(group.getMaxWeight(3)).toBeCloseTo(2 / 3, 5)
    expect(group.getMaxWeightColor(3).hex).toBe(0xFF0077)
  })
  
  it('Max weight', () => {
    const group = new BudGroup()
    group.addColor(0x0000FF, 0x00, 0x00, 0x77)
    group.addColor(0x0000FF, 0x00, 0x00, 0x77)
    group.addColor(0xFF0000, 0xFF, 0x00, 0x00)
    expect(group.getMaxWeight(3)).toBe(2/3)
    expect(group.getMaxWeight(3)).toBe(2/3)
  })
})
