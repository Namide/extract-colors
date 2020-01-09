/**
 * @jest-environment jsdom
 */
import extractColors, { extractColorsFromImageData } from '../src/extractColorsBrowser.js'

const open = jest.fn()
Object.defineProperty(window, 'open', open)

test('Extract from imageData', () => {
  const imageData = { data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF] }
  return expect(extractColorsFromImageData(imageData).length).toBeGreaterThan(0)
})

// test('Extract from image', done => {
//   const image = new Image()
//   image.src = './tests/namide-world.jpg'
//   image.onload = () => {
//     extractColors(image)
//       .then(data => {
//         expect(data.length).toBeGreaterThan(0)
//         done()
//       })
//   }
// })

// test('Check color init', () => {
//   return extractColors('./namide-world.jpg')
//     .then(data => {
//       console.log(data)
//       expect(data.length).toBeGreaterThan(0)
//     })
// })

// extractColors(path.join(__dirname, './namide-world.jpg'))
//   .then(data => data.length ? true : new Error('Data empty'))
//   .then(() => console.log('✔\tSimple process'))
//   .catch(error => console.log('✔\tInvalid data: "' + error.message + '"'))

// extractColors(path.join(__dirname, './namide-world.jpg'), { pixels: 1 })
//   .then(() => console.log('✔\tLittle pixels'))
//   .catch(error => console.log('✔\tInvalid little pixels: "' + error.message + '"'))

// extractColors(path.join(__dirname, './namide-world.jpg'), { pixels: 'bad' })
//   .then(data => console.log('⚠\tBad type check for options.pixels'))
//   .catch(error => console.log('✔\tBad pixels check: "' + error.message + '"'))
