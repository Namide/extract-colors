import Extractor from '../../src/extract/Extractor'
import extractColors from '../../src/extractColors.browser'
import { FinalColor } from '../../src/types/Color'
import { createApp } from 'petite-vue'

const IMG_THEME = ['moon', 'water', 'sea', 'colors', 'sky']
const process: (() => void)[] = []

const getRandImg = (id) => {
  const index = Math.round(Math.random() * 20) + 5
  const seed = IMG_THEME[id % IMG_THEME.length]
  return `https://loremflickr.com/320/240/${seed}/?lock=${index}`
}

const getRandImgs = (count: number) => Array(count).fill(1).map((_, i) => getRandImg(i))

function Input () {
  return {
    pixels: Extractor.pixelsDefault,
    distance: Extractor.distanceDefault,
    splitPower: Extractor.splitPowerDefault,
    srcs: getRandImgs(5),

    get list () {
      return this.srcs.map(src => ({
        src,
        id: src + this.pixels + this.distance + this.splitPower
      }))
    },

    randomFiles () {
      this.srcs = getRandImgs(5)
    },

    uploadFile (event) {
      this.srcs = [...event.target.files].map(file => URL.createObjectURL(file))
    }
  }
}

function ImgBlock (props) {
  return {
    $template: '#img-block',
    colors: [] as FinalColor[][],
    px: '-',
    time: '-',

    mounted () {
      const image = new Image()

      image.crossOrigin = 'anonymous'
      image.src = this.src
      image.onload = () => {
        this.px = Math.min(props.pixels, image.naturalWidth * image.naturalHeight)
      }

      const execProcess = () => {
        const initTime = Date.now()
        extractColors(this.src, {
          pixels: props.pixels,
          distance: props.distance,
          splitPower: props.splitPower,
          crossOrigin: 'anonymous'
        })
          .then(colors => {
            this.time = (Date.now() - initTime)
            this.colors = colors
          })
          .finally(() => {
            process.shift()
            if (process.length > 0) {
              process[0]()
            }
          })
      }

      process.push(execProcess)
      if (process.length < 2) {
        process[0]()
      }
    }
  }
}

createApp({ ImgBlock, Input }).mount()
