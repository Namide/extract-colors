import { describe, it, expect, vi, afterAll } from "vitest";

import cleanInputs, { testInputs } from "../src/process/cleanInputs";

describe("cleanInputs", () => {
  const consoleMock = vi.spyOn(console, "warn").mockImplementation(() => 1);

  afterAll(() => {
    consoleMock.mockReset();
  });

  it("test errors", () => {
    expect(() => testInputs({ pixels: 0.1 })).toThrowError(/.*/);
    expect(() => testInputs({ pixels: "a" as unknown as number })).toThrowError(
      /.*/
    );
    expect(() =>
      testInputs({ hueDistance: "a" as unknown as number })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({ saturationDistance: "a" as unknown as number })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({ distance: "a" as unknown as number })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({ lightnessDistance: "a" as unknown as number })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({
        colorValidator: "a" as unknown as (
          red: number,
          green: number,
          blue: number,
          alpha: number
        ) => boolean,
      })
    ).toThrowError(/.*/);
  });

  it("test warnings", () => {
    testInputs({ pixels: -1 });
    testInputs({ pixels: Number.MAX_SAFE_INTEGER + 1 });
    testInputs({ hueDistance: -1 });
    testInputs({ saturationDistance: -1 });
    testInputs({ distance: -1 });
    testInputs({ lightnessDistance: -1 });
    testInputs({ hueDistance: 2 });
    testInputs({ saturationDistance: 2 });
    testInputs({ distance: 2 });
    testInputs({ lightnessDistance: 2 });

    expect(consoleMock).toHaveBeenCalledTimes(10);
  });

  it("test min", () => {
    expect(cleanInputs({ pixels: -1 }).pixels).toBe(1);
    expect(cleanInputs({ hueDistance: -1 }).hueDistance).toBe(0);
    expect(cleanInputs({ saturationDistance: -1 }).saturationDistance).toBe(0);
    expect(cleanInputs({ distance: -1 }).distance).toBe(0);
    expect(cleanInputs({ lightnessDistance: -1 }).lightnessDistance).toBe(0);
  });

  it("test max", () => {
    expect(cleanInputs({ hueDistance: 2 }).hueDistance).toBe(1);
    expect(cleanInputs({ saturationDistance: 2 }).saturationDistance).toBe(1);
    expect(cleanInputs({ distance: 2 }).distance).toBe(1);
    expect(cleanInputs({ lightnessDistance: 2 }).lightnessDistance).toBe(1);
  });

  it("default", () => {
    expect(cleanInputs({ pixels: null as unknown as number }).pixels).toBe(1);
  });
});
