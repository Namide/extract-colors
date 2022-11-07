import { describe, it, expect } from 'vitest'
import RootGroup from '../src/color/RootGroup'

describe('RootGroup', () => {
  it('Color group init', () => {
    const group = new RootGroup()
    expect(typeof group.children).toBe('object')
    expect(group.count).toBe(1)
  })
  
  it('Add group', () => {
    const group = new RootGroup()
    const group2 = group.addBudGroup(0xFF)
    const group2b = group.addBudGroup(0xFF)
    const group3 = group.addBudGroup(0xF1)
    group2.addColor(0xFF0077, 0xFF, 0x00, 0x77)
    group2b.addColor(0x777777, 0x77, 0x77, 0x77)
    group3.addColor(0x777777, 0x77, 0x77, 0x77)
    expect(group.count).toBe(1)
    expect(group2 === group2b).toBe(true)
    expect(group2.count).toBe(2)
    expect(group2 === group3).toBe(false)
    expect(group.getList().length).toBe(2)
    expect(group.getMaxWeightColor(1, 3).hex).toBe(0xFF0077)
  })
  
  it('Get weight for empty group', () => {
    const group = new RootGroup()
    const group2 = group.addRootGroup(0xFF)
    expect(group2.getMaxWeight(0, 1)).toBe(0)
  })
  
  it('Get max count color for 1 color', () => {
    const group = new RootGroup()
    const group2 = group.addBudGroup(0xFF)
    group2.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group2.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group2.addColor(0x000000, 0x00, 0x00, 0x00)
    expect(group.getMaxCountColor().count).toBe(2)
  })
  
  it('Add deep group', () => {
    const group = new RootGroup()
    const group2 = group.addRootGroup(0xF)
    const group3 = group2.addRootGroup(0xFF)
    const group4 = group3.addBudGroup(0xFFFF)
    group4.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group4.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group4.addColor(0xF7F7F7, 0xF7, 0xF7, 0xF7)
    group4.addColor(0xF9F9F9, 0xF9, 0xF9, 0xF9)
    expect(group.getMaxWeightColor(0, 4).hex).toBe(0xFFFFFF)
  })
})