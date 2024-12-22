// import { deltaE, hslDist } from "../color/DetailledColor";
import type { PartialClassified } from "../types/Classified";
import { ColorClassification, DetailledColor } from "../types/Color";

type OptionalDetailledColor<Type extends ColorClassification> = Partial<
  Record<Type, DetailledColor[]>
>;

type FullDetailledColor<Type extends ColorClassification> = Record<
  Type,
  DetailledColor[]
>;

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
          ...refinedColors.filter((color) => color.ecHsl[1] < 0.3)
        );
        break;
      case "dullestsLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.ecHsl[1] < 0.3 && color.lab[0] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dullestsMidtone":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.ecHsl[1] < 0.3 &&
              color.lab[0] >= DARKLIGHT_LIMITS[0] &&
              color.lab[0] <= DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dullestsDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.ecHsl[1] < 0.3 && color.lab[0] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "vivids":
        classified[type].push(
          ...refinedColors.filter(
            (color) => color.ecHsl[1] > 0.5 && color.ecHsl[2] > 0.35
          )
        );
        break;
      case "vividsLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.ecHsl[1] > 0.5 && color.lab[0] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "vividsMidtone":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.ecHsl[1] > 0.5 &&
              color.lab[0] >= DARKLIGHT_LIMITS[0] &&
              color.lab[0] <= DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "vividsDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.ecHsl[1] > 0.5 && color.lab[0] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "lightests":
        classified[type].push(
          ...refinedColors.filter((color) => color.lab[0] > DARKLIGHT_LIMITS[1])
        );
        break;
      case "midtones":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.lab[0] >= DARKLIGHT_LIMITS[0] &&
              color.lab[0] <= DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "darkests":
        classified[type].push(
          ...refinedColors.filter((color) => color.lab[0] < DARKLIGHT_LIMITS[0])
        );
        break;
      case "warmest":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hsl[0] < COOLWARM_LIMITS[0] ||
              color.hsl[0] > COOLWARM_LIMITS[1]
          )
        );
        break;
      case "warmestLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              (color.hsl[0] < COOLWARM_LIMITS[0] ||
                color.hsl[0] > COOLWARM_LIMITS[1]) &&
              color.lab[0] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "warmestMidtone":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              (color.hsl[0] < COOLWARM_LIMITS[0] ||
                color.hsl[0] > COOLWARM_LIMITS[1]) &&
              color.lab[0] >= DARKLIGHT_LIMITS[0] &&
              color.lab[0] <= DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "warmestDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              (color.hsl[0] < COOLWARM_LIMITS[0] ||
                color.hsl[0] > COOLWARM_LIMITS[1]) &&
              color.lab[0] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "coolest":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hsl[0] > COOLWARM_LIMITS[0] &&
              color.hsl[0] < COOLWARM_LIMITS[1]
          )
        );
        break;
      case "coolestLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              (color.hsl[0] > COOLWARM_LIMITS[0] ||
                color.hsl[0] > COOLWARM_LIMITS[1]) &&
              color.lab[0] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "coolestMidtone":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              (color.hsl[0] > COOLWARM_LIMITS[0] ||
                color.hsl[0] > COOLWARM_LIMITS[1]) &&
              color.lab[0] >= DARKLIGHT_LIMITS[0] &&
              color.lab[0] <= DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "coolestDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              (color.hsl[0] > COOLWARM_LIMITS[0] ||
                color.hsl[0] > COOLWARM_LIMITS[1]) &&
              color.lab[0] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
    }
  }

  return classified as PartialClassified<Type>;
}

function distanceByType(a: DetailledColor, b: DetailledColor, key: 0 | 1 | 2) {
  if (key === 0) {
    const dist = Math.abs(a.ecHsl[key] - b.ecHsl[key]);
    return dist <= 0.5
      ? dist
      : a.ecHsl[key] < b.ecHsl[key]
      ? a.ecHsl[key] + 1 - b.ecHsl[key]
      : b.ecHsl[key] + 1 - a.ecHsl[key];
  }

  return Math.abs(a.ecHsl[key] - b.ecHsl[key]);
}

function getBestKeyLimit(colors: DetailledColor[]) {
  const groups: {
    list: DetailledColor[];
    average: number;
    score: number;
    key: 0 | 1 | 2;
  }[][] = [[], [], []];

  for (const key of [0, 1, 2] as const) {
    const distance = key === 0 ? 0.1 : 0.25;
    const colorList = [...colors];
    while (colorList.length > 0) {
      const color = colorList.sort((a, b) => b.count - a.count).shift()!;

      const group = {
        key,
        list: [color],
        average: color.ecHsl[key],
        score: color.area,
      };

      const nears = colorList.filter(
        (c) => distanceByType(c, color, key) <= distance
      );

      for (const near of nears) {
        colorList.splice(colorList.indexOf(near), 1);
        group.list.push(near);
        group.score += near.area;
      }

      groups[key].push(group);
    }
  }

  groups.sort((a, b) => {
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
      a[0].key === 0 ||
      b[0].key === 0 ||
      (a.length === 2 && b.length === 2)
    ) {
      return a[0].key === 0 ? -1 : 1;
    }

    if (a.length > 1 && b.length > 1) {
      return (
        Math.abs(b[0].average - b[1].average) -
        Math.abs(a[0].average - a[1].average)
      );
    }

    return (
      b.reduce((total, item) => Math.abs(total - item.score), 0) -
      a.reduce((total, item) => Math.abs(total - item.score), 0)
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

  const choice = getBestKeyLimit(refinedColors);

  if (choice.key === 0) {
    const limits = [choice.limit, (choice.limit + 0.5) % 1].sort(
      (a, b) => a - b
    );
    return [
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
  }

  return [
    refinedColors.filter((color) => color.ecHsl[choice.key] <= choice.limit),
    refinedColors.filter((color) => color.ecHsl[choice.key] > choice.limit),
  ].sort(
    (listA, listB) =>
      listB.reduce((total, color) => total + color.area, 0) -
      listA.reduce((total, color) => total + color.area, 0)
  ) as [DetailledColor[], DetailledColor[]];
}
