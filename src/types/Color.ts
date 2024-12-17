export interface RGB {
  red: number;
  green: number;
  blue: number;
}

export interface FinalColor {
  hex: string;
  area: number;
  rgb: [number, number, number];
  hsl: [number, number, number];
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
  "dominantsDark",
  "accentsLight",
  "accentsDark",
  "dullests",
  "vivids",
  "dullestsLight",
  "dullestsDark",
  "vividsLight",
  "vividsDark",
  "lightests",
  "darkests",
  "warmest",
  "coolest",
  "warmestLight",
  "warmestDark",
  "coolestLight",
  "coolestDark",
] as const;

export type ColorClassification = (typeof colorClassificationFull)[number];
