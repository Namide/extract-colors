import extractColors from '../../../src/extractColors.browser'
import "./parts/hljs"

addTab("#usage-browser-btn", "#usage-nodejs-btn", "#usage-browser-content", "#usage-nodejs-content")
addTab("#usage-nodejs-btn", "#usage-browser-btn", "#usage-nodejs-content", "#usage-browser-content")
addTab("#install-browser-btn", "#install-nodejs-btn", "#install-browser-content", "#install-nodejs-content")
addTab("#install-nodejs-btn", "#install-browser-btn", "#install-nodejs-content", "#install-browser-content")

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

function addTab (tab1: string, tab2: string, content1: string, content2: string) {
  document.body.querySelector(tab1)
    ?.addEventListener("click", () => {
      document.body.querySelector(tab1)
        ?.classList.add('!bg-neutral', '!text-neutral-content', 'tab-active')
      document.body.querySelector(tab2)
        ?.classList.remove('!bg-neutral', '!text-neutral-content', 'tab-active')
      document.body.querySelector(content1)
        ?.classList.remove('!hidden')
      document.body.querySelector(content2)
        ?.classList.add('!hidden')
  })
}
