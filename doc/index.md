# API doc

## Modules

<dl>
<dt><a href="#module_core.module_Color">Color</a></dt>
<dd><p>Informations like saturation or count of pixels in image.</p>
</dd>
<dt><a href="#module_core.module_ColorsExtractor">ColorsExtractor</a></dt>
<dd><p>Process to extract main colors from list of colors.</p>
</dd>
<dt><a href="#module_core.module_ColorGroup">ColorGroup</a></dt>
<dd><p>Group colors with algorithms to optimize and merge neighbors colors.</p>
</dd>
<dt><a href="#browser.module_Browser">Browser</a></dt>
<dd><p>Browser exported functions.</p>
</dd>
<dt><a href="#node.module_Node">Node</a></dt>
<dd><p>Node exported functions.</p>
</dd>
</dl>

<a name="module_core.module_Color"></a>

## Color
Informations like saturation or count of pixels in image.


* [Color](#module_core.module_Color)
    * [.module.exports](#exp_module_core.module_Color--module.exports) ⏏
        * [new module.exports(red, green, blue, [hex])](#new_module_core.module_Color--module.exports_new)
        * [.distance(color)](#module_core.module_Color--module.exports+distance) ⇒ <code>Number</code>
        * [.getWeight(saturationImportance, maxCount)](#module_core.module_Color--module.exports+getWeight) ⇒ <code>Number</code>
        * [.getSaturation()](#module_core.module_Color--module.exports+getSaturation) ⇒ <code>Number</code>

<a name="exp_module_core.module_Color--module.exports"></a>

### .module.exports ⏏
Calculate some informations and store data about color.

**Kind**: static class of [<code>Color</code>](#module_core.module_Color)  
<a name="new_module_core.module_Color--module.exports_new"></a>

#### new module.exports(red, green, blue, [hex])
Set red, green and blue colors to create the Color object.


| Param | Type | Description |
| --- | --- | --- |
| red | <code>Number</code> | Red channel integer from 0 to 255 |
| green | <code>Number</code> | Green channel integer from 0 to 255 |
| blue | <code>Number</code> | Blue channel integer from 0 to 255 |
| [hex] | <code>Number</code> | Optional hexadecimal color from 0x000000 to 0xFFFFFF |

<a name="module_core.module_Color--module.exports+distance"></a>

#### module.exports.distance(color) ⇒ <code>Number</code>
Distance between two colors.
- Minimum is 0 (between two same colors)
- Maximum is 1 (for example between black and white)

**Kind**: instance method of [<code>module.exports</code>](#exp_module_core.module_Color--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| color | <code>Color</code> | Color to compare |

<a name="module_core.module_Color--module.exports+getWeight"></a>

#### module.exports.getWeight(saturationImportance, maxCount) ⇒ <code>Number</code>
Weight of the color depends of his saturation and his count.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_core.module_Color--module.exports)  

| Param | Type | Description |
| --- | --- | --- |
| saturationImportance | <code>Number</code> | Determine the weight of the saturation for the calcul (from 0 to 1) |
| maxCount | <code>Number</code> | Number of pixels in the image. |

<a name="module_core.module_Color--module.exports+getSaturation"></a>

#### module.exports.getSaturation() ⇒ <code>Number</code>
Saturation of the color from 0 to 1.

**Kind**: instance method of [<code>module.exports</code>](#exp_module_core.module_Color--module.exports)  
<a name="module_core.module_ColorsExtractor"></a>

## ColorsExtractor
Process to extract main colors from list of colors.

<a name="exp_module_core.module_ColorsExtractor--module.exports"></a>

### .module.exports ⏏
Process to extract neighboring colors.

**Kind**: static class of [<code>ColorsExtractor</code>](#module_core.module_ColorsExtractor)  
<a name="module_core.module_ColorGroup"></a>

## ColorGroup
Group colors with algorithms to optimize and merge neighbors colors.

<a name="exp_module_core.module_ColorGroup--module.exports"></a>

### .module.exports ⏏
Manage list of colors or groups.

**Kind**: static class of [<code>ColorGroup</code>](#module_core.module_ColorGroup)  
<a name="browser.module_Browser"></a>

## Browser
Browser exported functions.

**Example**  
```js
import extractColors from 'extract-colors'

const src = 'my-image.jpg'

extractColors(src)
  .then(console.log)
  .catch(console.error)
```

* [Browser](#browser.module_Browser)
    * [~getImageData(image, pixels)](#browser.module_Browser..getImageData) ⇒ <code>ImageData</code>
    * [~extractColorsFromImageData(imageData, [options])](#browser.module_Browser..extractColorsFromImageData) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~extractColorsFromImage(image, [options])](#browser.module_Browser..extractColorsFromImage) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~extractColorsFromSrc(src, [options])](#browser.module_Browser..extractColorsFromSrc) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~extractColors(picture, [options])](#browser.module_Browser..extractColors) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="browser.module_Browser..getImageData"></a>

### Browser~getImageData(image, pixels) ⇒ <code>ImageData</code>
Extract ImageData from image.
Reduce image to a pixel count.

**Kind**: inner method of [<code>Browser</code>](#browser.module_Browser)  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Image</code> | Source image |
| pixels | <code>Number</code> | Maximum number of pixels for process |

<a name="browser.module_Browser..extractColorsFromImageData"></a>

### Browser~extractColorsFromImageData(imageData, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from an ImageData object.

**Kind**: inner method of [<code>Browser</code>](#browser.module_Browser)  

| Param | Type | Description |
| --- | --- | --- |
| imageData | <code>ImageData</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="browser.module_Browser..extractColorsFromImage"></a>

### Browser~extractColorsFromImage(image, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from an Image object.

**Kind**: inner method of [<code>Browser</code>](#browser.module_Browser)  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Image</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="browser.module_Browser..extractColorsFromSrc"></a>

### Browser~extractColorsFromSrc(src, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from a path.
The image will be downloaded.

**Kind**: inner method of [<code>Browser</code>](#browser.module_Browser)  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>String</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="browser.module_Browser..extractColors"></a>

### Browser~extractColors(picture, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from a picture.

**Kind**: inner method of [<code>Browser</code>](#browser.module_Browser)  

| Param | Type | Description |
| --- | --- | --- |
| picture | <code>String</code> \| <code>Image</code> \| <code>ImageData</code> | Src, Image or ImageData |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="node.module_Node"></a>

## Node
Node exported functions.

**Example**  
```js
const path = require('path')
const { extractColors } = require('extract-colors')

const src = path.join(__dirname, './my-image.jpg')

extractColors(src)
  .then(console.log)
  .catch(console.log)
```
**Example**  
```js
import { extractColorsFromImageData } from 'extract-colors'

const imageData = { data: [0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0xFF, 0x00, 0xFF, 0xFF, 0x00, 0x00, 0xFF] }

extractColorsFromImageData(imageData)
  .then(console.log)
  .catch(console.error)
```

* [Node](#node.module_Node)
    * [~getImageData(image, pixels)](#node.module_Node..getImageData) ⇒ <code>ImageData</code>
    * [~extractColorsFromImageData(imageData, [options])](#node.module_Node..extractColorsFromImageData) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~extractColorsFromSrc(src, [options])](#node.module_Node..extractColorsFromSrc) ⇒ <code>Array.&lt;Object&gt;</code>
    * [~extractColors(picture, [options])](#node.module_Node..extractColors) ⇒ <code>Array.&lt;Object&gt;</code>

<a name="node.module_Node..getImageData"></a>

### Node~getImageData(image, pixels) ⇒ <code>ImageData</code>
Extract ImageData from image.
Reduce image to a pixel count.

**Kind**: inner method of [<code>Node</code>](#node.module_Node)  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Image</code> | Source image |
| pixels | <code>Number</code> | Maximum number of pixels for process |

<a name="node.module_Node..extractColorsFromImageData"></a>

### Node~extractColorsFromImageData(imageData, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from an ImageData object.

**Kind**: inner method of [<code>Node</code>](#node.module_Node)  

| Param | Type | Description |
| --- | --- | --- |
| imageData | <code>ImageData</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="node.module_Node..extractColorsFromSrc"></a>

### Node~extractColorsFromSrc(src, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from a path.
The image will be downloaded.

**Kind**: inner method of [<code>Node</code>](#node.module_Node)  

| Param | Type | Description |
| --- | --- | --- |
| src | <code>String</code> |  |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

<a name="node.module_Node..extractColors"></a>

### Node~extractColors(picture, [options]) ⇒ <code>Array.&lt;Object&gt;</code>
Extract colors from a picture.

**Kind**: inner method of [<code>Node</code>](#node.module_Node)  

| Param | Type | Description |
| --- | --- | --- |
| picture | <code>String</code> \| <code>Image</code> \| <code>ImageData</code> | Src, Image or ImageData |
| [options] | <code>Object</code> | Optional data |
| [options.pixels] | <code>String</code> | Total pixel number of the resized picture for calculation |
| [options.distance] | <code>String</code> | From 0 to 1 is the color distance to not have near colors (1 distance is between white and black) |
| [options.saturationImportance] | <code>String</code> | Power of the saturation weight during the process (0 is not used, 1 is only saturation and not area size) |
| [options.splitPower] | <code>String</code> | Approximation power in the first color splitting during process (from 2 to 16) |
| [options.colorValidator] | <code>String</code> | Callback with test to enable only some colors |

