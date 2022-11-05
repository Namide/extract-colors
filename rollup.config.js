import pkg from './package.json'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

export default [
  {
    input: 'src/extractColorsBrowser.js',
    output: {
      name: 'extractColors',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      terser()
    ]
  },

  {
    input: 'src/extractColorsModule.js',
    external: ['canvas'],
    output: {
      name: 'extractColors',
      file: pkg.main,
      format: 'cjs'
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  },

  {
    input: 'src/extractColorsBrowser.js',
    output: {
      name: 'extractColors',
      file: 'dist/extract-colors.browser.es.js',
      format: 'es'
    },
    plugins: [
      terser()
    ]
  },

  {
    input: 'src/extractColorsModule.js',
    external: ['canvas'],
    output: {
      name: 'extractColors',
      file: 'dist/extract-colors.node.es.js',
      format: 'es'
    },
    plugins: [
      resolve(),
      commonjs(),
      terser()
    ]
  }
]
