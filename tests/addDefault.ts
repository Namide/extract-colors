import { describe, it, expect } from "vitest";
import { ColorClassification } from "../src/types/Color";
import type { AddDefaultOptions } from "../src/types/Options";
import { addDefault } from "../src/process/addDefault";
import { hexToDetailledColor } from "../src/color/DetailledColor";

type Example<Type extends ColorClassification> = {
  name: string;
  input: {
    [type in Type]?: number[];
  } & {
    list: number[];
  };
  default: AddDefaultOptions<Type>["defaultColors"];
  output: {
    [type in Type]?: number[];
  };
};

const COLORS_LIST_TEST: Example<ColorClassification>[] = [
  {
    name: "Simple sort",
    // Input for tests
    input: {
      list: [0xff0000, 0x0077ff, 0x44ffff],
    },
    // Defaults for tests
    default: {},
    // Results for tests comparison
    output: {
      warmest: [0xff0000],
      coolest: [0x0077ff, 0x44ffff, 0x004080],
      coolestLight: [0x44ffff],
      coolestMidtone: [0x0077ff],
      coolestDark: [0x004080],
    },
  },
];

describe("addDefault", () => {
  for (const colorsByTypes of COLORS_LIST_TEST) {
    const types = Object.keys(colorsByTypes.input).filter(
      (key) => key !== "list"
    ) as ColorClassification[];

    it(colorsByTypes.name, () => {
      const classifiedInput = {
        ...types.reduce((obj, type) => ({ ...obj, [type]: [] }), {} as any),
        list: colorsByTypes.input.list.map((hex) => hexToDetailledColor(hex)),
      };

      const classifiedOutput = addDefault(
        classifiedInput,
        colorsByTypes.default
      );

      (
        Object.keys(colorsByTypes.input).filter(
          (key) => key !== "list"
        ) as ColorClassification[]
      ).forEach((type) => {
        expect(classifiedOutput[type].length).toBe(
          classifiedInput[type]?.length
        );

        const outputColors = (colorsByTypes.output[type] || []).map(
          (hex) => hexToDetailledColor(hex).hex
        );
        classifiedOutput[type].map(({ hex }) =>
          expect(outputColors).contain(hex)
        );
      });
    });
  }
});
