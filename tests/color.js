/**
 * @jest-environment jsdom
 */

import Color from '../src/color/Color'

test('Check color init', () => {
  const red = 0xF7
  const green = 0x78
  const blue = 0x01
  const hex = 0xF77801
  const color = new Color(red, green, blue)

  expect(color.red).toBe(red)
  expect(color.green).toBe(green)
  expect(color.blue).toBe(blue)
  expect(color.hex).toBe(hex)
  expect(color.count).toBe(1)
})

test('Color distance far', () => {
  const color1 = new Color(0xFF, 0xFF, 0xFF)
  const color2 = new Color(0x00, 0x00, 0x00)
  expect(color1.distance(color2)).toBe(1)
  expect(color2.distance(color1)).toBe(1)
})

test('Color distance near', () => {
  const color1 = new Color(0xFF, 0xFF, 0xFF)
  const color2 = new Color(0xFF, 0xFF, 0xFF)
  expect(color1.distance(color2)).toBe(0)
  expect(color2.distance(color1)).toBe(0)
})

test('Color saturation 1', () => {
  const color1 = new Color(0xFF, 0x00, 0x00)
  const color2 = new Color(0xFF, 0xFF, 0x00)
  expect(color1.getSaturation()).toBe(1)
  expect(color2.getSaturation()).toBe(1)
})

test('Color saturation 0', () => {
  const color1 = new Color(0xFF, 0xFF, 0xFF)
  const color2 = new Color(0x00, 0x00, 0x00)
  const color3 = new Color(0x77, 0x77, 0x77)
  expect(color1.getSaturation()).toBe(0)
  expect(color2.getSaturation()).toBe(0)
  expect(color3.getSaturation()).toBe(0)
})
