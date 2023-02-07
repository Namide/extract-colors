import { extractColors } from '../../../src/extractColors.browser'
import "./parts/hljs"
import "./parts/tabs"
import "./parts/track"

getColors()

function getColors () {
  const imgEl = document.body.querySelector("#ec-img") as HTMLImageElement | null
  const noimgEl = document.body.querySelector("#ec-noimg") as HTMLDivElement | null
  const container = document.body.querySelector("#ec-colors")
  const restartEl = document.body.querySelector("#ec-restart")
  const reloadEl = restartEl?.children[0] as SVGElement | undefined
  
  if (!imgEl || !container || !restartEl || !reloadEl || !noimgEl) {
    return
  }

  const IMG_THEME = [/* 'moon',*/ 'water', 'sea', 'colors', 'sky']
  const process: (() => void)[] = []
  
  const getRandImg = () => {
    const index = Math.round(Math.random() * 20) + 5
    const seed = IMG_THEME[Math.floor(Math.random() * IMG_THEME.length)]
    return `https://loremflickr.com/640/480/${seed}/?lock=${index}`
  }

  container.classList.add("invisible")
  restartEl.classList.add("loading")
  restartEl.removeEventListener("click", getColors)
  reloadEl.style.display = "none"
  noimgEl.style.opacity = "1"
  
  const src = getRandImg()
  imgEl.src = src
  imgEl.crossOrigin = 'anonymous'

  const nextProcess = () => {
    process.shift()
    if (process.length > 0) {
      process[0]()
    }
  }

  extractColors(src, {
    crossOrigin: 'anonymous'
  })
    .then(colors => {
      const el = container.children[0] as HTMLLIElement
      container.innerHTML = ""
      container.classList.remove("invisible")
      container.append(...colors.map(color => {
        const colEl = el.cloneNode(true) as HTMLLIElement
        const tooltip = colEl.querySelector('.tooltip') as HTMLSpanElement
        const span = colEl.querySelector('span>span') as HTMLSpanElement

        if (tooltip) {
          tooltip.dataset.tip = `${ (color.area * 100).toFixed(2) }%`
        }
        if (span) {
          span.style.backgroundColor = color.hex
        }

        return colEl
      }))

      restartEl.classList.remove("loading")
      restartEl.addEventListener("click", getColors)
      reloadEl.style.display = ""
      noimgEl.style.opacity = "0"
    })
    .finally(nextProcess)
}
