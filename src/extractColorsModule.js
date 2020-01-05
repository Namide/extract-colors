import ColorsExtractor from './color/ColorsExtractor'
const { createCanvas, loadImage } = require('canvas')

const getImageData = (image, pixels) => {
  const currentPixels = image.width * image.height
  const width = currentPixels < pixels ? image.width : Math.round(image.width * Math.sqrt(pixels / currentPixels))
  const height = currentPixels < pixels ? image.height : Math.round(image.height * Math.sqrt(pixels / currentPixels))

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)
  return context.getImageData(0, 0, width, height)
}

const extractColorsFromImageData = (imageData, options) => {
  const colorsExtractor = new ColorsExtractor(options)
  return colorsExtractor.extract(imageData.data)
}

const extractColorsFromSrc = (src, options) => {
  return loadImage(src)
    .then(image => {
      const colorsExtractor = new ColorsExtractor(options)
      const imageData = getImageData(image, colorsExtractor.pixels)
      return colorsExtractor.extract(imageData.data)
    })
}

const extractColors = (picture, options) => {
  if (picture.width && picture.height && picture.data && picture.data.length) {
    return new Promise(resolve => {
      resolve(extractColorsFromImageData(picture, options))
    })
  }

  return extractColorsFromSrc(picture, options)
}

module.exports = {
  extractColorsFromImageData,
  extractColorsFromSrc,
  extractColors
}
