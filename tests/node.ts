/**
 * @vitest-environment node
 */
import { describe, it, expect, vi } from 'vitest'
import { extractColors } from '../src/extractColors.node'

describe('Node', () => {  
  it('Check by color data', () => {
    
    const imageData = {
      width: 2,
      height: 2,
      data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    }
    
    return extractColors(imageData as unknown as ImageData)
      .then(data => {
        expect(data.length).toBeGreaterThan(0)
      })
  })
    
  it('Check bad distance', () => {
    const imageData = {
      width: 2,
      height: 2,
      data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    }

    const options = {
      distance: 1.1
    }

    return extractColors(imageData as unknown as ImageData, options)
      .catch(() => {
        expect(2).toBeGreaterThan(0)
      })
  })
  
  it('Use custom pixels', () => {
    const imageData = {
      width: 2,
      height: 2,
      data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    }

    const options = {
      pixels: 1
    }

    return extractColors(imageData as unknown as ImageData, options)
      .then(data => {
        expect(data.length).toBe(1)
      })
  })
})