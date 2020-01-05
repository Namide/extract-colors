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

export default (src, options) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
  
    const imageLoaded = () => {
      image.removeEventListener('load', imageLoaded)
      
      const colorsExtractor = new ColorsExtractor(options)
      const data = getImageData(image, colorsExtractor.pixels).data
      return colorsExtractor.extract(data)
    }

    image.addEventListener('load', imageLoaded)
    image.src = src
  })
}
