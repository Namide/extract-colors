import extractColors from '../src/extractColorsBrowser'

const display = (colors, src) => {
  const image = new Image()
  image.src = src
  image.height = 200
  image.style.width = 'auto'
  document.body.appendChild(image)

  const canvas = document.createElement('canvas')
  canvas.width = 20
  canvas.height = image.height

  const context = canvas.getContext('2d')

  var imageData = context.createImageData(canvas.width, canvas.height)
  var pixels = imageData.data

  /* eslint no-labels: "off" */
  loop: for (var r = 0; r < imageData.height; r++) {
    for (var c = 0; c < imageData.width; c++) {
      const i = Math.floor(r / canvas.width)
      const color = colors[i]

      if (!color) { break loop }

      // Calculate the position of the current pixel in the array
      var pos = (r * (imageData.width * 4)) + (c * 4)

      // Assign the colour to each pixel
      pixels[pos + 0] = color.red
      pixels[pos + 1] = color.green
      pixels[pos + 2] = color.blue
      pixels[pos + 3] = 255
    }
  }

  context.putImageData(imageData, 0, 0)

  document.body.appendChild(canvas)
}

['test', 'jean', 'crayon', 'jumelle', 'journey', 'park'].forEach(seed => {
  const imgSrc = `https://picsum.photos/seed/${seed}/200/300`
  extractColors(imgSrc, { crossOrigin: 'anonymous' })
    .then(colors => {
      display(colors, imgSrc)
      console.log(imgSrc)
      console.log(colors)
    })
    .catch(console.log)
})

Object.values(require('./img/*.jpg')).forEach(imgSrc => {
  extractColors(imgSrc)
    .then(colors => {
      display(colors, imgSrc)
      console.log(imgSrc)
      console.log(colors)
    })
    .catch(console.log)
})
