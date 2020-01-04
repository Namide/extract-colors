# Extract Colors

Extract color palettes from images.

## Example

```js
import extractColors from 'extract-colors'

extractColors().then(console.log)
```

## Results

Array of colors with the followed properties:

```js
[
  {
    hex: '#62342b', // color in hexadecimal string
    red: 98, // red canal from 0 to 255
    green: 52, // green canal from 0 to 255
    blue: 43, // blue canal from 0 to 255
    area: 0.5915, // area of the color and his neighbouring colors from 0 to 1
    saturation: 0.2156862 // color saturation from 0 to 1
  },
  ...
]
```