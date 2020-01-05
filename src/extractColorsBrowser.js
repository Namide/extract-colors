import ColorsExtractor from './color/ColorsExtractor'

const getImageData = (image, pixels) => {
  const currentPixels = image.width * image.height
  const width = currentPixels < pixels ? image.width : Math.round(image.width * Math.sqrt(pixels / currentPixels))
  const height = currentPixels < pixels ? image.height : Math.round(image.height * Math.sqrt(pixels / currentPixels))

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height)

  return context.getImageData(0, 0, width, height)
}

const extractColorsFromImageData = (imageData, options) => {
  const colorsExtractor = new ColorsExtractor(options)
  return colorsExtractor.extract(imageData.data)
}

const extractColorsFromImage = (image, options) => {
  return new Promise(resolve => {

    const extract = (image, options) => {
      const imageData = getImageData(image, ColorsExtractor.pixelsDefault)
      resolve(extractColorsFromImageData(imageData, options))
    }

    if (image.complete) {
      extract(image, options)
    } else {
      const imageLoaded = () => {
        image.removeEventListener('load', imageLoaded)
        extract(image, options)
      }

      image.addEventListener('load', imageLoaded)
    }
  })
}

const extractColorsFromSrc = (src, options) => {
  const image = new Image()
  image.src = src
  extractColorsFromImage(image, options)
}

const extractColors = (picture, options) => {
  if (picture instanceof ImageData) {
    return new Promise(resolve => {
      resolve(extractColorsFromImageData(picture, options))
    })
  } 
  
  if (picture instanceof Image) {
    return extractColorsFromImage(picture, options)
  }

  return extractColorsFromSrc(picture, options)
}

export {
  extractColorsFromImageData,
  extractColorsFromImage,
  extractColorsFromSrc
}

export default extractColors
