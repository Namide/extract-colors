import { describe, it, expect } from 'vitest'
import Color from '../src/color/Color'
import { AverageGroup } from '../src/sort/AverageGroup'

describe('Average group', () => {
  it('Near average', () => {
    const av = new AverageGroup()
    av.addColor(new Color(0xFF, 0xFF, 0xFF))
    av.addColor(new Color(0xFD, 0xFD, 0xFD))
    expect(av.average._red).toBe(0xFE)
    expect(av.average._green).toBe(0xFE)
    expect(av.average._blue).toBe(0xFE)
  })

  it('Extreme average', () => {
    const av = new AverageGroup()
    av.addColor(new Color(0xFF, 0xFF, 0xFF))
    av.addColor(new Color(0x00, 0x00, 0x00))
    expect(av.average._red).toBe(0x80)
    expect(av.average._green).toBe(0x80)
    expect(av.average._blue).toBe(0x80)
  })

  it('Extreme 3 average', () => {
    const av = new AverageGroup()
    av.addColor(new Color(0xFF, 0xFF, 0xFF))
    av.addColor(new Color(0x80, 0x80, 0x80))
    av.addColor(new Color(0x00, 0x00, 0x00))
    expect(av.average._red).toBe(0x80)
    expect(av.average._green).toBe(0x80)
    expect(av.average._blue).toBe(0x80)
  })

  it('Same palette', () => {
    const av = new AverageGroup()
    av.addColor(new Color(0xFF, 0xFF, 0xFF))
    expect(av.isSamePalette(new Color(0xF0, 0xF0, 0xF0), 0.1, 0.1, 0.1)).toBeTruthy()
  })

  it('Not same palette', () => {
    const av = new AverageGroup()
    av.addColor(new Color(0x70, 0x70, 0x70))
    expect(av.isSamePalette(new Color(0xF0, 0xF0, 0xF0), 0.1, 0.1, 0.1)).toBeFalsy()
  })
})
