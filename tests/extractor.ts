import { describe, it, expect, vi } from 'vitest'
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
          const [pixels, distance, colorValidator] = cleanInputs(options)
          const { colors } = extractor(imageData4, pixels, distance, colorValidator)
          resolve(colors)
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

const warns: string[] = []

vi.spyOn(global.console, 'warn').mockImplementation((message) => {
  warns.push(message)
})

const testWarn = async (testName: string, options: ExtractorOptions, errorMessage: string) => {
  it(testName, () => new Promise(done => {
    return new Promise((resolve) => {
        const [pixels, distance, colorValidator] = cleanInputs(options)
        const { colors } = extractor(imageData4, pixels, distance, colorValidator)
        resolve(colors)
      })
      .then(() => {
        expect(warns.pop()).toBe(errorMessage)
        done(undefined)
      })
  }))
}

describe('Color', () => {
  it('No width height ', () => {

    const imageData = {
      width: 0,
      height: 0,
      data: [0x00, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0x00, 0xFF]
    }

    const [pixels, distance, colorValidator] = cleanInputs({})
    expect(extractor(imageData, pixels, distance, colorValidator).colors.length).toBe(4)
  })

  it('Reducer by 4', () => {

    const imageData = {
      width: 2,
      height: 2,
      data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    }

    const [pixels, distance, colorValidator] = cleanInputs({ pixels: 1 })
    expect(extractor(imageData, pixels, distance, colorValidator).colors.length).toBe(1)
  })

  it('Alpha reducer by 3', () => {

    const imageData = {
      width: 2,
      height: 2,
      data: [0x00, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0x00, 0x00, 0x00, 0x00]
    }

    const [pixels, distance, colorValidator] = cleanInputs({
      pixels: 4,
      colorValidator: (r, g, b, a) => a > 0
    })

    expect(extractor(imageData, pixels, distance, colorValidator).colors.length).toBe(3)
  })

  it('No reducer', () => {
    const [pixels, distance, colorValidator] = cleanInputs({ pixels: 4 })
    expect(extractor(imageData4, pixels, distance, colorValidator).colors.length).toBe(4)
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

    const [pixels, distance, colorValidator] = cleanInputs({ pixels: 8 })
    expect(extractor(imageData, pixels, distance, colorValidator).colors.length).toBe(4)
  })

  type Cb = (red: number, green: number, blue: number, alpha: number) => boolean

  testWarn('Little pixels', { pixels: -1 }, "pixels can not be less than 1 (it's -1)")
  throwTest('Float pixels', { pixels: 1.2 }, "pixels is not a valid number (1.2)")
  throwTest('Large pixels', { pixels: Number.POSITIVE_INFINITY }, "pixels is not a valid number (Infinity)")
  testWarn('Little distance', { distance: -0.1 }, "distance can not be less than 0 (it's -0.1)")
  testWarn('Bad distance', { distance: 1.0001 }, "distance can not be more than 1 (it's 1.0001)")
  testWarn('Large distance', { distance: 2 }, "distance can not be more than 1 (it's 2)")
  throwTest('Number colorValidator', { colorValidator: 1 as unknown as Cb }, "colorValidator is not a function (1)")
  throwTest('String colorValidator', { colorValidator: "a" as unknown as Cb }, "colorValidator is not a function (a)")
})
