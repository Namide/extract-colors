import { describe, it, expect } from "vitest";
import {
  ColorClassification,
  colorClassificationFull,
  DetailledColor,
} from "../src/types/Color";
import type { AddDefaultOptions } from "../src/types/Options";
import { addDefault } from "../src/process/addDefault";
import {
  hexToDetailledColor,
  rgbColorToDetailledColor,
} from "../src/color/DetailledColor";
import RGBColor from "../src/color/RGBColor";
import { Classified, PartialClassified } from "../src/types/Classified";

const PINK = hexToDetailledColor(0xff0077);
const ORANGE = hexToDetailledColor(0xff7700);

interface Example<Type extends ColorClassification> {
  name: string;
  input: Partial<Record<Type, number[]>> & {
    list: number[];
  };
  default: AddDefaultOptions<Type>["defaultColors"];
  mainColor: number;
}

const COLORS_LIST_TEST: Example<ColorClassification>[] = [
  // {
  //   name: "Simple sort from warm/cool colors",
  //   // Input for tests
  //   input: {
  //     list: [],
  //     // Types empty auto created if undefined
  //     warmest: [],
  //     coolest: [],
  //     coolestLight: [],
  //     coolestMidtone: [],
  //     coolestDark: [],
  //   },
  //   // Main color
  //   mainColor: 0xff0000,
  //   // Defaults for tests
  //   default: {},
  // },
];

const getFullEmptyList = () => ({
  list: [],
  accents: [],
  accentsDark: [],
  accentsLight: [],
  accentsMidtone: [],
  darkests: [],
  dominants: [],
  dominantsDark: [],
  dominantsLight: [],
  dominantsMidtone: [],
  dullests: [],
  dullestsDark: [],
  dullestsLight: [],
  dullestsMidtone: [],
  lightests: [],
  midtones: [],
  vivids: [],
  vividsDark: [],
  vividsLight: [],
  vividsMidtone: [],
  warmestDark: [],
  warmestLight: [],
  warmestMidtone: [],
  warmest: [],
  coolest: [],
  coolestLight: [],
  coolestMidtone: [],
  coolestDark: [],
});

const COUNT_COLORS_TESTS = 5;
for (let r = 0; r <= COUNT_COLORS_TESTS; r++) {
  for (let g = 0; g <= COUNT_COLORS_TESTS; g++) {
    for (let b = 0; b <= COUNT_COLORS_TESTS; b++) {
      const color = rgbColorToDetailledColor(
        new RGBColor(
          Math.round((r * 255) / COUNT_COLORS_TESTS),
          Math.round((g * 255) / COUNT_COLORS_TESTS),
          Math.round((b * 255) / COUNT_COLORS_TESTS)
        ),
        1
      );
      COLORS_LIST_TEST.push({
        name: `Main color test (${color.hexString})`,
        // Input for tests
        input: getFullEmptyList(),
        // Main color
        mainColor: color.hex,
        // Defaults for tests
        default: {},
      });
    }
  }
}

describe("addDefault", () => {
  for (const colorsByTypes of COLORS_LIST_TEST) {
    const types = Object.keys(colorsByTypes.input).filter(
      (key) => key !== "list"
    ) as ColorClassification[];

    it(colorsByTypes.name, () => {
      const classifiedInput = {
        ...types.reduce(
          (obj, type) => ({
            ...obj,
            [type]: (colorsByTypes.input[type] || []).map((hex) =>
              hexToDetailledColor(hex)
            ),
          }),
          {} as PartialClassified<ColorClassification>
        ),
        list: colorsByTypes.input.list.map((hex) => hexToDetailledColor(hex)),
      };

      const classifiedOutput = addDefault(
        classifiedInput,
        colorsByTypes.default,
        colorsByTypes.mainColor
      );

      fullColortest(
        Object.keys(colorsByTypes.input).filter(
          (key) => key !== "list"
        ) as ColorClassification[],
        classifiedOutput
      );
    });
  }

  it("With color in list", () => {
    const input = {
      ...getFullEmptyList(),
      list: [ORANGE],
    };
    const classifiedOutput = addDefault<"dominants" | "accents">(
      input,
      true,
      PINK.hex
    );

    expect(classifiedOutput.dominants.length).toBe(1);
    expect(classifiedOutput.dominants[0].hex).toBe(ORANGE.hex);

    fullColortest(
      Object.keys(input).filter(
        (key) => key !== "list"
      ) as ColorClassification[],
      classifiedOutput
    );
  });

  it("Default disabled", () => {
    const classifiedOutput = addDefault<"dominants">(
      {
        list: [ORANGE],
        dominants: [],
      },
      false,
      PINK.hex
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
      PINK.hex
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
      PINK.hex
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
      PINK.hex
    );

    expect(classifiedOutput.dominants.length).toBe(1);
    expect(classifiedOutput.dominants[0].hex).toBe(PINK.hex);
  });

  it("Default values are calbacks", () => {
    const defaultColors1 = colorClassificationFull.reduce(
      (obj, key) => ({
        ...obj,
        [key]: Math.round(Math.random() * 0xffffff),
      }),
      {} as Record<ColorClassification, number>
    );

    const defaultColorsCallbacks: Partial<
      Record<ColorClassification, () => number>
    > = {};
    for (const key of colorClassificationFull) {
      defaultColorsCallbacks[key] = () => defaultColors1[key];
    }

    const classifiedOutput = addDefault(
      getFullEmptyList(),
      defaultColorsCallbacks,
      ORANGE.hex
    );

    for (const key of colorClassificationFull) {
      expect(classifiedOutput[key].length).toBe(1);
      expect(classifiedOutput[key][0].hex).toBe(defaultColors1[key]);
    }
  });

  it("Default values are uint colors", () => {
    const defaultColors = colorClassificationFull.reduce(
      (obj, key) => ({
        ...obj,
        [key]: Math.round(Math.random() * 0xffffff),
      }),
      {} as Partial<Record<ColorClassification, number>>
    );

    const out = addDefault(getFullEmptyList(), defaultColors, PINK.hex);
    for (const key of colorClassificationFull) {
      expect(out[key].length).toBe(1);
      expect(out[key][0].hex).toBe(defaultColors[key]);
    }
  });

  it("Default values are true", () => {
    const defaultColors = colorClassificationFull.reduce(
      (obj, key) => ({
        ...obj,
        [key]: true,
      }),
      {} as Record<ColorClassification, true>
    );

    const out = addDefault(getFullEmptyList(), defaultColors, PINK.hex);

    fullColortest(
      Object.keys(out).filter((key) => key !== "list") as ColorClassification[],
      out
    );
  });
});

