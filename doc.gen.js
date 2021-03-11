const fs = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')
const marked = require('marked')
const hljs = require('highlight.js')

const DIR = 'dist-doc'
if (!fs.existsSync(DIR)){
  fs.mkdirSync(DIR)
}

jsdoc2md.render({
  files: 'src/**/*.js',
  'heading-depth': 2
})
  .then(doc => {
    return new Promise((resolve, reject) => {
      marked.setOptions({
        highlight: (code, lang) => hljs.highlight(lang, code).value
      })
      
      const html = marked(doc)
        .split('<pre>')
        .join('<pre class="hljs">')

      fs.writeFile(DIR + '/index.html', html, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve('Ended')
        }
      })
    })
  })
  .catch(error => console.log(error.message))
