import { createFinalColor } from "../color/FinalColor";
import HSLColor from "../color/HSLColor";
import type { Classified, PartialClassified } from "../types/Classified";
import type { ColorClassification, FinalColor } from "../types/Color";
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
      const defaultValue = defaultColors && defaultColors[type];
      if (defaultValue && Number(defaultValue) === defaultValue) {
        classifiedColors[type].push(hexToFinalColor(defaultValue));
      } else if (defaultValue && defaultValue instanceof Function) {
        const color: number = defaultValue(classifiedColors);
        classifiedColors[type].push(hexToFinalColor(color));
      } else if (defaultValue !== false) {
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
  // const DEFAULT_COLORS: Record<
  //   ColorClassification,
  //   (ccp: PartialClassified<Type>) => HSLColor
  // > =
  const DEFAULT = {
    dominants: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort((a, b) => b.area - a.area);
      if (colors[0]) {
        return colors[0];
      }

      const accent = ccp.accents && ccp.accents[0];
      if (accent) {
        return RGBToFinalColor(1 - accent.hue, 0.3, 1 - accent.lightness);
      }

      return colors[0] || hexToFinalColor(0x0077ff);
    },

    accents: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort((a, b) => b.saturation - a.saturation);
      if (colors[0]) {
        return colors[0];
      }

      const dominant = ccp.dominants && ccp.dominants[0];
      if (dominant) {
        return RGBToFinalColor(1 - dominant.hue, 1, 0.5);
      }

      return hexToFinalColor(0xff7700);
    },

    dominantsLight: (ccp: PartialClassified<ColorClassification>) => {
      const dominant = ccp.dominants && ccp.dominants[0];
      return getLighter(dominant || DEFAULT.dominants(ccp));
    },

    dominantsDark: (ccp: PartialClassified<ColorClassification>) => {
      const dominant = ccp.dominants && ccp.dominants[0];
      return getDarker(dominant || DEFAULT.dominants(ccp));
    },

    accentsLight: (ccp: PartialClassified<ColorClassification>) => {
      const accent = ccp.accents && ccp.accents[0];
      return getLighter(accent || DEFAULT.accents(ccp));
    },

    accentsDark: (ccp: PartialClassified<ColorClassification>) => {
      const accent = ccp.accents && ccp.accents[0];
      return getDarker(accent || DEFAULT.accents(ccp));
    },

    dullests: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort(
        (a, b) => a.saturation - b.saturation || b.area - a.area
      );
      return colors[0] || hexToFinalColor(0x777777);
    },

    vivids: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort(
        (a, b) => b.saturation - a.saturation || b.area - a.area
      );
      return colors[0] || hexToFinalColor(0xff7700);
    },

    dullestsLight: (ccp: PartialClassified<ColorClassification>) => {
      const dullest = ccp.dullests && ccp.dullests[0];
      return getLighter(dullest || DEFAULT.dullests(ccp));
    },

    dullestsDark: (ccp: PartialClassified<ColorClassification>) => {
      const dullest = ccp.dullests && ccp.dullests[0];
      return getDarker(dullest || DEFAULT.dullests(ccp));
    },

    vividsLight: (ccp: PartialClassified<ColorClassification>) => {
      const vivid = ccp.vivids && ccp.vivids[0];
      return getLighter(vivid || DEFAULT.vivids(ccp));
    },

    vividsDark: (ccp: PartialClassified<ColorClassification>) => {
      const vivid = ccp.vivids && ccp.vivids[0];
      return getDarker(vivid || DEFAULT.vivids(ccp));
    },

    lightests: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort(
        (a, b) => b.lightness - a.lightness || b.area - a.area
      );
      return colors[0] || hexToFinalColor(0xffffff);
    },

    darkests: (ccp: PartialClassified<ColorClassification>) => {
      const colors = [...ccp.list].sort(
        (a, b) => a.lightness - b.lightness || b.area - a.area
      );
      return colors[0] || hexToFinalColor(0x000000);
    },

    warmest: (ccp: PartialClassified<ColorClassification>) => {
      const warmColor = hexToFinalColor(0xff7700);
      const colors = [...ccp.list].sort(
        (a, b) =>
          fastDist(a, warmColor) - fastDist(b, warmColor) || b.area - a.area
      );
      return colors[0] || warmColor;
    },

    coolest: (ccp: PartialClassified<ColorClassification>) => {
      const coolColor = hexToFinalColor(0x0077ff);
      const colors = [...ccp.list].sort(
        (a, b) =>
          fastDist(a, coolColor) - fastDist(b, coolColor) || b.area - a.area
      );
      return colors[0] || coolColor;
    },

    warmestLight: (ccp: PartialClassified<ColorClassification>) => {
      const warm = ccp.warmest && ccp.warmest[0];
      return getLighter(warm || DEFAULT.warmest(ccp));
    },

    warmestDark: (ccp: PartialClassified<ColorClassification>) => {
      const warm = ccp.warmest && ccp.warmest[0];
      return getDarker(warm || DEFAULT.warmest(ccp));
    },

    coolestLight: (ccp: PartialClassified<ColorClassification>) => {
      const cool = ccp.coolest && ccp.coolest[0];
      return getLighter(cool || DEFAULT.coolest(ccp));
    },

    coolestDark: (ccp: PartialClassified<ColorClassification>) => {
      const cool = ccp.coolest && ccp.coolest[0];
      return getDarker(cool || DEFAULT.coolest(ccp));
    },
  };

  return DEFAULT[type](classifiedColors);
}

function getLighter(color: FinalColor, gap = 0.1) {
  return HSLToFinalColor(
    color.hue,
    color.saturation,
    Math.min(1, Math.max(0.6, color.lightness + gap))
  );
}

function getDarker(color: FinalColor, gap = 0.1) {
  return HSLToFinalColor(
    color.hue,
    color.saturation,
    Math.min(0.4, Math.max(1, color.lightness - gap))
  );
}

// function hexToRGB(hex: number) {
//   return [(hex >> 16) & 255, (hex >> 8) & 255, hex & 255] as const;
// }

function hexToFinalColor(hex: number) {
  const r = (hex >> 16) & 255;
  const g = (hex >> 8) & 255;
  const b = hex & 255;
  return createFinalColor(new HSLColor(r, g, b, 0), 1);
}

function RGBToFinalColor(r: number, g: number, b: number) {
  return createFinalColor(new HSLColor(r, g, b, 0), 1);
}

function HSLToFinalColor(h: number, s: number, l: number) {
  return createFinalColor(new HSLColor(...HSLToRGB(h, s, l), 0), 1);
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

function fastDist(colorA: FinalColor, colorB: FinalColor) {
  return (
    Math.abs(colorB.red - colorA.red) +
    Math.abs(colorB.green - colorA.green) +
    Math.abs(colorB.blue - colorA.blue)
  );
}
