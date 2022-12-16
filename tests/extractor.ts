import { describe, it, expect } from 'vitest'
import cleanInputs from '../src/extract/cleanInputs'
import extractor from '../src/extract/extractor'
import { ExtractorOptions } from '../src/types/Options'

const imageData4 = {
  width: 2,
  height: 2,
  data: [
    0xFF, 0xFF, 0x00, 0xFF,
    0x00, 0x00, 0xFF, 0xFF,
    0x00, 0x00, 0x00, 0xFF,
    0xFF, 0xFF, 0xFF, 0xFF
  ]
}

const throwTest = async (testName: string, options: ExtractorOptions, errorMessage: string) => {
  it(testName, () => new Promise(done => {
    return new Promise((resolve, reject) => {
        try {
          const [pixels, distance, splitPower, colorValidator] = cleanInputs(options)
          const out = extractor(imageData4, pixels, distance, splitPower, colorValidator)
          resolve(out)
        } catch (error) {
          reject(error)
        }
      })
      .catch((error) => {
        expect(error.message).toBe(errorMessage)
        done(undefined)
      })
  }))
}

describe('Color', () => {
  it('Reducer by 4', () => {

    const imageData = {
      width: 2,
      height: 2,
      data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    }

    const [pixels, distance, splitPower, colorValidator] = cleanInputs({ pixels: 1 })
    expect(extractor(imageData, pixels, distance, splitPower, colorValidator).length).toBe(1)
  })

  it('No reducer', () => {
    const [pixels, distance, splitPower, colorValidator] = cleanInputs({ pixels: 4 })
    expect(extractor(imageData4, pixels, distance, splitPower, colorValidator).length).toBe(4)
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

    const [pixels, distance, splitPower, colorValidator] = cleanInputs({ pixels: 8 })
    expect(extractor(imageData, pixels, distance, splitPower, colorValidator).length).toBe(4)
  })

  type Cb = (red: number, green: number, blue: number, alpha: number) => boolean

  throwTest('Little pixels', { pixels: -1 }, "pixels is invalid (-1)")
  throwTest('Float pixels', { pixels: 1.2 }, "pixels is invalid (1.2)")
  throwTest('Large pixels', { pixels: Number.POSITIVE_INFINITY }, "pixels is invalid (Infinity)")
  throwTest('Little splitPower', { splitPower: 1 }, "splitPower is invalid (1)")
  throwTest('Large splitPower', { splitPower: 16 }, "splitPower is invalid (16)")
  throwTest('Little distance', { distance: -0.1 }, "distance is invalid (-0.1)")
  throwTest('Large distance', { distance: 1.0001 }, "distance is invalid (1.0001)")
  throwTest('Number colorValidator', { colorValidator: 1 as unknown as Cb }, "colorValidator is invalid (1)")
  throwTest('String colorValidator', { colorValidator: "a" as unknown as Cb }, "colorValidator is invalid (a)")
})
