import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import uglify from 'rollup-plugin-uglify-es'

export default [
  {
    input: 'src/extractColorsBrowser.js',
    output: {
      name: 'extractColors',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      uglify()
    ]
  },

  {
    input: 'src/extractColorsModule.js',
    external: [ 'canvas' ],
		output: [
			{
        name: 'extractColors',
        file: pkg.main,
        format: 'cjs'
      },
			{
        name: 'extractColors',
        file: pkg.module,
        format: 'es'
      }
		],
    plugins: [
      resolve(),
      commonjs(),
      uglify()
    ]
  }
]