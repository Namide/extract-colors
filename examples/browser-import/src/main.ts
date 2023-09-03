
import ExtractColors from "extract-colors"

const src = `https://loremflickr.com/640/480?lock=${ Math.floor(Math.random() * 0xFFFFFF) }`
ExtractColors(src, { crossOrigin: 'anonymous' }).then(console.log)
