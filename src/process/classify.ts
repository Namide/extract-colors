import { deltaE } from "../color/DetailledColor";
import RGBColor from "../color/RGBColor";
import type { PartialClassified } from "../types/Classified";
import { ColorClassification, DetailledColor } from "../types/Color";

type OptionalDetailledColor<Type extends ColorClassification> = Partial<
  Record<Type, DetailledColor[]>
>;

type FullDetailledColor<Type extends ColorClassification> = Record<
  Type,
  DetailledColor[]
>;

const enum ClassificationType {
  Hue = 0,
  Saturation = 1,
  Lightness = 2,
}

export function classify<Type extends ColorClassification>(
  refinedColors: DetailledColor[],
  colorClassifications: Type[]
): PartialClassified<Type> {
  const COOLWARM_LIMITS = [0.2, 0.944] as const;
  const DARKLIGHT_LIMITS = [40, 60] as const;

  const classified: PartialClassified<ColorClassification> = {
    list: refinedColors,
    ...(colorClassifications.reduce((obj, type) => {
      obj[type] = [];
      return obj;
    }, {} as OptionalDetailledColor<ColorClassification>) as FullDetailledColor<ColorClassification>),
  };

  const dominantsAccents = getDominantsAccents(
    refinedColors,
    colorClassifications
  );

  for (const type of colorClassifications) {
    switch (type) {
      case "dominants":
        classified[type].push(...dominantsAccents[0]);
        break;
      case "dominantsLight":
        classified[type].push(
          ...dominantsAccents[0].filter(
            (color) => color.lab[0] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dominantsMidtone":
        classified[type].push(
          ...dominantsAccents[0].filter(
            (color) =>
              color.lab[0] >= DARKLIGHT_LIMITS[0] &&
              color.lab[0] <= DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dominantsDark":
        classified[type].push(
          ...dominantsAccents[0].filter(
            (color) => color.lab[0] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "accents":
        classified[type].push(...dominantsAccents[1]);
        break;
      case "accentsLight":
        classified[type].push(
          ...dominantsAccents[1].filter(
            (color) => color.lab[0] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "accentsMidtone":
        classified[type].push(
          ...dominantsAccents[1].filter(
            (color) =>
              color.lab[0] >= DARKLIGHT_LIMITS[0] &&
              color.lab[0] <= DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "accentsDark":
        classified[type].push(
          ...dominantsAccents[1].filter(
            (color) => color.lab[0] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "dullests":
        classified[type].push(
          ...refinedColors
            .filter((color) => color.ecHsl[1] < 0.3)
            .sort((a, b) => a.ecHsl[1] - b.ecHsl[1])
        );
        break;
      case "dullestsLight":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                color.ecHsl[1] < 0.3 && color.lab[0] > DARKLIGHT_LIMITS[1]
            )
            .sort((a, b) => a.ecHsl[1] - b.ecHsl[1])
        );
        break;
      case "dullestsMidtone":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                color.ecHsl[1] < 0.3 &&
                color.lab[0] >= DARKLIGHT_LIMITS[0] &&
                color.lab[0] <= DARKLIGHT_LIMITS[1]
            )
            .sort((a, b) => a.ecHsl[1] - b.ecHsl[1])
        );
        break;
      case "dullestsDark":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                color.ecHsl[1] < 0.3 && color.lab[0] < DARKLIGHT_LIMITS[0]
            )
            .sort((a, b) => a.ecHsl[1] - b.ecHsl[1])
        );
        break;
      case "vivids":
        classified[type].push(
          ...refinedColors
            .filter((color) => color.ecHsl[1] > 0.5 && color.ecHsl[2] > 0.35)
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "vividsLight":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                color.ecHsl[1] > 0.5 && color.lab[0] > DARKLIGHT_LIMITS[1]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "vividsMidtone":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                color.ecHsl[1] > 0.5 &&
                color.lab[0] >= DARKLIGHT_LIMITS[0] &&
                color.lab[0] <= DARKLIGHT_LIMITS[1]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "vividsDark":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                color.ecHsl[1] > 0.5 && color.lab[0] < DARKLIGHT_LIMITS[0]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "lightests":
        classified[type].push(
          ...refinedColors
            .filter((color) => color.lab[0] > DARKLIGHT_LIMITS[1])
            .sort((a, b) => b.ecHsl[2] - a.ecHsl[2])
        );
        break;
      case "midtones":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                color.lab[0] >= DARKLIGHT_LIMITS[0] &&
                color.lab[0] <= DARKLIGHT_LIMITS[1]
            )
            .sort(
              (a, b) => Math.abs(a.ecHsl[2] - 0.5) - Math.abs(b.ecHsl[2] - 0.5)
            )
        );
        break;
      case "darkests":
        classified[type].push(
          ...refinedColors
            .filter((color) => color.lab[0] < DARKLIGHT_LIMITS[0])
            .sort((a, b) => a.ecHsl[2] - b.ecHsl[2])
        );
        break;
      case "warmest":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                color.hsl[0] < COOLWARM_LIMITS[0] ||
                color.hsl[0] > COOLWARM_LIMITS[1]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "warmestLight":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                (color.hsl[0] < COOLWARM_LIMITS[0] ||
                  color.hsl[0] > COOLWARM_LIMITS[1]) &&
                color.lab[0] > DARKLIGHT_LIMITS[1]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "warmestMidtone":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                (color.hsl[0] < COOLWARM_LIMITS[0] ||
                  color.hsl[0] > COOLWARM_LIMITS[1]) &&
                color.lab[0] >= DARKLIGHT_LIMITS[0] &&
                color.lab[0] <= DARKLIGHT_LIMITS[1]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "warmestDark":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                (color.hsl[0] < COOLWARM_LIMITS[0] ||
                  color.hsl[0] > COOLWARM_LIMITS[1]) &&
                color.lab[0] < DARKLIGHT_LIMITS[0]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "coolest":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                color.hsl[0] > COOLWARM_LIMITS[0] &&
                color.hsl[0] < COOLWARM_LIMITS[1]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "coolestLight":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                (color.hsl[0] > COOLWARM_LIMITS[0] ||
                  color.hsl[0] > COOLWARM_LIMITS[1]) &&
                color.lab[0] > DARKLIGHT_LIMITS[1]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "coolestMidtone":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                (color.hsl[0] > COOLWARM_LIMITS[0] ||
                  color.hsl[0] > COOLWARM_LIMITS[1]) &&
                color.lab[0] >= DARKLIGHT_LIMITS[0] &&
                color.lab[0] <= DARKLIGHT_LIMITS[1]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
      case "coolestDark":
        classified[type].push(
          ...refinedColors
            .filter(
              (color) =>
                (color.hsl[0] > COOLWARM_LIMITS[0] ||
                  color.hsl[0] > COOLWARM_LIMITS[1]) &&
                color.lab[0] < DARKLIGHT_LIMITS[0]
            )
            .sort((a, b) => b.ecHsl[1] - a.ecHsl[1])
        );
        break;
    }
  }

  return classified as PartialClassified<Type>;
}

function distanceByType(
  a: DetailledColor,
  b: DetailledColor,
  key: ClassificationType
) {
  if (key === ClassificationType.Hue) {
    return deltaE(a.lab, b.lab);
    // const hueNonModDist = Math.abs(a.ecHsl[key] - b.ecHsl[key]);
    // const hueDist =
    //   hueNonModDist <= 0.5
    //     ? hueNonModDist
    //     : a.ecHsl[key] < b.ecHsl[key]
    //     ? a.ecHsl[key] + 1 - b.ecHsl[key]
    //     : b.ecHsl[key] + 1 - a.ecHsl[key];
    // return hueDist;
  }

  return Math.abs(a.ecHsl[key] - b.ecHsl[key]);
}

/**
 * Keys:
 * - 0: Hue
 * - 1: Saturation
 * - 2: Lightness
 */
function getBestKeyLimit(
  colors: DetailledColor[],
  keys = [0, 1, 2] as ClassificationType[]
) {
  // Each group is create from each color
  // each area is the cumulative area of each colors in the group
  const groups: {
    list: DetailledColor[];
    average: number;
    area: number;
    // score: number;
    key: ClassificationType;
  }[][] = [[], [], []];

  for (const key of keys) {
    const distance = key === ClassificationType.Hue ? 0.1 : 0.25;
    const colorList = [...colors];
    while (colorList.length > 0) {
      const color = colorList
        .sort((a, b) => b.count - a.count)
        .shift() as DetailledColor;

      const group = {
        key,
        list: [color],
        average: color.ecHsl[key],
        area: color.area,
      };

      const nears = colorList.filter(
        (c) => c.hex !== color.hex && distanceByType(c, color, key) <= distance
      );

      for (const near of nears) {
        colorList.splice(colorList.indexOf(near), 1);
        group.list.push(near);
        group.area += near.area;
      }

      groups[key].push(group);
    }
  }

  groups.sort((a, b) => {
    // Best is have 2 lists for the key
    // It's mean 2 groups of colors are splitted for the ClassificationType
    if (a.length === 2 && b.length !== 2) {
      return -1;
    }
    if (b.length === 2 && a.length !== 2) {
      return 1;
    }
    if (a.length > 1 && b.length < 2) {
      return -1;
    }
    if (b.length > 1 && a.length < 2) {
      return 1;
    }

    // Priorize hue
    if (
      a.length > 0 &&
      b.length > 0 &&
      ((a[0].key === ClassificationType.Hue &&
        b[0].key !== ClassificationType.Hue &&
        a.length === 2) ||
        (b[0].key === ClassificationType.Hue &&
          a[0].key !== ClassificationType.Hue &&
          b.length === 2))
    ) {
      return a[0].key === ClassificationType.Hue ? -1 : 1;
    }

    if (a.length > 1 && b.length > 1) {
      return (
        Math.abs(b[0].average - b[1].average) -
        Math.abs(a[0].average - a[1].average)
      );
    }

    return (
      Math.abs(b.reduce((total, item) => total - item.area, 0)) -
      Math.abs(a.reduce((total, item) => total - item.area, 0))
    );
  });

  const pos1 = groups[0][0].average;
  const pos2 = groups[0][1]?.average || groups[0][0].average;

  const limit = (pos1 + pos2) / 2;

  return {
    key: groups[0][0].key,
    limit,
  };
}

function getDominantsAccents(
  refinedColors: DetailledColor[],
  types: ColorClassification[]
): [DetailledColor[], DetailledColor[]] {
  if (
    !types.reduce(
      (isFound, type) =>
        isFound ||
        [
          "dominants",
          "accents",
          "dominantsLight",
          "dominantsDark",
          "accentsLight",
          "accentsDark",
        ].indexOf(type) > -1,
      false
    )
  ) {
    return [[], []] as const;
  }

  // Avoid calculation if 0 or 1 color
  if (refinedColors.length < 2) {
    return [[], []] as const;
  }

  let choice = getBestKeyLimit(refinedColors);

  // Retry if accents is grey colors
  if (
    choice.key === ClassificationType.Saturation &&
    refinedColors
      .filter((color) => color.ecHsl[choice.key] < choice.limit)
      .reduce((total, color) => total + color.count, 0) <
      refinedColors.reduce((total, color) => total + color.count, 0) / 2
  ) {
    choice = getBestKeyLimit(refinedColors, [
      ClassificationType.Hue,
      ClassificationType.Lightness,
    ]);
  }

  let dominant: DetailledColor[];
  let accent: DetailledColor[];

  if (choice.key === 0) {
    // Determined by hue
    const limits = [choice.limit, (choice.limit + 0.5) % 1].sort(
      (a, b) => a - b
    );

    [dominant, accent] = [
      refinedColors.filter(
        (color) =>
          color.ecHsl[choice.key] >= limits[0] &&
          color.ecHsl[choice.key] < limits[1]
      ),
      refinedColors.filter(
        (color) =>
          color.ecHsl[choice.key] >= limits[1] ||
          color.ecHsl[choice.key] < limits[0]
      ),
    ].sort(
      (listA, listB) =>
        listB.reduce((total, color) => total + color.area, 0) -
        listA.reduce((total, color) => total + color.area, 0)
    ) as [DetailledColor[], DetailledColor[]];
  } else {
    [dominant, accent] = [
      refinedColors.filter((color) => color.ecHsl[choice.key] <= choice.limit),
      refinedColors.filter((color) => color.ecHsl[choice.key] > choice.limit),
    ].sort(
      (listA, listB) =>
        listB.reduce((total, color) => total + color.area, 0) -
        listA.reduce((total, color) => total + color.area, 0)
    ) as [DetailledColor[], DetailledColor[]];
  }

  dominant = dominant.sort((a, b) => b.count - a.count);

  if (choice.key === 0) {
    accent.sort(
      (a, b) =>
        b.ecHsl[1] - a.ecHsl[1] - (Math.abs(b.ecHsl[0] - a.ecHsl[0]) % 0.5)
    );
  } else if (choice.key === 1) {
    accent.sort((a, b) => b.ecHsl[choice.key] - a.ecHsl[choice.key]);
  } else {
    const dominantRGB = {
      r: dominant[0].rgb[0],
      g: dominant[0].rgb[0],
      b: dominant[0].rgb[0],
    };

    accent.sort((a, b) => {
      const a2 = { r: a.rgb[0], g: a.rgb[0], b: a.rgb[0] };
      const b2 = { r: b.rgb[0], g: b.rgb[0], b: b.rgb[0] };
      return (
        RGBColor.distance(b2, dominantRGB) - RGBColor.distance(a2, dominantRGB)
      );
    });
  }

  return [dominant, accent];
}
