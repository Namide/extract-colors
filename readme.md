# Extract Colors

Extract color palettes from images.
Simple use, <5ko minified and no dependencies for browser. Dependency to canvas for node.js


## Install

### For browser

```bash
npm install 'extract-colors'
```

### For node.js

Need to install dependency `canvas`

```bash
npm install 'extract-colors' 'canvas'
```

## Usage

### Browser

```js
import extractColors from 'extract-colors'

const src = 'my-image.jpg'

extractColors(src)
  .then(console.log)
  .catch(console.error)
```


### Node.js

```js
const path = require('path')
const { extractColors } = require('extract-colors')

const src = './my-image.jpg'

extractColors(path.join(__dirname, src))
  .then(console.log)
  .catch(console.log)
```


### Options

```js
const src = 'my-image.jpg'

const options = {
  pixels: 10000,
  distance: 0.2,
  saturationImportance: 0.2,
  splitPower: 10,
  colorValidator: (red, green, blue, alpha = 255) => alpha > 250
}

extractColors(src, options).then(console.log)
```

**pixels**  
_Total pixel number of the resized picture for calculation_  
Type: `Integer`  
Default: `10000`  

**distance**  
_From 0 to 1 is the color distance to not have near colors (1 distance is between White and Black)_  
Type: `Number`  
Default: `0.2`  

**saturationImportance**  
_Power of the saturation weight during the process (0 is not used, 1 is equal only saturaton and not area size)_  
Type: `Number`  
Default: `0.2`  

**splitPower**  
_Approximation power in the first color splitting during process (from 2 to 16)_  
Type: `Integer`  
Default: `10`  

**colorValidator**  
_Enable only some colors_  
Type: `Function`  
Default: `(red, green, blue, alpha = 255) => alpha > 250`  

**crossOrigin**  
_Only for browser, can be 'Anonymous' to avoid CORS_  
Type: `String`  
Default: `null`  


## Return of the promise

Array of colors with the followed properties:

```js
[
  {
    hex: '#62342b',
    red: 98,
    green: 52,
    blue: 43,
    area: 0.5915,
    saturation: 0.2156862
  },
  ...
]
```

| Field | Example | Type | Description |
|---|---|---|---|
| hex | #62342b | String | color in hexadecimal string |
| red | 98 | Integer | red canal from 0 to 255 |
| green | 52 | Integer | green canal from 0 to 255 |
| blue | 43 | Integer | blue canal from 0 to 255 |
| area | 0.5915 | Number | area of the color and his neighbouring colors from 0 to 1 |
| saturation | 0.2156862 | Number | color saturation from 0 to 1 |
