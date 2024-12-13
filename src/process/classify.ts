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
  types: Type[]
): PartialClassified<Type> {
  const COOLWARM_LIMITS = [0.2, 0.944] as const;
  const DARKLIGHT_LIMITS = [0.5, 0.5] as const;

  const classified: PartialClassified<ColorClassification> = {
    list: refinedColors,
    ...(types.reduce((obj, type) => {
      obj[type] = [];
      return obj;
    }, {} as OptionalFinalColor<ColorClassification>) as FullFinalColor<ColorClassification>),
  };

  const dominantsAccents = getDominantsAccents(refinedColors, types);

  for (const type of types) {
    switch (type) {
      case "dominants":
        classified[type].push(...dominantsAccents[0]);
        break;
      case "dominantsLight":
        classified[type].push(
          ...dominantsAccents[0].filter(
            (color) => color.lightness > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dominantsDark":
        classified[type].push(
          ...dominantsAccents[0].filter(
            (color) => color.lightness < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "accents":
        classified[type].push(...dominantsAccents[1]);
        break;
      case "accentsLight":
        classified[type].push(
          ...dominantsAccents[1].filter(
            (color) => color.lightness > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "accentsDark":
        classified[type].push(
          ...dominantsAccents[1].filter(
            (color) => color.lightness < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "dullests":
        classified[type].push(
          ...refinedColors.filter((color) => color.saturation < 0.35)
        );
        break;
      case "dullestsLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.saturation < 0.35 && color.lightness > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dullestsDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.saturation < 0.35 && color.lightness < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "vivids":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.saturation > 0.65 &&
              color.lightness > 0.35 &&
              color.lightness < 0.65
          )
        );
        break;
      case "vividsLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.saturation > 0.65 &&
              color.lightness > DARKLIGHT_LIMITS[1] &&
              color.lightness < 0.65
          )
        );
        break;
      case "vividsDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.saturation > 0.65 &&
              color.lightness > 0.35 &&
              color.lightness < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "lightests":
        classified[type].push(
          ...refinedColors.filter(
            (color) => color.lightness > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "darkests":
        classified[type].push(
          ...refinedColors.filter(
            (color) => color.lightness < DARKLIGHT_LIMITS[0]
          )
        );
        break;
      case "warmest":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hue < COOLWARM_LIMITS[0] || color.hue > COOLWARM_LIMITS[1]
          )
        );
        break;
      case "warmestLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hue < COOLWARM_LIMITS[0] ||
              (color.hue > COOLWARM_LIMITS[1] &&
                color.lightness > DARKLIGHT_LIMITS[1])
          )
        );
        break;
      case "warmestDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hue < COOLWARM_LIMITS[0] ||
              (color.hue > COOLWARM_LIMITS[1] &&
                color.lightness < DARKLIGHT_LIMITS[0])
          )
        );
        break;
      case "coolest":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hue > COOLWARM_LIMITS[0] && color.hue < COOLWARM_LIMITS[1]
          )
        );
        break;
      case "coolestLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hue > COOLWARM_LIMITS[0] ||
              (color.hue > COOLWARM_LIMITS[1] &&
                color.lightness > DARKLIGHT_LIMITS[1])
          )
        );
        break;
      case "coolestDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.hue > COOLWARM_LIMITS[0] ||
              (color.hue > COOLWARM_LIMITS[1] &&
                color.lightness < DARKLIGHT_LIMITS[0])
          )
        );
        break;
    }
  }

  return classified as PartialClassified<Type>;
}

function getDominantsAccents(
  refinedColors: FinalColor[],
  types: ColorClassification[]
): [FinalColor[], FinalColor[]] {
  if (
    (
      [
        "dominants",
        "accents",
        "dominantsLight",
        "dominantsDark",
        "accentsLight",
        "accentsDark",
      ] as const
    ).findIndex((type) => types.indexOf(type) > -1) === -1
  ) {
    return [[], []] as const;
  }

  // Avoid calculation if 0 or 1 color
  if (refinedColors.length < 2) {
    return [[], []] as const;
  }

  const results: (
    | {
        key: "saturation" | "lightness";
        power: number;
        limit: number;
      }
    | {
        key: "hue";
        power: number;
        limits: [number, number];
      }
  )[] = [];

  for (const key of ["hue", "saturation", "lightness"] as const) {
    const sortedColors = [...refinedColors].sort((a, b) => a[key] - b[key]);

    // Get minimal count colors
    const interlaced = sortedColors
      .filter((_, index) => index < sortedColors.length - 1)
      .map((before, index) => {
        const after = sortedColors[index + 1];
        // 0.0001 to avoid 0 division
        const dist = 0.0001 + after[key] - before[key];
        return {
          before: index,
          after: index + 1,
          value: (before[key] + after[key]) / 2,
          amount: (before[key] + after[key]) / dist,
        };
      });

    // Add between first and last if 360 degres values
    if (key === "hue") {
      const after = sortedColors[0];
      const before = sortedColors[sortedColors.length - 1];
      // 0.0001 to avoid 0 division
      const dist = 0.0001 + Math.abs(after[key] - (before[key] - 1));
      interlaced.push({
        before: sortedColors.length - 1,
        after: 0,
        value: (after[key] + before[key]) / 2,
        amount: (before[key] + after[key]) / dist,
      });
    }

    interlaced.sort((a, b) => a.amount - b.amount);

    if (key === "hue") {
      results.push({
        key,
        power: (interlaced[0].amount + interlaced[1].amount) / 2,
        limits: [interlaced[0].value, interlaced[1].value],
      });
    } else {
      results.push({
        key,
        power: interlaced[0].amount,
        limit: interlaced[0].value,
      });
    }
  }

  const [splitChoice] = results.sort((a, b) => a.power - b.power);

  if (splitChoice.key === "hue") {
    splitChoice.limits.sort((a, b) => a - b);
    return [
      refinedColors.filter(
        (color) =>
          color[splitChoice.key] > splitChoice.limits[0] &&
          color[splitChoice.key] < splitChoice.limits[1]
      ),
      refinedColors.filter(
        (color) =>
          color[splitChoice.key] > splitChoice.limits[1] ||
          color[splitChoice.key] < splitChoice.limits[0]
      ),
    ].sort(
      (listA, listB) =>
        listB.reduce((total, color) => total + color.area, 0) -
        listA.reduce((total, color) => total + color.area, 0)
    ) as [FinalColor[], FinalColor[]];
  }

  return [
    refinedColors.filter((color) => color[splitChoice.key] < splitChoice.limit),
    refinedColors.filter((color) => color[splitChoice.key] > splitChoice.limit),
  ].sort(
    (listA, listB) =>
      listB.reduce((total, color) => total + color.area, 0) -
      listA.reduce((total, color) => total + color.area, 0)
  ) as [FinalColor[], FinalColor[]];
}
