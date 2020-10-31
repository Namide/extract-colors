# Extract Colors

<img src="https://badge.fury.io/js/extract-colors.svg" alt="NPM package" />
<img src="https://img.shields.io/badge/code_style-Standard-brightgreen.svg" alt="Standard JavaScript Style Guide" />
<img src="https://david-dm.org/Namide/extract-colors.svg" alt="Dependencies" />
<img alt="npm bundle size" src="https://img.shields.io/bundlephobia/min/extract-colors?style=flat">
<img src="https://badgen.net/badge/coverage/78%25/green" alt="Coverage Status" />
<img src="https://img.shields.io/github/issues/namide/extract-colors.svg" alt="Issues" />
<img src="https://img.shields.io/badge/license-GNU_GPL-brightgreen.svg" alt="GNU GPL software License" />
<img alt="npm" src="https://img.shields.io/npm/dw/extract-colors">

Extract color palettes from images.  
Simple use, < 5ko minified, fast process and no dependencies for browser.  
Dependency to canvas for node.js

![3 examples of colors extraction](./doc/colors.jpg)


## Requirements

### Browsers

- Firefox: 29+
- Chrome: 33+
- Edge: 12+
- Opera: 19+
- Safari: 8+
- Webview Android: 4.4.3+
- Samsung Internet: 2.0+
- ~~Internet Explorer~~


### Node

- Node.js: 0.12+


## Install

### For browser

```bash
npm install --save extract-colors
```


### For node.js

Need to install dependency `canvas`

```bash
npm install --save extract-colors canvas
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

> You can use different types for `src` param (`String` for a path of image, `Image` or `ImageData`).  
> If you use `ImageData` type, be carrefull because the extractor will not optimize the process (it will not reduce the count of pixels).


### Node.js

```js
const path = require('path')
const { extractColors } = require('extract-colors')

const src = path.join(__dirname, './my-image.jpg')

extractColors(src)
  .then(console.log)
  .catch(console.log)
```

> You can use different types for `src` param (`String` for a path of image or `ImageData`).  
> If you use `ImageData` type, be carrefull because the extractor will not optimize the process (it will not reduce the count of pixels).


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

extractColors(src, options)
  .then(console.log)
  .catch(console.error)
```

**pixels**  
_Total pixel number of the resized picture for calculation_  
Type: `Integer`  
Default: `10000`  

**distance**  
_From 0 to 1 is the color distance to not have near colors (1 distance is between white and black)_  
Type: `Number`  
Default: `0.2`  

**saturationImportance**  
_Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size)_  
Type: `Number`  
Default: `0.2`  

**splitPower**  
_Approximation power in the first color splitting during process (from 2 to 16)_  
Type: `Integer`  
Default: `10`  

**colorValidator**  
_Callback with test to enable only some colors_  
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


## Functions

<dl>
<dt><a href="#getImageData">getImageData(image, pixels)</a> ⇒ <code>ImageData</code></dt>
<dd><p>Extract ImageData from image.
Reduce image to a pixel count.</p>
</dd>
<dt><a href="#extractColorsFromImageData">extractColorsFromImageData(imageData, [options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Extract colors from an ImageData object.</p>
</dd>
<dt><a href="#extractColorsFromImage">extractColorsFromImage(image, [options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Extract colors from an Image object.</p>
</dd>
<dt><a href="#extractColorsFromSrc">extractColorsFromSrc(src, [options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Extract colors from a path.
The image will be downloaded.</p>
</dd>
<dt><a href="#extractColors">extractColors(picture, [options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Extract colors from a picture.</p>
</dd>
<dt><a href="#getImageData">getImageData(image, pixels)</a> ⇒ <code>ImageData</code></dt>
<dd><p>Extract ImageData from image.
Reduce image to a pixel count.</p>
</dd>
<dt><a href="#extractColorsFromImageData">extractColorsFromImageData(imageData, [options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Extract colors from an ImageData object.</p>
</dd>
<dt><a href="#extractColorsFromSrc">extractColorsFromSrc(src, [options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Extract colors from a path.
The image will be downloaded.</p>
</dd>
<dt><a href="#extractColors">extractColors(picture, [options])</a> ⇒ <code>Array.&lt;Object&gt;</code></dt>
<dd><p>Extract colors from a picture.</p>
</dd>
</dl>

<a name="getImageData"></a>

## getImageData(image, pixels) ⇒ <code>ImageData</code>
Extract ImageData from image.
Reduce image to a pixel count.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Image</code> | Source image |
| pixels | <code>Number</code> | Maximum number of pixels for process |

<a name="extractColorsFromImageData"></a>

## extractColorsFromImageData(imageData, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from an ImageData object.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| imageData | <code>ImageData</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="extractColorsFromImage"></a>

## extractColorsFromImage(image, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from an Image object.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Image</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="extractColorsFromSrc"></a>

## extractColorsFromSrc(src, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from a path.
The image will be downloaded.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>String</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="extractColors"></a>

## extractColors(picture, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from a picture.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| picture | <code>String</code> \| <code>Image</code> \| <code>ImageData</code> | Src, Image or ImageData |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="getImageData"></a>

## getImageData(image, pixels) ⇒ <code>ImageData</code>
Extract ImageData from image.
Reduce image to a pixel count.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Image</code> | Source image |
| pixels | <code>Number</code> | Maximum number of pixels for process |

<a name="extractColorsFromImageData"></a>

## extractColorsFromImageData(imageData, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from an ImageData object.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| imageData | <code>ImageData</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="extractColorsFromSrc"></a>

## extractColorsFromSrc(src, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from a path.
The image will be downloaded.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>String</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="extractColors"></a>

## extractColors(picture, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from a picture.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| picture | <code>String</code> \| <code>Image</code> \| <code>ImageData</code> | Src, Image or ImageData |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

