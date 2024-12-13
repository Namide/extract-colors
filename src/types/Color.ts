export interface RGB {
  red: number;
  green: number;
  blue: number;
}

export interface FinalColor {
  hex: string;
  red: number;
  green: number;
  blue: number;
  area: number;
  hue: number;
  saturation: number;
  lightness: number;
  intensity: number;
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
