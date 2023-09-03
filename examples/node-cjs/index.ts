import getPixels from "get-pixels"
import { extractColors } from 'extract-colors'

const src = `https://loremflickr.com/640/480?lock=${ Math.floor(Math.random() * 0xFFFFFF) }`

getPixels(src, (err, pixels) => {
  if(!err) {
    const data = [...pixels.data]
    const width = Math.round(Math.sqrt(data.length / 4))
    const height = width

    extractColors({ data, width, height })
      .then(colors => colors.map(({ hex }) => hex))
      .then(console.log)
      .catch(console.log)
  }
})
