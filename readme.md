# Extract Colors

Extract color palettes from images.
Simple use, <4ko minified and no dependencies for browser.


## Install

```bash
npm install 'extract-colors'
```


## Usage

```js
import extractColors from 'extract-colors'

const src = 'my-image.jpg'

extractColors(src).then(console.log)
```


### Options

```js
const src = 'my-image.jpg'

const options = {
  pixels: 10000,
  distance: 150,
  saturationImportance: 5,
  splitPower: 10,
  colorValidator: (red, green, blue, alpha = 255) => alpha > 250
}

extractColors(src, options).then(console.log)
```

| Field | Default | Type | Description |
|---|---|---|---|
| pixels | 10000 | Integer | Total pixel number of the resized picture for calculation |
| distance | 150 | Integer | From 1 to 762 is the color distance to not have near colors |
| saturationImportance | 5 | Number | Power of the saturation weight during the process |
| splitPower | 10 | Integer | Approximation power in the first color splitting during process |
| colorValidator | (red, green, blue, alpha = 255) => alpha > 250 | Function | Lamda function to disable some colors |


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
