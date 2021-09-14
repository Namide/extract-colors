import extractColors from '../../src/extractColorsBrowser'

let realState = 0
let imgs = []

const options = {
  pixels: 10000,
  distance: 0.2,
  saturationImportance: 0.2,
  splitPower: 10,
  uploadFile () {
    imgs = []
    const input = document.getElementById('inputFile')
    input.onchange = function ({ target }) {
      [...target.files].forEach(file => {
        imgs.push(URL.createObjectURL(file))
      })
      process()
    }
    input.click()
  },
  randomFile () {
    imgs = []
    randomImgs()
    process()
  }
}

// Add image + colors in DOM
const resetDisplay = () => {
  const list = document.body.querySelector('.list')
  list.innerHTML = ''

  imgs.forEach(src => {
    const div = document.createElement('div')
    div.classList.add('block')

    // display image
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = src
    image.height = 200
    image.style.width = 'auto'
    div.appendChild(image)

    const canvas = document.createElement('canvas')
    canvas.width = 20
    canvas.height = image.height
    div.appendChild(canvas)

    list.appendChild(div)
  })
}

const displayLog = (index, ...logs) => {
  const pre = document.createElement('pre')
  pre.classList.add('log', 'hljs')

  logs.forEach(log => {
    const div = document.createElement('div')
    div.innerHTML = log
    pre.append(div)
  })

  const block = document.body.querySelectorAll('.list .block')[index]
  block.append(pre)
}

const displayImg = ({ colors, index, state, initTime, pixels }) => {
  if (state !== realState) {
    return false
  }

  const div = document.body.querySelectorAll('.list .block')[index]
  const canvas = div.querySelector('canvas')
  const img = div.querySelector('img')

  displayLog(
    index,
    `${colors.length} colors: ` + colors.map(color => `<span class="square" style="color:${color.hex}">▮</span>`).join(' '),
    'pixels: ' + Math.min(pixels, img.naturalWidth * img.naturalHeight),
    'time: ' + (Date.now() - initTime) + 'ms'
  )

  // display colors
  {
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
  }

  return true
}

const update = (data) => {
  console.log(data, options)
  process()
}

const randomImgs = ({ random = true, directory = false } = {}) => {
  if (random) {
    // Some random tests
    ['moon', 'water', 'sea', 'colors', 'sky'].forEach(seed => {
      const index = Math.round(Math.random() * 20) + 5
      imgs.push(`https://loremflickr.com/320/240/${seed}/?lock=${index}`)
    })
  } else if (directory) {
    // Your tests in the img directory
    Object.values(require('./img/*.jpg')).forEach(imgSrc => {
      imgs.push(imgSrc)
    })
  }
}

const process = () => {
  realState++
  const state = realState

  resetDisplay()

  let promise
  imgs.forEach((src, index) => {
    if (!promise) {
      const initTime = Date.now()
      promise = extractColors(src, { ...options, crossOrigin: 'anonymous' })
        .then(colors => displayImg({ colors, src, index, state, initTime, ...options }))
    } else {
      promise
        .then(() => {
          const initTime = Date.now()
          return extractColors(src, { ...options, crossOrigin: 'anonymous' })
            .then(colors => displayImg({ colors, src, index, state, initTime, ...options }))
        })
    }
  })

  if (promise) {
    promise.catch(console.log)
  }
}

const gui = new dat.GUI()
gui.add(options, 'pixels', 1).step(1).name('pixels').onFinishChange(update)
gui.add(options, 'distance', 0, 1).name('distance').onFinishChange(update)
gui.add(options, 'saturationImportance', 0, 1).name('saturationImportance').onFinishChange(update)
gui.add(options, 'splitPower', 2, 16).name('splitPower').onFinishChange(update)

gui.add(options, 'uploadFile').name('Upload images')
gui.add(options, 'randomFile').name('5 random images')

options.randomFile()
