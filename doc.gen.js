const fs = require('fs')
const jsdoc2md = require('jsdoc-to-markdown')

jsdoc2md.render({ files: 'src/*.js' })
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
    return initialDoc.split(/(\n)*## Functions/gi).shift() +
      '\n\n\n' + apiDoc
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
