/**
 * @jest-environment jsdom
 */
import extractColors, { extractColorsFromImageData } from '../src/extractColorsBrowser.js'

// Mock Image
class Image {
  constructor () {
    this.complete = true
    this.width = 2
    this.height = 2
  }
}

class ImageLoadable extends Image {
  constructor () {
    super()
    
    this.complete = false
    this._cb = () => 1

    this.addEventListener = (_, cb) => this._cb = cb
    this.removeEventListener = () => 1

    setTimeout(() => {
      this.complete = true
      this._cb()
    }, 500)
  }
}

global.Image = Image

// Mock ImageData
class ImageData {
  constructor () {
    this.data = [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF]
    this.width = 2
    this.height = 2
  }
}

global.ImageData = ImageData

// Mock createElement
global.document.createElement = () => ({
  width: 2,
  height: 2,
  getContext: () => ({
    drawImage: () => 1,
    getImageData: () => new ImageData()
  })
})

const open = jest.fn()
Object.defineProperty(window, 'open', open)

test('Extract from imageData', () => {
  const imageData = new ImageData()
  return expect(extractColorsFromImageData(imageData).length).toBeGreaterThan(0)
})

test('Extract from imageData 2', done => {
  return extractColors(new ImageData())
    .then(data => {
      expect(data.length).toBeGreaterThan(0)
      done()
    })
})

test('Extract from image', done => {
  return extractColors(new Image())
    .then(data => {
      expect(data.length).toBeGreaterThan(0)
      done()
    })
})

test('Extract from src', done => {
  return extractColors('fakesrc.jpg')
    .then(data => {
      expect(data.length).toBeGreaterThan(0)
      done()
    })
})

test('Extract and reduce image', done => {
  const options = {
    pixels: 1
  }
  return extractColors(new Image(), options)
    .then(data => {
      expect(data.length).toBeGreaterThan(0)
      done()
    })
})

test('Extract from loadable image', done => {
  const options = {
    pixels: 1
  }
  return extractColors(new ImageLoadable(), options)
    .then(data => {
      expect(data.length).toBeGreaterThan(0)
      done()
    })
})
