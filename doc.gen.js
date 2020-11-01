const fs = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')

jsdoc2md.render({
  files: 'src/**/*.js',
  'heading-depth': 2
})
  .then(doc => {
    return new Promise((resolve, reject) => {
      fs.writeFile('doc/index.md', '# API doc\n\n' + doc, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve('Ended')
        }
      })
    })
  })
  .catch(error => console.log(error.message))
