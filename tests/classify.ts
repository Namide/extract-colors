import { describe, it, expect } from "vitest";

import { classify } from "../src/process/classify";
import RGBColor from "../src/color/RGBColor";
import { createFinalColor } from "../src/color/FinalColor";
import { ColorClassification } from "../src/types/Color";
import { hexToFinalColor } from "./testHelpers";

/*
 0xFF0000
 0xFF7700
 0xFFFF00
 0xFFFF77
 0xFFFFFF
 0x77FFFF
 0x0077FF
 0x0000FF
 0x7700FF
 0xFF00FF
 0xFF77FF
 0x7777FF
 0x77FF77
 0xFF7777
 0x00FF77
 0x00FF77
*/

const COLORS_LIST_TEST: { [color in ColorClassification]?: number[] }[] = [
  // {
  //   warmest: [0xff0000, 0xffff00],
  //   coolest: [0x00ffff, 0x11ff00, 0xff77ff],
  // },
  // {
  //   // By saturation
  //   accents: [0xff0000, 0xffff00],
  //   dominants: [0xcccccc, 0xdddddd, 0x333333],
  // },
  // {
  //   // By hue
  //   accents: [0xff0000, 0xff2200, 0xcc0011],
  //   dominants: [0x0000ff, 0x1111aa, 0x1122dd, 0x2200ff, 0x0055ee],
  // },
  {
    // By lighness
    accents: [0x550000, 0x005500, 0x000055],
    dominants: [0xffffff, 0xddffff, 0xffff66, 0xff99ff, 0x66ffff],
  },
];

describe("classify", () => {
  for (const colorsByTypes of COLORS_LIST_TEST) {
    const colors = Object.entries(colorsByTypes) as [
      ColorClassification,
      number[]
    ][];
    it(colors.map(([type]) => type).join(" "), () => {
      for (const [type, list] of colors) {
        const allFinals = colors
          .map(([_, hexadecimals]) => hexadecimals)
          .flat(2)
          .map((hex) => hexToFinalColor(hex));

        const allTypes = colors.map(([type]) => type);

        for (const color of list) {
          const mainFinal = hexToFinalColor(color);
          expect(classify(allFinals, allTypes)[type].length).toBe(
            colorsByTypes[type]?.length
          );

          expect(
            classify(allFinals, allTypes)[type].map(({ hex }) => hex)
          ).contain(mainFinal.hex);
        }
      }
    });
  }

  // const consoleMock = vi.spyOn(console, "warn").mockImplementation(() => 1);

  // afterAll(() => {
  //   consoleMock.mockReset();
  // });

  // it("test errors", () => {
  //   expect(() => testInputs({ pixels: 0.1 })).toThrowError(/.*/);
  //   expect(() => testInputs({ pixels: "a" as unknown as number })).toThrowError(
  //     /.*/
  //   );
  //   expect(() =>
  //     testInputs({ hueDistance: "a" as unknown as number })
  //   ).toThrowError(/.*/);
  //   expect(() =>
  //     testInputs({ saturationDistance: "a" as unknown as number })
  //   ).toThrowError(/.*/);
  //   expect(() =>
  //     testInputs({ distance: "a" as unknown as number })
  //   ).toThrowError(/.*/);
  //   expect(() =>
  //     testInputs({ lightnessDistance: "a" as unknown as number })
  //   ).toThrowError(/.*/);
  //   expect(() =>
  //     testInputs({
  //       colorValidator: "a" as unknown as () => boolean,
  //     })
  //   ).toThrowError(/.*/);
  //   expect(() =>
  //     testInputs({
  //       colorValidator: 1 as unknown as () => boolean,
  //     })
  //   ).toThrowError(/.*/);
  //   expect(() =>
  //     testInputs({
  //       colorValidator: false as unknown as () => boolean,
  //     })
  //   ).toThrowError(/.*/);
  //   expect(() =>
  //     testInputs({
  //       defaultColors: 1 as unknown as true,
  //     })
  //   ).toThrowError(/.*/);
  //   expect(() =>
  //     testInputs({
  //       defaultColors: "a" as unknown as true,
  //     })
  //   ).toThrowError(/.*/);
  // });

  // it("test warnings", () => {
  //   testInputs({ pixels: -1 });
  //   testInputs({ distance: -1 });
  //   testInputs({ distance: 2 });
  //   testInputs({ hueDistance: -1 });
  //   testInputs({ hueDistance: 2 });
  //   testInputs({ lightnessDistance: -1 });
  //   testInputs({ lightnessDistance: 2 });
  //   testInputs({ saturationDistance: -1 });
  //   testInputs({ saturationDistance: 2 });
  //   testInputs({ colorClassifications: ["toto" as "accents"] });
  //   testInputs({
  //     colorClassifications: ["dominants"],
  //     defaultColors: { accents: false } as unknown as { dominants: false },
  //   });
  //   testInputs({
  //     colorClassifications: ["dominants"],
  //     defaultColors: { dominants: -1 },
  //   });
  //   testInputs({
  //     colorClassifications: ["accents"],
  //     defaultColors: { accents: 0xffffff + 1 },
  //   });

  //   expect(consoleMock).toHaveBeenCalledTimes(13);
  // });

  // it("test min", () => {
  //   expect(cleanInputs({ pixels: -1 }).pixels).toBe(1);
  //   expect(cleanInputs({ hueDistance: -1 }).hueDistance).toBe(0);
  //   expect(cleanInputs({ saturationDistance: -1 }).saturationDistance).toBe(0);
  //   expect(cleanInputs({ distance: -1 }).distance).toBe(0);
  //   expect(cleanInputs({ lightnessDistance: -1 }).lightnessDistance).toBe(0);
  // });

  // it("test max", () => {
  //   expect(cleanInputs({ hueDistance: 2 }).hueDistance).toBe(1);
  //   expect(cleanInputs({ saturationDistance: 2 }).saturationDistance).toBe(1);
  //   expect(cleanInputs({ distance: 2 }).distance).toBe(1);
  //   expect(cleanInputs({ lightnessDistance: 2 }).lightnessDistance).toBe(1);
  // });

  // it("default", () => {
  //   expect(cleanInputs({ pixels: null as unknown as number }).pixels).toBe(1);
  // });

  // it("default", () => {
  //   expect(cleanInputs({ pixels: null as unknown as number }).pixels).toBe(1);
  // });

  // describe("Callback colorValidator() default", () => {
  //   it("Accept opacity color", () => {
  //     const { colorValidator } = cleanInputs();
  //     expect(colorValidator(0, 0, 0, 255)).toBe(true);
  //   });

  //   it("Refuse transparent color", () => {
  //     const { colorValidator } = cleanInputs();
  //     expect(colorValidator(0, 0, 0, 200)).toBe(false);
  //   });

  //   it("Non alpha color accepted", () => {
  //     const { colorValidator } = cleanInputs();
  //     expect(colorValidator(0, 0, 0)).toBe(true);
  //   });
  // });
});
