/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest'
import { extractColors } from '../src/extractColors.node'

describe('Node', () => {  
  it('Check by color data', () => new Promise(done => {
    
    const imageData = {
      width: 2,
      height: 2,
      data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    }
    
    return extractColors(imageData as unknown as ImageData)
      .then(data => {
        expect(data.length).toBeGreaterThan(0)
        done(undefined)
      })
  }))
    
  it('Check bad distance', () => new Promise(done => {
    const imageData = {
      width: 2,
      height: 2,
      data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    }

    const options = {
      distance: 1.1
    }

    return extractColors(imageData as unknown as ImageData, options)
      .catch((error) => {
        expect(error.message).toBe("distance is invalid (1.1)")
        done(undefined)
      })
  }))
  
  it('Use custom pixels', () => new Promise(done => {
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
        done(undefined)
      })
  }))
})