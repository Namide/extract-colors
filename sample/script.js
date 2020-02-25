import extractColors from '../src/extractColorsBrowser'

// Add image + colors in DOM
const display = (colors, src) => {
  const div = document.createElement('div')
  div.classList.add('block')
  document.body.appendChild(div)

  // display image
  const image = new Image()
  image.src = src
  image.height = 200
  image.style.width = 'auto'
  div.appendChild(image)

  // display colors
  {
    const canvas = document.createElement('canvas')
    canvas.width = 20
    canvas.height = image.height

    const context = canvas.getContext('2d')

    const imageData = context.createImageData(canvas.width, canvas.height)
    const pixels = imageData.data

    /* eslint no-labels: "off" */
    loop: for (let r = 0; r < imageData.height; r++) {
      for (let c = 0; c < imageData.width; c++) {
        const i = Math.floor(r / canvas.width)
        const color = colors[i]

        if (!color) { break loop }

        const pos = (r * (imageData.width * 4)) + (c * 4)
        pixels[pos + 0] = color.red
        pixels[pos + 1] = color.green
        pixels[pos + 2] = color.blue
        pixels[pos + 3] = 255
      }
    }

    context.putImageData(imageData, 0, 0)
    div.appendChild(canvas)
  }
}

// Some random tests
['test', 'jean', 'crayon', 'jumelle', 'journey', 'park', 'sun', 'moon', 'water', 'sea', 'colors', 'sky', 'unicorn'].forEach(seed => {
  [6, 10, 15].forEach(index => {
    const imgSrc = `https://loremflickr.com/320/240/${seed}/?lock=${index + 5}`
    extractColors(imgSrc, { crossOrigin: 'anonymous' })
      .then(colors => {
        display(colors, imgSrc)
        console.log(imgSrc)
        console.log(colors)
      })
      .catch(console.log)
  })
})

// Your tests in the img directory
Object.values(require('./img/*.jpg')).forEach(imgSrc => {
  extractColors(imgSrc)
    .then(colors => {
      display(colors, imgSrc)
      console.log(imgSrc)
      console.log(colors)
    })
    .catch(console.log)
})
