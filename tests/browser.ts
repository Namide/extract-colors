
import { describe, it, expect, vi } from 'vitest'
import { extractColors, extractColorsFromImageData } from '../src/extractColors'

// Mock Image
class Image {
  complete = true
  width = 2
  height = 2
}

class ImageLoadable extends Image {
  private _cb = () => 1

  constructor () {
    super()
    this.complete = false
    setTimeout(() => {
      this.complete = true
      this._cb()
    }, 10)
  }

  addEventListener(_, cb) {
    this._cb = cb
  } 

  removeEventListener() {
    this._cb = () => 1
  }
}

vi.stubGlobal('Image', Image)
vi.stubGlobal('HTMLImageElement', Image)

// Mock ImageData
class ImageData {
  colorSpace = "srgb"
  data = new Uint8ClampedArray([0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF])
  width = 2
  height = 2
}

vi.stubGlobal('ImageData', ImageData)

// Mock document
const document = {
  createElement: () => ({
    width: 2,
    height: 2,
    getContext: () => ({
      drawImage: () => 0,
      getImageData: () => new ImageData()
    })
  })
}

vi.stubGlobal('document', document)

// Mock window
const window = {}

vi.stubGlobal('window', window)


describe("Browser", () => {

  
  it('Extract from imageData', () => {
    const imageData = new ImageData()
    return expect(extractColorsFromImageData(imageData as any).length).toBeGreaterThan(0)
  })
  
  it('Extract from imageData 2', () => new Promise(done => {
    const imageData = new ImageData()
    return extractColors(imageData as any)
      .then(data => {
        expect(data.length).toBeGreaterThan(0)
        done(undefined)
      })
  }))
  
  it('Extract from image', () => new Promise(done => {
    const image = new Image()
    extractColors(image as any)
      .then(data => {
        expect(data.length).toBeGreaterThan(0)
        done(undefined)
      })
  }))
  
  it('Extract from src', () => new Promise(done => {
    extractColors('fakesrc.jpg')
      .then(data => {
        expect(data.length).toBeGreaterThan(0)
        done(undefined)
      })
  }))
  
  it('Extract and reduce image', () => new Promise(done => {
    const options = {
      pixels: 1
    }
    extractColors(new Image() as any, options)
      .then(data => {
        expect(data.length).toBeGreaterThan(0)
        done(undefined)
      })
  }))
  
  it('Extract from loadable image', () => new Promise(done => {
    const options = {
      pixels: 1
    }
    extractColors(new ImageLoadable() as any, options)
      .then(data => {
        expect(data.length).toBeGreaterThan(0)
        done(undefined)
      })
  }))
  
  it("Bad arg", () => new Promise(done => {
    return new Promise((resolve, reject) => {
        try {
          const out = extractColors(123 as unknown as string)
          resolve(out)
        } catch (error) {
          reject(error)
        }
      })
      .catch((error) => {
        expect(error.message).toBe('Can not analyse picture')
        done(undefined)
      })
  }))
})
