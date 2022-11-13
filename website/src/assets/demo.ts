import Extractor from '../../../src/extract/Extractor'
import extractColors from '../../../src/extractColors.browser'
import { FinalColor } from '../../../src/types/Color'
import { createApp } from 'petite-vue'
import { AverageManager } from '../../../src/sort/AverageManager'

let processCurrentId = '' // To avoid old process calculations
const IMG_THEME = [/* 'moon',*/ 'water', 'sea', 'colors', 'sky']
const process: (() => void)[] = []

const getRandImg = (id) => {
  const index = Math.round(Math.random() * 20) + 5
  const seed = IMG_THEME[id % IMG_THEME.length]
  return `https://loremflickr.com/640/480/${seed}/?lock=${index}`
}

const getRandImgs = (count: number) => Array(count).fill(1).map((_, i) => getRandImg(i))

function Input () {
  return {
    pixels: Extractor.pixelsDefault,
    distance: Extractor.distanceDefault,
    splitPower: Extractor.splitPowerDefault,
    hueDistance: AverageManager.hueDefault,
    saturationDistance: AverageManager.saturationDefault,
    lightnessDistance: AverageManager.lightnessDefault,
    srcs: getRandImgs(5),

    get list () {
      return this.srcs.map(src => ({
        src,
        id: src + this.pixels + this.distance + this.splitPower + this.hueDistance + this.saturationDistance + this.lightnessDistance
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
    px: 0,
    time: 0,
    naturalPx: 0,
    loading: true,

    mounted () {
      const image = new Image()
      const id = `${ this.pixels }${ this.distance }${ this.splitPower }${ this.hueDistance }${ this.saturationDistance }${ this.lightnessDistance }`
      processCurrentId = id

      image.crossOrigin = 'anonymous'
      image.src = this.src
      image.onload = () => {
        this.px = Math.min(props.pixels, image.naturalWidth * image.naturalHeight)
        this.naturalPx = image.naturalWidth * image.naturalHeight
      }

      const nextProcess = () => {
        process.shift()
        if (process.length > 0) {
          process[0]()
        }
      }

      const execProcess = () => {
        // To avoid old process calculations
        if (id !== processCurrentId) {
          nextProcess()
        }
        const initTime = Date.now()
        extractColors(this.src, {
          pixels: Number(props.pixels),
          distance: Number(props.distance),
          splitPower: Number(props.splitPower),
          hueDistance: Number(props.hueDistance),
          saturationDistance: Number(props.saturationDistance),
          lightnessDistance: Number(props.lightnessDistance),
          crossOrigin: 'anonymous'
        })
          .then(colors => {
            this.time = (Date.now() - initTime)
            this.colors = colors
            this.loading = false
          })
          .finally(nextProcess)
      }

      process.push(execProcess)
      if (process.length < 2) {
        process[0]()
      }
    }
  }
}

createApp({ ImgBlock, Input }).mount()
