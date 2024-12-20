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
      testInputs({ fastDistance: "a" as unknown as number })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({ distance: "a" as unknown as number })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({
        colorValidator: "a" as unknown as () => boolean,
      })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({
        colorValidator: 1 as unknown as () => boolean,
      })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({
        colorValidator: false as unknown as () => boolean,
      })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({
        defaultColors: 1 as unknown as true,
      })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({
        defaultColors: "a" as unknown as true,
      })
    ).toThrowError(/.*/);
    expect(() =>
      testInputs({
        defaultMainColor: "a" as unknown as number,
      })
    ).toThrowError(/.*/);
  });

  it("test warnings", () => {
    testInputs({ pixels: -1 });
    testInputs({ distance: -1 });
    testInputs({ distance: 2 });
    testInputs({ fastDistance: -1 });
    testInputs({ fastDistance: 2 });
    testInputs({ colorClassifications: ["toto" as "accents"] });
    testInputs({
      colorClassifications: ["dominants"],
      defaultColors: { accents: false } as unknown as { dominants: false },
    });
    testInputs({
      colorClassifications: ["dominants"],
      defaultColors: { dominants: -1 },
    });
    testInputs({
      colorClassifications: ["accents"],
      defaultColors: { accents: 0xffffff + 1 },
    });
    testInputs({ defaultMainColor: -1 });

    expect(consoleMock).toHaveBeenCalledTimes(10);
  });

  it("test min", () => {
    expect(cleanInputs({ pixels: -1 }).pixels).toBe(1);
    expect(cleanInputs({ distance: -1 }).distance).toBe(0);
    expect(cleanInputs({ fastDistance: -1 }).fastDistance).toBe(0);
    expect(cleanInputs({ defaultMainColor: -1 }).defaultMainColor).toBe(0);
  });

  it("test max", () => {
    expect(cleanInputs({ distance: 2 }).distance).toBe(1);
    expect(cleanInputs({ fastDistance: 2 }).fastDistance).toBe(1);
    expect(
      cleanInputs({ defaultMainColor: 0xffffff + 1 }).defaultMainColor
    ).toBe(0xffffff);
  });

  it("default", () => {
    expect(cleanInputs({ pixels: null as unknown as number }).pixels).toBe(1);
  });

  it("default", () => {
    expect(cleanInputs({ pixels: null as unknown as number }).pixels).toBe(1);
  });

  describe("Callback colorValidator() default", () => {
    it("Accept opacity color", () => {
      const { colorValidator } = cleanInputs();
      expect(colorValidator(0, 0, 0, 255)).toBe(true);
    });

    it("Refuse transparent color", () => {
      const { colorValidator } = cleanInputs();
      expect(colorValidator(0, 0, 0, 200)).toBe(false);
    });

    it("Non alpha color accepted", () => {
      const { colorValidator } = cleanInputs();
      expect(colorValidator(0, 0, 0)).toBe(true);
    });
  });
});
