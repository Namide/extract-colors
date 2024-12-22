import { describe, it, expect } from "vitest";

import { classify } from "../src/process/classify";
import { hexToDetailledColor } from "../src/color/DetailledColor";
import { ColorClassification } from "../src/types/Color";

const COLORS_LIST_TEST: Partial<Record<ColorClassification, number[]>>[] = [
  {
    warmest: [0xff0000, 0xffff00],
    coolest: [0x00ffff, 0x11ff00, 0xff77ff],
  },
  {
    warmestLight: [0xdc753a, 0xe4d06b, 0xff9100, 0xff7700, 0xffff00, 0xd2f010],
    warmestMidtone: [0xff0000, 0x7a721c],
    warmestDark: [0x6c3f13, 0x8e3025],
    coolestLight: [0x8b8be4, 0xabb9ff, 0x5acd2d, 0xf285f2],
    coolestMidtone: [0x4582f3, 0x469f23],
    coolestDark: [0x1b4f6d, 0x003319, 0x9f239b],
  },
  {
    vivids: [0xff0000, 0xffff00, 0x00ff00, 0xff00ff],
    dullests: [0x888888, 0x000000, 0xffffff, 0xf0d0e0],
  },
  {
    vividsLight: [0xf6e440, 0x01fc12],
    vividsMidtone: [0xd42192, 0x8f5eff, 0xfc010a],
    vividsDark: [0x0046d0, 0x9d107a],
    dullestsLight: [0xb4b7d0, 0xffffff, 0xc5d0b4],
    dullestsMidtone: [0x968d73, 0x789673, 0x9b6f93],
    dullestsDark: [0x514651, 0x4e4c3a, 0x201020, 0x152103, 0x240017],
  },
  {
    lightests: [0xffffff, 0xd4f2d6, 0xedf3b2, 0x939f25],
    midtones: [0x1a65e8, 0xe81a51],
    darkests: [0x702539, 0x6410c4],
  },
  {
    // Accent/dominant by saturation
    accents: [0xff0000, 0xff7700, 0xffff00, 0xff0077, 0x00ff44],
    dominants: [
      0xcccccc, 0xddeedd, 0xeeffdd, 0xffeeff, 0xccddbb, 0xccddcc, 0xffffff,
      0x322515, 0x232a1d, 0x5d6a53, 0x9b95ac,
    ],
  },
  {
    // Accent/dominant by hue
    accents: [0x35872e, 0x628121, 0x3b864e, 0x3db724, 0x4b915e],
    dominants: [
      0xd7289f, 0xbc43bd, 0xbc4e97, 0xd43d6e, 0xbd3ad2, 0xe061ba, 0xb7248b,
      0xc186b6,
    ],
  },
  {
    // Accent/dominant by hue
    accents: [0xff0000, 0xc65d58, 0xff4747, 0xb30000, 0x850000, 0xed8282],
    dominants: [
      0x0000ff, 0x1111aa, 0x4763ff, 0x0055ee, 0x0a0061, 0x0e008f, 0x351fff,
      0x1f26ff, 0x4b4eaa, 0x4f53c9, 0x41437c, 0xa1a3ce,
    ],
  },
  {
    // Accent/dominant by hue
    accents: [0x092b7b, 0x093b7b, 0x1063d1],
    dominants: [0x64cc14, 0x4fa210, 0x8bec41, 0x58eb33, 0x3ca522],
  },
  {
    // Accent/dominant by lighness
    accents: [0x440000, 0x003300, 0x000055, 0x000000],
    dominants: [0xffffff, 0xddffff, 0xffff66, 0xff99ff, 0x66ffff],
  },
];

describe("classify", () => {
  for (const colorsByTypes of COLORS_LIST_TEST) {
    const colors = Object.entries(colorsByTypes) as [
      ColorClassification,
      number[]
    ][];
    it(colors.map(([type]) => type).join(" "), () => {
      const allFinals = colors
        .map(([, hexadecimals]) => hexadecimals)
        .flat(2)
        .map((hex) => hexToDetailledColor(hex, 1, 2));

      const allTypes = colors.map(([type]) => type);
      const classified = classify(allFinals, allTypes);

      for (const [type, list] of colors) {
        for (const color of list) {
          const mainFinal = hexToDetailledColor(color, 1, 2);
          expect(classified[type].length).toBe(colorsByTypes[type]?.length);
          expect(classified[type].map(({ hex }) => hex)).contain(mainFinal.hex);
        }
      }
    });
  }
});
