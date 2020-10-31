const fs = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')

jsdoc2md.render({
  files: 'src/**/*.js',
  'heading-depth': 3
})
  .then(apiDoc => {
    return new Promise((resolve, reject) => {
      fs.readFile('readme.md', 'utf8', (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve({ initialDoc: data, apiDoc })
        }
      })
    })
  })
  .then(({ initialDoc, apiDoc }) => {
    return initialDoc.split(/(\n)*## API doc/gi).shift() +
      '\n\n\n## API doc\n\n' + apiDoc
  })
  .then(allDoc => {
    return new Promise((resolve, reject) => {
      fs.writeFile('readme.md', allDoc, (error) => {
        if (error) {
          reject(error)
        } else {
          resolve('Ended')
        }
      })
    })
  })
  .catch(error => console.log(error.message))
