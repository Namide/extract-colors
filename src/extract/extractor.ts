import RootGroup from '../color/RootGroup'

/**
 * Run extract process and get list of colors.
 */
export default (
  { data, width, height }: ImageData | { data: Uint8ClampedArray | number[], width?: number, height?: number },
  _pixels: number,
  _distance: number,
  _colorValidator: (red: number, green: number, blue: number, alpha: number) => boolean
) => {
  const colorGroup = new RootGroup()
  const reducer = (width && height) ? Math.floor(width * height / _pixels) || 1 : 1
  let ignoredColorsCount = 0

  for (let i = 0; i < data.length; i += 4 * reducer) {
    const r = data[i] // 0 -> 255
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    if (_colorValidator(r, g, b, a)) {
      colorGroup.addColor(r, g, b)
    } else {
      ignoredColorsCount++
    }
  }
  
  return {
    colors: colorGroup.getColors(_distance),
    count: colorGroup._count + ignoredColorsCount
  }
}
