import pkg from './package.json'
import uglify from 'rollup-plugin-uglify-es'

export default [{
  input: 'src/extractColors.js',
  output: {
    name: 'extractColors',
    file: pkg.browser,
    format: "umd"
  },
  plugins: [
    uglify()
  ]
}]