// ---------------
//     HELPERS
// ---------------

function isWarm(color: DetailledColor) {
  expect(color.hsl[0] <= 0.19 || color.hsl[0] >= 0.88).toBe(true);
}

function isCool(color: DetailledColor) {
  expect(color.hsl[0]).toBeLessThan(0.88);
  expect(color.hsl[0]).toBeGreaterThan(0.19);
}

function isLight(color: DetailledColor) {
  expect(color.hsl[2]).toBeGreaterThanOrEqual(0.6);
}

function isDark(color: DetailledColor) {
  expect(color.hsl[2]).toBeLessThanOrEqual(0.4);
}

function isMidtone(color: DetailledColor) {
  expect(color.hsl[2]).toBeGreaterThan(0.4);
  expect(color.hsl[2]).toBeLessThan(0.6);
}

function isVivid(color: DetailledColor) {
  expect(color.hsl[1]).toBeGreaterThanOrEqual(0.6);
}

function isDullest(color: DetailledColor) {
  expect(color.hsl[1]).toBeLessThanOrEqual(0.4);
}

function fullColortest<Type extends ColorClassification>(
  types: ColorClassification[],
  classifiedOutput: Classified<Type>
) {
  types.forEach((type) => {
    expect(classifiedOutput[type].length).toBe(1);

    const [color] = classifiedOutput[type];

    expect(color.hex >= 0 && color.hex <= 0xffffff).toBe(true);

    switch (type) {
      case "accentsDark":
        isDark(color);
        break;
      case "accentsLight":
        isLight(color);
        break;
      case "accentsMidtone":
        isMidtone(color);
        break;
      case "coolest":
        isCool(color);
        break;
      case "coolestLight":
        isCool(color);
        isLight(color);
        break;
      case "coolestDark":
        isCool(color);
        isDark(color);
        break;
      case "coolestMidtone":
        isCool(color);
        isMidtone(color);
        break;
      case "dominantsDark":
        isDark(color);
        break;
      case "dominantsLight":
        isLight(color);
        break;
      case "dominantsMidtone":
        isMidtone(color);
        break;
      case "dullests":
        isDullest(color);
        break;
      case "dullestsLight":
        isDullest(color);
        isLight(color);
        break;
      case "dullestsDark":
        isDullest(color);
        isDark(color);
        break;
      case "dullestsMidtone":
        isDullest(color);
        isMidtone(color);
        break;
      case "vivids":
        isVivid(color);
        break;
      case "vividsLight":
        isVivid(color);
        isLight(color);
        break;
      case "vividsDark":
        isVivid(color);
        isDark(color);
        break;
      case "vividsMidtone":
        isVivid(color);
        isMidtone(color);
        break;
      case "warmest":
        isWarm(color);
        break;
      case "warmestLight":
        isWarm(color);
        isLight(color);
        break;
      case "warmestDark":
        isWarm(color);
        isDark(color);
        break;
      case "warmestMidtone":
        isWarm(color);
        isMidtone(color);
        break;
      case "lightests":
        isLight(color);
        break;
      case "darkests":
        isDark(color);
        break;
      case "midtones":
        isMidtone(color);
        break;
    }
  });
}
