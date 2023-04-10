import { describe, it, expect } from 'vitest'
import RootGroup from '../src/color/RootGroup'

describe('RootGroup', () => {
  it('Color group init', () => {
    const group = new RootGroup()
    expect(typeof group._children).toBe('object')
    expect(group._count).toBe(0)
  })
  
  it('Add group', () => {
    const group = new RootGroup()
    group.addColor(0xFF, 0x00, 0x77)
    group.addColor(0x77, 0x77, 0x77)
    group.addColor(0x77, 0x77, 0x77)
    expect(group._count).toBe(3)
    expect(group.getList().length).toBe(2)
    expect(group.getColors(0)[0]._hex).toBe(0x777777)
  })
    
  it('Get max _count color for 1 color', () => {
    const group = new RootGroup()
    group.addColor(0xFF, 0xFF, 0xFF)
    group.addColor(0xFF, 0xFF, 0xFF)
    group.addColor(0x00, 0x00, 0x00)
    expect(group.getColors(0).length).toBe(2)
    expect(group._count).toBe(3)
    expect(group.getColors(0).reduce((total, color) => total + color._count, 0)).toBe(3)
    expect(group.getColors(0).length).toBe(2)
  })
  
  it('Add deep group', () => {
    const group = new RootGroup()
    const group4 = group.getLeafGroup(0xFFFF)
    group4.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group4.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
    group4.addColor(0xF7F7F7, 0xF7, 0xF7, 0xF7)
    group4.addColor(0xF9F9F9, 0xF9, 0xF9, 0xF9)
    expect(group.getColors(0)[0]._hex).toBe(0xFFFFFF)
  })
})