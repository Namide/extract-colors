const { createCanvas, loadImage } = require('canvas')
const ColorsExtractor = require('./color/ColorsExtractor')

const getImageData = (image, pixels) => {
  const currentPixels = image.width * image.height
  const width = currentPixels < pixels ? image.width : Math.round(image.width * Math.sqrt(pixels / currentPixels))
  const height = currentPixels < pixels ? image.height : Math.round(image.height * Math.sqrt(pixels / currentPixels))

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)
  return context.getImageData(0, 0, width, height)
}

module.exports = (src, options) => {
  return loadImage(src)
    .then(image => {
      const colorsExtractor = new ColorsExtractor(options)
      const data = getImageData(image, colorsExtractor.pixels).data
      return colorsExtractor.extract(data)
    })
}
