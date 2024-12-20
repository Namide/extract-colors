import {
  rgbColorToDetailledColor,
  deltaE,
  hexToDetailledColor,
} from "../color/DetailledColor";
import RGBColor from "../color/RGBColor";
import type { Classified, PartialClassified } from "../types/Classified";
import { type ColorClassification, type DetailledColor } from "../types/Color";
import type { AddDefaultOptions } from "../types/Options";

export function addDefault<Type extends ColorClassification>(
  classifiedColors: PartialClassified<Type>,
  defaultColors: AddDefaultOptions<Type>["defaultColors"]
): Classified<Type> {
  if (defaultColors === false) {
    return classifiedColors as Classified<Type>;
  }

  for (const type of Object.keys(classifiedColors) as Type[]) {
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
            classifiedColors as PartialClassified<ColorClassification>
          )
        );
      }
    }
  }

  return classifiedColors as Classified<Type>;
}

function getDefaults(
  type: ColorClassification,
  classifiedColors: PartialClassified<ColorClassification>
) {
  const BASE_DEFAULT = {
    dominants: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort((a, b) => b.area - a.area);
      if (colors[0]) {
        return colors[0];
      }

      const accent = ccp.accents && ccp.accents[0];
      if (accent) {
        return HSLToDetailledColor(1 - accent.hsl[0], 0.3, 1 - accent.hsl[2]);
      }

      return colors[0] || hexToDetailledColor(0x0077ff);
    },

    accents: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort((a, b) => b.hsl[1] - a.hsl[1]);
      if (colors[0]) {
        return colors[0];
      }

      const dominant = ccp.dominants && ccp.dominants[0];
      if (dominant) {
        return RGBToDetailledColor(1 - dominant.hsl[0], 1, 0.5);
      }

      return hexToDetailledColor(0xff7700);
    },

    dullests: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort(
        (a, b) => a.hsl[1] - b.hsl[1] || b.area - a.area
      );
      return colors[0] || hexToDetailledColor(0x777777);
    },

    vivids: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort(
        (a, b) => b.hsl[1] - a.hsl[1] || b.area - a.area
      );
      return colors[0] || hexToDetailledColor(0xff7700);
    },

    lightests: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort(
        (a, b) => b.hsl[2] - a.hsl[2] || b.area - a.area
      );
      return colors[0] || hexToDetailledColor(0xffffff);
    },

    midtones: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort(
        (a, b) =>
          Math.abs(a.hsl[2] - 0.5) - Math.abs(b.hsl[2] - 0.5) || b.area - a.area
      );
      return colors[0] || hexToDetailledColor(0x808080);
    },

    darkests: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort(
        (a, b) => a.hsl[2] - b.hsl[2] || b.area - a.area
      );
      return colors[0] || hexToDetailledColor(0x000000);
    },

    warmest: (ccp: PartialClassified<ColorClassification>) => {
      const warmColor = hexToDetailledColor(0xff7700);
      const colors = [...ccp.list].sort(
        (a, b) => deltaE(a, warmColor) - deltaE(b, warmColor) || b.area - a.area
      );
      return colors[0] || warmColor;
    },

    coolest: (ccp: PartialClassified<ColorClassification>) => {
      const coolColor = hexToDetailledColor(0x0077ff);
      const colors = [...ccp.list].sort(
        (a, b) => deltaE(a, coolColor) - deltaE(b, coolColor) || b.area - a.area
      );
      return colors[0] || coolColor;
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
        return getLighter(color || BASE_DEFAULT[type](ccp));
      },
      [`${type}Midtone`]: (ccp: PartialClassified<ColorClassification>) => {
        const color = ccp[type] && ccp[type][0];
        return getMidtone(color || BASE_DEFAULT[type](ccp));
      },
      [`${type}Dark`]: (ccp: PartialClassified<ColorClassification>) => {
        const color = ccp[type] && ccp[type][0];
        return getDarker(color || BASE_DEFAULT[type](ccp));
      },
    };
  }, {} as { [type in AddedTypes]: (ccp: PartialClassified<ColorClassification>) => DetailledColor });

  return { ...BASE_DEFAULT, ...ADDED_DEFAULT }[type](classifiedColors);
}

function getMidtone(color: DetailledColor) {
  return HSLToDetailledColor(color.hsl[0], color.hsl[1], 0.5);
}

function getLighter(color: DetailledColor, gap = 0.1) {
  return HSLToDetailledColor(
    color.hsl[0],
    color.hsl[1],
    Math.min(1, Math.max(0.6, color.hsl[2] + gap))
  );
}

function getDarker(color: DetailledColor, gap = 0.1) {
  return HSLToDetailledColor(
    color.hsl[0],
    color.hsl[1],
    Math.min(0.4, Math.max(1, color.hsl[2] - gap))
  );
}

function RGBToDetailledColor(r: number, g: number, b: number) {
  return rgbColorToDetailledColor(new RGBColor(r, g, b, 0), 1);
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
