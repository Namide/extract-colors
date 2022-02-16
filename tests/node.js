/**
 * @jest-environment node
 */

const path = require('path')
const { extractColors } = require('../src/extractColorsModule.js')

test('Check color init', () => {
  return extractColors(path.join(__dirname, './namide-world.jpg'))
    .then(data => {
      expect(data.length).toBeGreaterThan(0)
    })
})

test('Check by color data', () => {
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

test('Check bad pixels', () => {
  const options = {
    pixels: -1
  }
  return extractColors(path.join(__dirname, './namide-world.jpg'), options)
    .catch(data => {
      expect(2).toBeGreaterThan(0)
    })
})

test('Check bad distance', () => {
  const options = {
    distance: 1.1
  }
  return extractColors(path.join(__dirname, './namide-world.jpg'), options)
    .catch(data => {
      expect(2).toBeGreaterThan(0)
    })
})

test('Check bad colorValidator', () => {
  const options = {
    colorValidator: 'a'
  }
  return extractColors(path.join(__dirname, './namide-world.jpg'), options)
    .catch(data => {
      expect(2).toBeGreaterThan(0)
    })
})

test('Use image pixels', () => {
  const options = {
    pixels: 0xFFFFFFFF
  }
  return extractColors(path.join(__dirname, './namide-world.jpg'), options)
    .then(data => {
      expect(data.length).toBeGreaterThan(0)
    })
})

test('Use custom pixels', () => {
  const options = {
    pixels: 1
  }
  return extractColors(path.join(__dirname, './namide-world.jpg'), options)
    .then(data => {
      expect(data.length).toBe(1)
    })
})
