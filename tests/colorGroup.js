/**
 * @jest-environment jsdom
 */
import ColorsGroup from '../src/color/ColorsGroup'

test('Color group init', () => {
  const group = new ColorsGroup()
  expect(typeof group.children).toBe('object')
  expect(group.count).toBe(1)
})

test('Add group', () => {
  const group = new ColorsGroup()
  const group2 = group.addGroup(0xFF)
  const group2b = group.addGroup(0xFF)
  const group3 = group.addGroup(0xF1)
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

test('Get weight for empty group', () => {
  const group = new ColorsGroup()
  const group2 = group.addGroup(0xFF)
  expect(group2.getMaxWeight(0, 1)).toBe(0)
})

test('Get max count color for 1 color', () => {
  const group = new ColorsGroup()
  const group2 = group.addGroup(0xFF)
  group2.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
  group2.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
  group2.addColor(0x000000, 0x00, 0x00, 0x00)
  expect(group.getMaxCountColor(0, 2).count).toBe(2)
})

test('Add deep group', () => {
  const group = new ColorsGroup()
  const group2 = group.addGroup(0xF)
  const group3 = group2.addGroup(0xFF)
  const group4 = group3.addGroup(0xFFFF)
  group4.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
  group4.addColor(0xFFFFFF, 0xFF, 0xFF, 0xFF)
  group4.addColor(0xF7F7F7, 0xF7, 0xF7, 0xF7)
  group4.addColor(0xF9F9F9, 0xF9, 0xF9, 0xF9)
  expect(group.getMaxWeightColor(0, 4).hex).toBe(0xFFFFFF)
})

test('Add color', () => {
  const group = new ColorsGroup()
  const color1 = group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
  group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
  const color3 = group.addColor(0xFF0000, 0xFF, 0x00, 0x00)
  expect(color1.count).toBe(2)
  expect(group.getList().length).toBe(2)
  expect(color3.count).toBe(1)
  expect(group.getMaxWeight(0, 3)).toBeCloseTo(2 / 3, 5)
  expect(group.getMaxWeightColor(0, 3).hex).toBe(0xFF0077)
})
