import { describe, it, expect, vi, afterAll } from 'vitest'

import cleanInputs from '../src/extract/cleanInputs'

describe('cleanInputs', () => {

  const consoleMock = vi.spyOn(console, 'warn').mockImplementation(() => {});

  afterAll(() => {
    consoleMock.mockReset();
  });

  it('test errors', () => {

    expect(() => cleanInputs({ pixels: 0.1 })).toThrowError(/.*/)
    expect(() => cleanInputs({ pixels: 'a' as unknown as number })).toThrowError(/.*/)
    expect(() => cleanInputs({ hueDistance: 'a' as unknown as number })).toThrowError(/.*/)
    expect(() => cleanInputs({ saturationDistance: 'a' as unknown as number })).toThrowError(/.*/)
    expect(() => cleanInputs({ distance: 'a' as unknown as number })).toThrowError(/.*/)
    expect(() => cleanInputs({ lightnessDistance: 'a' as unknown as number })).toThrowError(/.*/)
    expect(() => cleanInputs({ colorValidator: 'a' as unknown as (red: number, green: number, blue: number, alpha: number) => boolean })).toThrowError(/.*/)
  })

  it('test warnings', () => {

    cleanInputs({ pixels: -1 })
    cleanInputs({ pixels: Number.MAX_SAFE_INTEGER + 1 })
    cleanInputs({ hueDistance: -1 })
    cleanInputs({ saturationDistance: -1 })
    cleanInputs({ distance: -1 })
    cleanInputs({ lightnessDistance: -1 })
    cleanInputs({ hueDistance: 2 })
    cleanInputs({ saturationDistance: 2 })
    cleanInputs({ distance: 2 })
    cleanInputs({ lightnessDistance: 2 })

    expect(consoleMock).toHaveBeenCalledTimes(10);
  })

  it('test min', () => {

    expect(cleanInputs({ pixels: -1 })[0]).toBe(1)
    expect(cleanInputs({ hueDistance: -1 })[3]).toBe(0)
    expect(cleanInputs({ saturationDistance: -1 })[4]).toBe(0)
    expect(cleanInputs({ distance: -1 })[1]).toBe(0)
    expect(cleanInputs({ lightnessDistance: -1 })[5]).toBe(0)
  })

  it('test max', () => {

    expect(cleanInputs({ hueDistance: 2 })[3]).toBe(1)
    expect(cleanInputs({ saturationDistance: 2 })[4]).toBe(1)
    expect(cleanInputs({ distance: 2 })[1]).toBe(1)
    expect(cleanInputs({ lightnessDistance: 2 })[5]).toBe(1)
  })

  it('default', () => {

    expect(cleanInputs({ pixels: null as unknown as number })[0]).toBe(1)
  })
})
