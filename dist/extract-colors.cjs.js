'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var canvas = _interopDefault(require('canvas'));

var Color_1 = class Color {
  constructor (red, green, blue, hex) {
    this.isColor = true;

    this.red = red;
    this.green = green;
    this.blue = blue;
    this.hex = hex;

    this.count = 1;
  }

  distance (color) {
    return Math.abs(color.red - this.red) + Math.abs(color.green - this.green) + Math.abs(color.blue - this.blue)
  }

  getWeight (saturationImportance) {
    return this.count + this.getSaturation() * saturationImportance
  }

  getSaturation () {
    if (this.saturation === undefined) {
      this.saturation = Math.max(
        Math.abs(this.red - this.green),
        Math.abs(this.red - this.blue),
        Math.abs(this.green - this.blue)
      );
    }

    return this.saturation
  }
};

var ColorsGroup = class ColorGroup {
  constructor () {
    this.count = 1;
    this.children = { };
  }

  addGroup (key) {
    if (this.children[key]) {
      this.children[key].count++;
    } else {
      this.children[key] = new ColorGroup();
    }

    return this.children[key]
  }

  addColor (hex, red, green, blue) {
    if (this.children[hex]) {
      this.children[hex].count++;
    } else {
      this.children[hex] = new Color_1(red, green, blue, hex);
    }

    return this.children[hex]
  }

  getList () {
    return Object.keys(this.children)
      .map(key => this.children[key])
  }

  getMaxWeight (saturationImportance) {
    if (this.maxWeight === undefined) {
      const list = this.getList()
        .map(child => child.isColor ? child.getWeight(saturationImportance) : child.getMaxWeight(saturationImportance));

      list.sort((a, b) => b - a);
      this.maxWeight = list[0] || 0;
    }

    return this.maxWeight
  }

  getMaxWeightColor (saturationImportance) {
    const list = this.getList();
    list.sort((a, b) => {
      if (a.isColor) {
        return b.getWeight(saturationImportance) - a.getWeight(saturationImportance)
      }
      return b.getMaxWeight(saturationImportance) - a.getMaxWeight(saturationImportance)
    });

    return list[0].isColor ? list[0] : list[0].getMaxWeightColor(saturationImportance)
  }

  getColors (distance, saturationImportance) {
    const list = this.getList()
      .map(child => {
        const count = child.count;
        const color = child.getMaxWeightColor(saturationImportance);
        color.count = count;
        return color
      });

    list.sort((a, b) => b.getWeight(saturationImportance) - a.getWeight(saturationImportance));

    const newList = [];
    list.forEach(color => {
      const near = newList.find(col => col.distance(color) < distance);
      if (!near) {
        newList.push(color);
      } else {
        near.count += color.count;
      }
    });

    return newList
  }
};

var ColorsExtractor_1 = class ColorsExtractor {
  constructor (image, {
    pixels = 10000,
    distance = 150,
    saturationImportance = 5,
    splitPower = 10,
    colorValidator = (red, green, blue, alpha = 255) => alpha > 250
  } = {}) {
    this.pixels = pixels;
    this.splitPower = splitPower;
    this.distance = distance;
    this.saturationImportance = saturationImportance;
    this.colorValidator = colorValidator;
  }

  process (data) {
    const store = new ColorsGroup();
    const acc = this.splitPower;
    let group;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]; // 0 -> 255
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      if (this.colorValidator(r, g, b, a)) {
        const real = r << 16 | g << 8 | b;
        const medium = (r >> 4 & 0xF) << 2 | (g >> 4 & 0xF) << 1 | (b >> 4 & 0xF);
        const small = Math.round(r * (acc - 1) / 255) * (acc * acc) + Math.round(g * (acc - 1) / 255) * acc + Math.round(b * (acc - 1) / 255);

        group = store.addGroup(small);
        group = group.addGroup(medium);
        group.addColor(real, r, g, b);
      }
    }

    return store.getColors(this.distance, this.saturationImportance)
  }

  extract (data) {
    return this.process(data)
      .map(color => ({
        hex: '#' + '0'.repeat(6 - color.hex.toString(16).length) + color.hex.toString(16),
        red: color.red,
        green: color.green,
        blue: color.blue,
        area: color.count / this.pixels,
        saturation: color.saturation / 0xFF
      }))
  }
};

const { createCanvas, loadImage } = canvas;


const getImageData = (image, pixels) => {
  const currentPixels = image.width * image.height;
  const width = currentPixels < pixels ? image.width : Math.round(image.width * Math.sqrt(pixels / currentPixels));
  const height = currentPixels < pixels ? image.height : Math.round(image.height * Math.sqrt(pixels / currentPixels));

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
  return context.getImageData(0, 0, width, height)
};

var extractColorsModule = (src, options) => {
  return loadImage(src)
    .then(image => {
      const colorsExtractor = new ColorsExtractor_1(options);
      const data = getImageData(image, colorsExtractor.pixels).data;
      return colorsExtractor.extract(data)
    })
};

module.exports = extractColorsModule;
