import { describe, it, expect } from "vitest";
import { ColorClassification } from "../src/types/Color";
import type { AddDefaultOptions } from "../src/types/Options";
import { addDefault } from "../src/process/addDefault";
import { hexToDetailledColor } from "../src/color/DetailledColor";

const PINK = hexToDetailledColor(0xff0077);
const ORANGE = hexToDetailledColor(0xff7700);

type Example<Type extends ColorClassification> = {
  name: string;
  input: {
    [type in Type]?: number[];
  } & {
    list: number[];
  };
  default: AddDefaultOptions<Type>["defaultColors"];
  mainColor: number;
  output: {
    [type in Type]?: number[];
  };
};

const COLORS_LIST_TEST: Example<ColorClassification>[] = [
  {
    name: "Simple sort from warm/cool colors",
    // Input for tests
    input: {
      list: [0xff0000, 0x0077ff, 0x44ffff],
      // warmest: [],
      // coolest: [],
      // coolestLight: [],
      // coolestMidtone: [],
      // coolestDark: [],
    },
    // Main color
    mainColor: 0xffffff,
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
  // {
  //   name: "Generate from main default color",
  //   // Input for tests
  //   input: {
  //     list: [],
  //   },
  //   // Main color
  //   mainColor: 0xff0077,
  //   // Defaults for tests
  //   default: {},
  //   // Results for tests comparison
  //   output: {
  //     dominants: [0xff0077],
  //   },
  // },
];

describe("addDefault", () => {
  it("Default disabled", () => {
    const classifiedOutput = addDefault<"dominants">(
      {
        list: [ORANGE],
        dominants: [],
      },
      false,
      0xff0077
    );

    expect(classifiedOutput.dominants.length).toBe(0);
  });

  it("Default type disabled", () => {
    const classifiedOutput = addDefault<"dominants">(
      {
        list: [ORANGE],
        dominants: [],
      },
      {
        dominants: false,
      },
      0xff0077
    );

    expect(classifiedOutput.dominants.length).toBe(0);
  });

  it("Default type enabled and get from list", () => {
    const classifiedOutput = addDefault<"dominants">(
      {
        list: [ORANGE],
        dominants: [],
      },
      {
        dominants: true,
      },
      0xff0077
    );

    expect(classifiedOutput.dominants.length).toBe(1);
    expect(classifiedOutput.dominants[0].hex).toBe(ORANGE.hex);
  });

  it("Default type enabled and get from default", () => {
    const classifiedOutput = addDefault<"dominants">(
      {
        list: [],
        dominants: [],
      },
      {
        dominants: true,
      },
      0xff0077
    );

    expect(classifiedOutput.dominants.length).toBe(1);
    expect(classifiedOutput.dominants[0].hex).toBe(PINK.hex);
  });

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
        colorsByTypes.default,
        colorsByTypes.mainColor
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
