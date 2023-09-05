import { describe, it, expect } from 'vitest'
import Color from '../src/color/Color'

describe('Color', () => {
  it('Color hexa from chanels', () => {
    const red = 0xF7
    const green = 0x78
    const blue = 0x01
    const hex = 0xF77801
    const color = new Color(red, green, blue)
    expect(color._red).toBe(red)
    expect(color._green).toBe(green)
    expect(color._blue).toBe(blue)
    expect(color._hex).toBe(hex)
    expect(color._count).toBe(1)
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
  
  it('Get HSL', () => {
    const color1 = new Color(0xFF, 0xFF, 0xFF)
    const color2 = new Color(0x00, 0x00, 0x00)
    expect(color1._saturation).toBe(0)
    expect(color1._lightness).toBe(1)
    expect(color2._lightness).toBe(0)
  })
  
  it('Test blue color', () => {
    const color1 = new Color(0x00, 0x00, 0xFF)
    expect(color1._hue).toBe(240 / 360)
  })
})
