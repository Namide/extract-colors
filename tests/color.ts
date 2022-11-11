import { describe, it, expect } from 'vitest'
import Color from '../src/color/Color'

describe('Color', () => {
  it('Color hexa from chanels', () => {
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
  
  it('Color distance far', () => {
    const color1 = new Color(0xFF, 0xFF, 0xFF)
    const color2 = new Color(0x00, 0x00, 0x00)
    expect(Color.distance(color1, color2)).toBe(1)
    expect(Color.distance(color2, color1)).toBe(1)
  })
  
  it('Color distance near', () => {
    const color1 = new Color(0xFF, 0xFF, 0xFF)
    const color2 = new Color(0xFF, 0xFF, 0xFF)
    expect(Color.distance(color1, color2)).toBe(0)
    expect(Color.distance(color2, color1)).toBe(0)
  })
})
