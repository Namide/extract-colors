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
  expect(group.count).toBe(1)
  expect(group2 === group2b).toBe(true)
  expect(group2.count).toBe(2)
  expect(group2 === group3).toBe(false)
  expect(group.getList().length).toBe(2)
})

test('Add color', () => {
  const group = new ColorsGroup()
  const color1 = group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
  const color1b = group.addColor(0xFF0077, 0xFF, 0x00, 0x77)
  const color3 = group.addColor(0xFF0000, 0xFF, 0x00, 0x00)
  expect(color1.count).toBe(2)
  expect(group.getList().length).toBe(2)
  expect(color3.count).toBe(1)
})
