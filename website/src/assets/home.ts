import extractColors from '../../../src/extractColors.browser'
import "./parts/hljs"
import "./parts/tabs"
import "./parts/track"

getColors()

function getColors () {
  const imgEl = document.body.querySelector("#ec-img") as HTMLImageElement | null
  const container = document.body.querySelector("#ec-colors")
  const restartEl = document.body.querySelector("#ec-restart")
  const reloadEl = restartEl?.children[0] as SVGElement | undefined
  
  if (!imgEl || !container || !restartEl || !reloadEl) {
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
      // container.innerHTML = colors.toString()
      const el = container.children[0] as HTMLLIElement
      container.innerHTML = ""
      container.classList.remove("invisible")
      container.append(...colors.map(color => {
        const colEl = el.cloneNode() as HTMLLIElement
        colEl.classList.remove("bg-white")
        colEl.style.backgroundColor = color.hex
        return colEl
      }))

      restartEl.classList.remove("loading")
      restartEl.addEventListener("click", getColors)
      reloadEl.style.display = ""
    })
    .finally(nextProcess)
}
