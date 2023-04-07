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
  const rootGroup = new RootGroup()
  const reducer = (width && height) ? Math.floor(width * height / _pixels) || 1 : 1

  for (let i = 0; i < data.length; i += 4 * reducer) {
    const r = data[i] // 0 -> 255
    const g = data[i + 1]
    const b = data[i + 2]
    const a = data[i + 3]

    if (_colorValidator(r, g, b, a)) {
      const real = r << 16 | g << 8 | b
      const medium = (r >> 4 & 0xF) << 8 | (g >> 4 & 0xF) << 4 | (b >> 4 & 0xF)
      const mediumGroup = rootGroup.addLeafGroup(medium)
      mediumGroup.addColor(real, r, g, b)
    }
  }
  
  return rootGroup.getColors(_distance, _pixels)
}
