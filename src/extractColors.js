import ColorsExtractor from './ColorsExtractor'

export default (src, options) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
  
    const imageLoaded = () => {
      image.removeEventListener('load', imageLoaded)
      
      const colorsExtractor = new ColorsExtractor(options)
      const colors = colorsExtractor.extract(image)
      resolve(colors)
    }
    image.addEventListener('load', imageLoaded)
    image.src = src
  })
}
