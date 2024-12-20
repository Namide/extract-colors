// import { deltaE, hslDist } from "../color/DetailledColor";
import type { PartialClassified } from "../types/Classified";
import { ColorClassification, DetailledColor } from "../types/Color";

type OptionalDetailledColor<Type extends ColorClassification> = {
  [type in Type]?: DetailledColor[];
};

type FullDetailledColor<Type extends ColorClassification> = {
  [type in Type]: DetailledColor[];
};

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

  const dominantsAccents = getDominantsAccents1(
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
          ...refinedColors.filter((color) => color.ecHsl[1] < 0.35)
        );
        break;
      case "dullestsLight":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.ecHsl[1] < 0.35 && color.lab[0] > DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dullestsMidtone":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.ecHsl[1] < 0.35 &&
              color.lab[0] >= DARKLIGHT_LIMITS[0] &&
              color.lab[0] <= DARKLIGHT_LIMITS[1]
          )
        );
        break;
      case "dullestsDark":
        classified[type].push(
          ...refinedColors.filter(
            (color) =>
              color.ecHsl[1] < 0.35 && color.lab[0] < DARKLIGHT_LIMITS[0]
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

// function getDominantsAccents1(
//   refinedColors: DetailledColor[],
//   types: ColorClassification[]
// ): [DetailledColor[], DetailledColor[]] {
//   if (
//     !types.reduce(
//       (isFound, type) =>
//         isFound ||
//         [
//           "dominants",
//           "accents",
//           "dominantsLight",
//           "dominantsDark",
//           "accentsLight",
//           "accentsDark",
//         ].indexOf(type) > -1,
//       false
//     )
//   ) {
//     return [[], []] as const;
//   }

//   // Avoid calculation if 0 or 1 color
//   if (refinedColors.length < 2) {
//     return [[], []] as const;
//   }

//   const flatDistances: {
//     a: DetailledColor;
//     b: DetailledColor;
//     dist1: number;
//     dist2: [number, number, number];
//   }[] = [];
//   for (let i = 0; i < refinedColors.length; i++) {
//     for (let j = i + 1; j < refinedColors.length; j++) {
//       const a = refinedColors[i];
//       const b = refinedColors[j];
//       flatDistances.push({
//         a,
//         b,
//         dist1: deltaE(a, b),
//         dist2: hslDist(a, b),
//       });
//     }
//   }

//   // const groups: [DetailledColor[], DetailledColor[]][] = [];
//   // for (const key of [0, 1, 2]) {
//   //   groups[key] = [[], []];
//   //   const min = Math.min(...refinedColors.map((color) => color.ecHsl[key]));
//   //   const max = Math.max(...refinedColors.map((color) => color.ecHsl[key]));
//   //   const limit = (max - min) / 2;

//   //   for (const color of refinedColors) {
//   //     // ...
//   //   }
//   // }

//   const { a: aBase, b: bBase } = flatDistances.sort(
//     (a, b) => b.dist1 - a.dist1
//   )[0];

//   // console.log("----------------------------");

//   // console.log(
//   //   flatDistances.map((fd) => ({
//   //     a: fd.a.hex,
//   //     b: fd.b.hex,
//   //     dist1: fd.dist1,
//   //     dist2: fd.dist2,
//   //   }))
//   // );

//   // console.log("- BASES -------------------");
//   // console.log(aBase, bBase);

//   const list: [DetailledColor[], DetailledColor[]] = [[], []];
//   for (const color of refinedColors) {
//     const distA = deltaE(color, aBase); //, key);
//     const distB = deltaE(color, bBase); //, key);

//     if (distA > distB) {
//       list[1].push(color);
//     } else {
//       list[0].push(color);
//     }
//   }

//   if (list[0].length > list[1].length) {
//     return list;
//   }

//   return [list[1], list[0]];
// }

// function getDominantsAccents3(
//   refinedColors: DetailledColor[],
//   types: ColorClassification[]
// ): [DetailledColor[], DetailledColor[]] {
//   if (
//     !types.reduce(
//       (isFound, type) =>
//         isFound ||
//         [
//           "dominants",
//           "accents",
//           "dominantsLight",
//           "dominantsDark",
//           "accentsLight",
//           "accentsDark",
//         ].indexOf(type) > -1,
//       false
//     )
//   ) {
//     return [[], []] as const;
//   }

//   // Avoid calculation if 0 or 1 color
//   if (refinedColors.length < 2) {
//     return [[], []] as const;
//   }
// }

function getDominantsAccents1(
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

  const choices: { key: 0 | 1 | 2; limit: number; power: number }[] = [];
  for (const [key, partCount] of [
    [0, 20], // 10
    [1, 10], // 5
    [2, 10], // 5
  ] as const) {
    const sortedColors = [...refinedColors].sort(
      (a, b) => a.ecHsl[key] - b.ecHsl[key]
    );

    const blocks = new Array(partCount).fill(0);
    for (const color of sortedColors) {
      blocks[
        Math.min(Math.floor(color.ecHsl[key] * partCount), partCount - 1)
      ] += color.count;
    }

    const blocksStats: {
      key: 0 | 1 | 2;
      power: number;
      limit: number;
    }[] = [];
    for (let i = 0; i < partCount; i++) {
      const beforeCount =
        key === 0
          ? blocks[(i + partCount - 1) % partCount]
          : blocks[i - 1] || 0;
      const afterCount =
        key === 0 ? blocks[(i + 1) % partCount] : blocks[i + 1] || 0;

      blocksStats.push({
        key,
        power: blocks[i] - (beforeCount + afterCount),
        limit: (i + 0.5) / partCount,
      });
    }

    const [blockA, blockB] = blocksStats.sort((a, b) => b.power - a.power);

    choices.push({
      key,
      limit: (blockA.limit + blockB.limit) / 2,
      power: blockA.power * blockB.power,
    });
  }
  const [choice] = choices.sort((a, b) => b.power - a.power);

  // console.log(choices);

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
