import { describe, it, expect } from 'vitest'
import Color from '../src/color/Color'
import { AVERAGE_DEFAULT } from '../src/extract/cleanInputs'
import sortColors from '../src/sort/sortColors'

describe('Sort color', () => {
  it('Sort by area', () => {
    const colors = sortColors([
      new Color(0xFF, 0xFF, 0xFF),
      new Color(0xFF, 0xFF, 0xFF),
      new Color(0x77, 0x77, 0x77)
    ],
    10,
    AVERAGE_DEFAULT.HUE,
    AVERAGE_DEFAULT.SATURATION,
    AVERAGE_DEFAULT.LIGHTNESS)
    
    expect(colors.length).toBe(2)
    expect(colors[0]._red).toBe(0x77)
  })

  it('Sort by saturation', () => {
    const colors = sortColors([
      new Color(0x73, 0x76, 0x72),
      new Color(0xFF, 0x00, 0x77)
    ], 10,
    AVERAGE_DEFAULT.HUE,
    AVERAGE_DEFAULT.SATURATION,
    AVERAGE_DEFAULT.LIGHTNESS)
    
    expect(colors.length).toBe(2)
    expect(colors[0]._red).toBe(0xFF)
  })
})
