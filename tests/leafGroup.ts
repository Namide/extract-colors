import { describe, it, expect } from 'vitest'

import LeafGroup from '../src/color/LeafGroup'

describe('LeafGroup', () => {
  it('Init', () => {
    const group = new LeafGroup()
    expect(typeof group._children).toBe('object')
    expect(group._count).toBe(0)
  })
  
  it('Group colors', () => {
    const group = new LeafGroup()
    group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
    group.addColor(0x777777, 0x77, 0x77, 0x77)
    group.addColor(0x777777, 0x77, 0x77, 0x77)
    expect(group.getList().length).toBe(2)
    expect(group._count).toBe(3)
    // expect(group.getMaxWeightColor()._hex).toBe(0x777777)
  })
    
  it('Get max _count color for 1 color', () => {
    const group = new LeafGroup()
    group.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group.addColor(0x000000, 0x00, 0x00, 0x00)
    // expect(group.getMaxCountColor()._count).toBe(2)
    // expect(group.getMaxCountColor()._hex).toBe(0xFFFFFF)
  })
  
  it('Add color', () => {
    const group = new LeafGroup()
    const color1 = group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
    group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
    const color3 = group.addColor(0xFF0000, 0xFF, 0x00, 0x00)
    expect(color1._count).toBe(2)
    expect(group.getList().length).toBe(2)
    expect(color3._count).toBe(1)
    // expect(group.getMaxWeight()).toBeCloseTo(2 / 3, 5)
    // expect(group.getMaxWeightColor()._hex).toBe(0xFF0077)
  })
  
  it('Max weight', () => {
    const group = new LeafGroup()
    group.addColor(0x0000FF, 0x00, 0x00, 0x77)
    group.addColor(0x0000FF, 0x00, 0x00, 0x77)
    group.addColor(0xFF0000, 0xFF, 0x00, 0x00)
    // expect(group.getMaxWeight()).toBe(2/3)
    // expect(group.getMaxWeight()).toBe(2/3)
  })
})
