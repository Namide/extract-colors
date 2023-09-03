import { extractColors } from "extract-colors"

const src = `https://loremflickr.com/640/480?lock=${ Math.floor(Math.random() * 0xFFFFFF) }`
extractColors(src, { crossOrigin: 'anonymous' }).then((list) => {
  console.log(list)
  document.body.innerHTML = JSON.stringify(list, null, '&nbsp;').replace(/\n/ig, '<br>')
})
