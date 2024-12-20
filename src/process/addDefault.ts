import {
  rgbColorToDetailledColor,
  deltaE,
  hexToDetailledColor,
  getLAB,
} from "../color/DetailledColor";
import RGBColor from "../color/RGBColor";
import type { Classified, PartialClassified } from "../types/Classified";
import {
  colorClassificationFull,
  type ColorClassification,
  type DetailledColor,
} from "../types/Color";
import type { AddDefaultOptions } from "../types/Options";

/**
 * Inject static or calculated values to the classifiedColors if color list is an empty array.
 */
export function addDefault<Type extends ColorClassification>(
  classifiedColors: PartialClassified<Type>,
  defaultColors: AddDefaultOptions<Type>["defaultColors"],
  defaultMainColor: number
): Classified<Type> {
  if (defaultColors === false) {
    return classifiedColors as Classified<Type>;
  }

  for (const type of Object.keys(classifiedColors).filter(
    (type) => colorClassificationFull.indexOf(type as Type) > -1
  ) as Type[]) {
    if (!!classifiedColors[type] && classifiedColors[type].length < 1) {
      const defaultValue =
        defaultColors instanceof Object && defaultColors[type];
      if (defaultValue && Number(defaultValue) === defaultValue) {
        classifiedColors[type].push(hexToDetailledColor(defaultValue));
      } else if (defaultValue && defaultValue instanceof Function) {
        const color: number = defaultValue(classifiedColors);
        classifiedColors[type].push(hexToDetailledColor(color));
      } else if (defaultValue !== false || defaultColors === true) {
        classifiedColors[type].push(
          getDefaults(
            type,
            classifiedColors as PartialClassified<ColorClassification>,
            defaultMainColor
          )
        );
      }
    }
  }

  return classifiedColors as Classified<Type>;
}

