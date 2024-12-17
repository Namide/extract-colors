import { deltaE } from "../color/FinalColor";
import type { PartialClassified } from "../types/Classified";
import { ColorClassification, FinalColor } from "../types/Color";

type OptionalFinalColor<Type extends ColorClassification> = {
  [type in Type]?: FinalColor[];
};

type FullFinalColor<Type extends ColorClassification> = {
  [type in Type]: FinalColor[];
};

export function classify<Type extends ColorClassification>(
  refinedColors: FinalColor[],
  colorClassifications: Type[]
): PartialClassified<Type> {
  const COOLWARM_LIMITS = [0.2, 0.944] as const;
  const DARKLIGHT_LIMITS = [0.5, 0.5] as const;

  const classified: PartialClassified<ColorClassification> = {
    list: refinedColors,
    ...(colorClassifications.reduce((obj, type) => {
      obj[type] = [];
      return obj;
    }, {} as OptionalFinalColor<ColorClassification>) as FullFinalColor<ColorClassification>),
  };

  const dominantsAccents = getDominantsAccentsSlow(
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
            (color) => color.hsl[2] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dominantsDark":
        classified[type].push(
          ...dominantsAccents[0].filter(
            (color) => color.hsl[2] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "accents":
        classified[type].push(...dominantsAccents[1]);
        break;
      case "accentsLight":
        classified[type].push(
          ...dominantsAccents[1].filter(
            (color) => color.hsl[2] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "accentsDark":
        classified[type].push(
          ...dominantsAccents[1].filter(
            (color) => color.hsl[2] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "dullests":
        classified[type].push(
          ...refinedColors.filter((color) => color.hsl[1] < 0.35)
        );
        break;
      case "dullestsLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) => color.hsl[1] < 0.35 && color.hsl[2] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dullestsDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) => color.hsl[1] < 0.35 && color.hsl[2] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "vivids":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hsl[1] > 0.65 && color.hsl[2] > 0.35 && color.hsl[2] < 0.65
          )
        );
        break;
      case "vividsLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hsl[1] > 0.65 &&
              color.hsl[2] > DARKLIGHT_LIMITS[1] &&
              color.hsl[2] < 0.65
          )
        );
        break;
      case "vividsDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hsl[1] > 0.65 &&
              color.hsl[2] > 0.35 &&
              color.hsl[2] < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "lightests":
        classified[type].push(
          ...refinedColors.filter((color) => color.hsl[2] > DARKLIGHT_LIMITS[1])
        );
        break;
      case "darkests":
        classified[type].push(
          ...refinedColors.filter((color) => color.hsl[2] < DARKLIGHT_LIMITS[0])
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
              color.hsl[0] < COOLWARM_LIMITS[0] ||
              (color.hsl[0] > COOLWARM_LIMITS[1] &&
                color.hsl[2] > DARKLIGHT_LIMITS[1])
          )
        );
        break;
      case "warmestDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hsl[0] < COOLWARM_LIMITS[0] ||
              (color.hsl[0] > COOLWARM_LIMITS[1] &&
                color.hsl[2] < DARKLIGHT_LIMITS[0])
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
              color.hsl[0] > COOLWARM_LIMITS[0] ||
              (color.hsl[0] > COOLWARM_LIMITS[1] &&
                color.hsl[2] > DARKLIGHT_LIMITS[1])
          )
        );
        break;
      case "coolestDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hsl[0] > COOLWARM_LIMITS[0] ||
              (color.hsl[0] > COOLWARM_LIMITS[1] &&
                color.hsl[2] < DARKLIGHT_LIMITS[0])
          )
        );
        break;
    }
  }

  return classified as PartialClassified<Type>;
}

function getDominantsAccentsSlow(
  refinedColors: FinalColor[],
  types: ColorClassification[]
): [FinalColor[], FinalColor[]] {
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

  const flatDistances: { a: FinalColor; b: FinalColor; dist: number }[] = [];
  for (let i = 0; i < refinedColors.length; i++) {
    for (let j = i + 1; j < refinedColors.length; j++) {
      const a = refinedColors[i];
      const b = refinedColors[j];
      flatDistances.push({
        a,
        b,
        dist: deltaE(a, b),
      });
    }
  }

  const { a: aBase, b: bBase } = flatDistances.sort(
    (a, b) => b.dist - a.dist
  )[0];

  const list: [FinalColor[], FinalColor[]] = [[], []];
  for (const color of refinedColors) {
    const distA = deltaE(color, aBase); //, key);
    const distB = deltaE(color, bBase); //, key);

    if (distA > distB) {
      list[1].push(color);
    } else {
      list[0].push(color);
    }
  }

  if (list[0].length > list[1].length) {
    return list;
  }

  return [list[1], list[0]];
}
