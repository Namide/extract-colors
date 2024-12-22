export interface RGB {
  red: number;
  green: number;
  blue: number;
}

export interface DetailledColor {
  hex: number;
  hexString: string;
  area: number;
  rgb: [number, number, number];
  hsl: [number, number, number];
  ecHsl: [number, number, number];
  lab: [number, number, number];
  count: number;
}

/**
 * List of classifies types.
 * Order is used in classify() and addDefault() functions
 */
export const colorClassificationFull = [
  "dominants",
  "accents",
  "dominantsLight",
  "dominantsMidtone",
  "dominantsDark",
  "accentsLight",
  "accentsMidtone",
  "accentsDark",
  "dullests",
  "vivids",
  "dullestsLight",
  "dullestsMidtone",
  "dullestsDark",
  "vividsLight",
  "vividsMidtone",
  "vividsDark",
  "lightests",
  "midtones",
  "darkests",
  "warmest",
  "coolest",
  "warmestLight",
  "warmestMidtone",
  "warmestDark",
  "coolestLight",
  "coolestMidtone",
  "coolestDark",
] as const;

export type ColorClassification = (typeof colorClassificationFull)[number];