function getDefaults(
  type: ColorClassification,
  classifiedColors: PartialClassified<ColorClassification>,
  defaultMainColor: number
) {
  const BASE_DEFAULT = {
    dominants: (ccp: PartialClassified<ColorClassification>) => {
      const [color] = [...ccp.list].sort((a, b) => b.area - a.area);
      if (color) {
        return color;
      }

      const accent = ccp.accents && ccp.accents[0];
      if (accent) {
        return HSLToDetailledColor(1 - accent.hsl[0], 0.3, 1 - accent.hsl[2]);
      }

      return color || hexToDetailledColor(defaultMainColor);
    },

    accents: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort((a, b) => b.hsl[1] - a.hsl[1]);
      if (colors[0]) {
        return colors[0];
      }

      const {
        hsl: [h, s, l],
      } = (ccp.dominants && ccp.dominants[0]) || BASE_DEFAULT.dominants(ccp);

      if (s > 0.25) {
        return HSLToDetailledColor((0.5 + h) % 1, s, l);
      }

      if (l < 0.4 || l > 0.6) {
        return HSLToDetailledColor(h, s, 1 - l);
      }

      return HSLToDetailledColor(h, 1 - s, l);
    },

    dullests: (ccp: PartialClassified<ColorClassification>) => {
      const [color] = [...ccp.list].sort(
        (a, b) => a.hsl[1] - b.hsl[1] || b.area - a.area
      );

      if (color) {
        return color;
      }

      const {
        hsl: [h, _, l],
      } = (ccp.dominants && ccp.dominants[0]) || BASE_DEFAULT.dominants(ccp);

      return HSLToDetailledColor(h, 0, l);
    },

    vivids: (ccp: PartialClassified<ColorClassification>) => {
      const [color] = [...ccp.list].sort(
        (a, b) => b.hsl[1] - a.hsl[1] || b.area - a.area
      );

      if (color) {
        return color;
      }

      const {
        hsl: [h, _, l],
      } = (ccp.dominants && ccp.dominants[0]) || BASE_DEFAULT.dominants(ccp);

      return HSLToDetailledColor(h, 1, l);
    },

    lightests: (ccp: PartialClassified<ColorClassification>) => {
      const [color] = [...ccp.list].sort(
        (a, b) => b.hsl[2] - a.hsl[2] || b.area - a.area
      );

      if (color) {
        return color;
      }

      const { hsl } =
        (ccp.dominants && ccp.dominants[0]) || BASE_DEFAULT.dominants(ccp);

      return getLighter(hsl);
    },

    midtones: (ccp: PartialClassified<ColorClassification>) => {
      const [color] = [...ccp.list].sort(
        (a, b) =>
          Math.abs(a.hsl[2] - 0.5) - Math.abs(b.hsl[2] - 0.5) || b.area - a.area
      );

      if (color) {
        return color;
      }

      const { hsl } =
        (ccp.dominants && ccp.dominants[0]) || BASE_DEFAULT.dominants(ccp);

      return getMidtone(hsl);
    },

    darkests: (ccp: PartialClassified<ColorClassification>) => {
      const [color] = [...ccp.list].sort(
        (a, b) => a.hsl[2] - b.hsl[2] || b.area - a.area
      );

      if (color) {
        return color;
      }

      const { hsl } =
        (ccp.dominants && ccp.dominants[0]) || BASE_DEFAULT.dominants(ccp);

      return getDarker(hsl);
    },

    warmest: (ccp: PartialClassified<ColorClassification>) => {
      const warmColorHex = 0xff7700;
      const red = (warmColorHex >> 16) & 255;
      const green = (warmColorHex >> 8) & 255;
      const blue = warmColorHex & 255;
      const warmHsl = getLAB(red, green, blue);

      const [color] = [...ccp.list].sort(
        (a, b) =>
          deltaE(a.lab, warmHsl) - deltaE(b.lab, warmHsl) || b.area - a.area
      );

      if (color) {
        return color;
      }

      const {
        hsl: [_, s, l],
      } = (ccp.dominants && ccp.dominants[0]) || BASE_DEFAULT.dominants(ccp);

      return HSLToDetailledColor(0.04, s, l);
    },

    coolest: (ccp: PartialClassified<ColorClassification>) => {
      const coolColorHex = 0x0077ff;
      const red = (coolColorHex >> 16) & 255;
      const green = (coolColorHex >> 8) & 255;
      const blue = coolColorHex & 255;
      const coolHsl = getLAB(red, green, blue);

      const [color] = [...ccp.list].sort(
        (a, b) =>
          deltaE(a.lab, coolHsl) - deltaE(b.lab, coolHsl) || b.area - a.area
      );

      if (color) {
        return color;
      }

      const {
        hsl: [_, s, l],
      } = (ccp.dominants && ccp.dominants[0]) || BASE_DEFAULT.dominants(ccp);

      return HSLToDetailledColor(0.26, s, l);
    },
  };

  const midTypes = [
    "dominants",
    "accents",
    "dullests",
    "vivids",
    "warmest",
    "coolest",
  ] as const;

  type AddedTypes =
    | `${(typeof midTypes)[number]}Light`
    | `${(typeof midTypes)[number]}Midtone`
    | `${(typeof midTypes)[number]}Dark`;

  const ADDED_DEFAULT = midTypes.reduce((obj, type) => {
    return {
      ...obj,

      [`${type}Light`]: (ccp: PartialClassified<ColorClassification>) => {
        const color = ccp[type] && ccp[type][0];
        return getLighter((color || BASE_DEFAULT[type](ccp)).hsl);
      },

      [`${type}Midtone`]: (ccp: PartialClassified<ColorClassification>) => {
        const color = ccp[type] && ccp[type][0];
        return getMidtone((color || BASE_DEFAULT[type](ccp)).hsl);
      },

      [`${type}Dark`]: (ccp: PartialClassified<ColorClassification>) => {
        const color = ccp[type] && ccp[type][0];
        return getDarker((color || BASE_DEFAULT[type](ccp)).hsl);
      },
    };
  }, {} as { [type in AddedTypes]: (ccp: PartialClassified<ColorClassification>) => DetailledColor });

  return { ...BASE_DEFAULT, ...ADDED_DEFAULT }[type](classifiedColors);
}

function getMidtone([h, s]: [number, number, number]) {
  return HSLToDetailledColor(h, s, 0.5);
}

function getLighter([h, s, l]: [number, number, number], gap = 0.1) {
  return HSLToDetailledColor(h, s, Math.min(1, Math.max(0.6, l + gap)));
}

function getDarker([h, s, l]: [number, number, number], gap = 0.1) {
  return HSLToDetailledColor(h, s, Math.min(0.4, Math.max(1, l - gap)));
}

function HSLToDetailledColor(h: number, s: number, l: number) {
  return rgbColorToDetailledColor(new RGBColor(...HSLToRGB(h, s, l), 0), 1);
}

// https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
function HSLToRGB(h: number, s: number, l: number) {
  const a = s * Math.min(l, 1 - l);
  const func = (n: number, k = (n + h * 12) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
  return [
    Math.round(func(0) * 255),
    Math.round(func(8) * 255),
    Math.round(func(4) * 255),
  ] as const;
}

// function fastDist(colorA: DetailledColor, colorB: DetailledColor) {
//   return (
//     Math.abs(colorB.red - colorA.red) +
//     Math.abs(colorB.green - colorA.green) +
//     Math.abs(colorB.blue - colorA.blue)
//   );
// }
