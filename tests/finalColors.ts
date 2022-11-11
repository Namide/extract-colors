import { describe, it, expect } from 'vitest'
import Color from '../src/color/Color'
import { createFinalColor } from '../src/color/FinalColor'

describe('Final color', () => {
  it('create', () => {
    const red = 0xF7
    const green = 0x78
    const blue = 0x01
    const color = createFinalColor(new Color(red, green, blue), 10)
    expect(color.red).toBe(red)
    expect(color.green).toBe(green)
    expect(color.blue).toBe(blue)
    expect(color.hue).toBe(0.08062330623306234)
    expect(color.saturation).toBe(0.9919354838709677)
    expect(color.lightness).toBe(0.48627450980392156)
    expect(color.intensity).toBe(0.9647058823529412)
    expect(color.hex).toBe('#f77801')
    expect(color.area).toBe(0.1)
  })
})
