import { describe, it, expect } from 'vitest'
import Color from '../src/color/Color'
import { AverageManager } from '../src/sort/AverageManager'

describe('Average group', () => {
  it('Differents groups', () => {
    const avm = new AverageManager()
    avm.addColor(new Color(0xFF, 0xFF, 0xFF))
    avm.addColor(new Color(0x00, 0x00, 0x00))
    avm.addColor(new Color(0x77, 0x77, 0x77))
    
    expect(avm.getGroups().length).toBe(3)
  })

  it('Similar groups', () => {
    const avm = new AverageManager()
    avm.addColor(new Color(0xFF, 0xFF, 0xFF))
    avm.addColor(new Color(0xEE, 0xEE, 0xEE))
    avm.addColor(new Color(0x77, 0x77, 0x77))
    
    expect(avm.getGroups().length).toBe(2)
  })
})
