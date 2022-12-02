import { describe, it, expect } from 'vitest'
import Extractor from '../src/extract/Extractor'

describe('Color', () => {
  it('Reducer by 4', () => {

    const imageData = {
      width: 2,
      height: 2,
      data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    }

    const options = {
      pixels: 1
    }

    const extractor = new Extractor(options)
    expect(extractor.process(imageData).length).toBe(1)
  })

  it('No reducer', () => {

    const imageData = {
      width: 2,
      height: 2,
      data: [
        0xFF, 0xFF, 0x00, 0xFF,
        0x00, 0x00, 0xFF, 0xFF,
        0x00, 0x00, 0x00, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF
      ]
    }

    const options = {
      pixels: 4
    }

    const extractor = new Extractor(options)
    expect(extractor.process(imageData).length).toBe(4)
  })

  it('Merge colors', () => {

    const imageData = {
      width: 2,
      height: 4,
      data: [
        0xFF, 0xFF, 0x00, 0xFF,
        0x00, 0x00, 0xFF, 0xFF,
        0x00, 0x00, 0x00, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF,
        0xFF, 0xFF, 0x00, 0xFF,
        0x00, 0x00, 0xFF, 0xFF,
        0x00, 0x00, 0x00, 0xFF,
        0xFF, 0xFF, 0xFF, 0xFF,
      ]
    }

    const options = {
      pixels: 4
    }

    const extractor = new Extractor(options)
    expect(extractor.process(imageData).length).toBe(4)
  })
})
