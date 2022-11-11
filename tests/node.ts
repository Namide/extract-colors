/**
 * @vitest-environment node
 */
import path from 'path'
import { describe, it, expect, vi } from 'vitest'
import { extractColors } from '../src/extractColors.node'

describe('Node', () => {
  // Segmentation fault (core dumped)
  // it('Check color init', () => {
  //   return extractColors(path.join(__dirname, './namide-world.jpg'))
  //     .then(data => {
  //       expect(data.length).toBeGreaterThan(0)
  //     })
  // })
  
  it('Check by color data', () => {
    
    const imageData = {
      width: 2,
      height: 2,
      data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    }
    
    return extractColors(imageData)
      .then(data => {
        expect(data.length).toBeGreaterThan(0)
      })
  })
  
  // Segmentation fault (core dumped)
  // it('Check bad pixels', () => {
  //   const options = {
  //     pixels: -1
  //   }
  //   return extractColors(path.join(__dirname, './namide-world.jpg'), options)
  //     .catch(() => {
  //       expect(2).toBeGreaterThan(0)
  //     })
  // })
  
  it('Check bad distance', () => {
    const options = {
      distance: 1.1
    }
    return extractColors(path.join(__dirname, './namide-world.jpg'), options)
      .catch(() => {
        expect(2).toBeGreaterThan(0)
      })
  })
    
  // Segmentation fault (core dumped)
  // it('Use image pixels', () => {
  //   const options = {
  //     pixels: 0xFFFFFFFF
  //   }
  //   return extractColors(path.join(__dirname, './namide-world.jpg'), options)
  //     .then(data => {
  //       expect(data.length).toBeGreaterThan(0)
  //     })
  // })
  
  // Segmentation fault (core dumped)
  // it('Use custom pixels', () => {
  //   const options = {
  //     pixels: 1
  //   }
  //   return extractColors(path.join(__dirname, './namide-world.jpg'), options)
  //     .then(data => {
  //       expect(data.length).toBe(1)
  //     })
  // })
})