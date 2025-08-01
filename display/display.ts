import { ColorClassification } from "../src/types/Color";
import { extractColors } from "../src/main";
// import src from './img-proxy.jpg?url'

// console.log(src)

const RAND = 256;
const pictures = [
  // src,
  ...[
    "https://photomaniac.fr/wp-content/uploads/2023/01/pexels-pixabay-121472.jpg",
    "https://photomaniac.fr/wp-content/uploads/2023/01/claudio-fonte-8nGY2SMLEaU-unsplash.jpg",
    "https://photomaniac.fr/wp-content/uploads/2023/01/etienne-girardet-Xh6BpT-1tXo-unsplash.jpg",
    "https://photomaniac.fr/wp-content/uploads/2023/01/maarten-van-den-heuvel-bB51b45Aa7Q-unsplash.jpg",
    "https://photomaniac.fr/wp-content/uploads/2023/01/luis-vidal-qIcS7y79UbA-unsplash-1-575x1024.jpg",
    "https://photomaniac.fr/wp-content/uploads/2023/01/paolo-bendandi-a7Uui3XAlnc-unsplash.jpg",
    "https://photomaniac.fr/wp-content/uploads/2023/01/vladzimir-nikitsin-wY1GIiiTRak-unsplash.jpg",
    "https://photomaniac.fr/wp-content/uploads/2023/01/pexels-petr-ganaj-4055745.jpg",
    "https://photomaniac.fr/wp-content/uploads/2023/01/pexels-soloman-soh-1557183.jpg",
    "https://photomaniac.fr/wp-content/uploads/2023/01/pexels-alexander-grey-1153895.jpg",
    // "https://images.iphonephotographyschool.com/13531/560/Color-Composition-iPhone-Photography-16.jpg",
    // "https://images.iphonephotographyschool.com/13629/560/Color-Composition-iPhone-Photography-22.jpg",
    // "https://www.creative-photographer.com/wp-content/uploads/2017/08/color-contrast-1.jpg",
    // "https://www.creative-photographer.com/wp-content/uploads/2017/08/color-contrast-4.jpg",
    // "https://images.squarespace-cdn.com/content/v1/51a39504e4b093105c265c24/8b0cd54a-b940-40d6-aaca-0b6c400e1a55/autumn-color-arrowtown-nz.jpg?format=320w",
  ].map((src) => `/img-proxy?url=${src}`),
  ...new Array(10)
    .fill(1)
    .map((_, i) => RAND + i)
    .map((num) => `https://picsum.photos/seed/${num}/320/320`),
];

(async () => {
  for (const src of pictures) {
    const block = document.createElement("article");

    const img = new Image(320, 320);
    img.crossOrigin = "anonymous";
    img.src = src;
    block.appendChild(img);

    document.body.querySelector("main")?.appendChild(block);

    // #cd1408 #7a3418

    const classifiedColors = await extractColors(src, {
      crossOrigin: "anonymous",

      // fastDistance: 0.001,
      // distance: 0.25,
      pixels: 64000,

      // colorValidator: (red, green, blue, alpha = 255) => alpha > 250,

      colorClassifications: ["accents", "dominants"],
      // defaultColors: {
      //   warmest: 0xff0000,
      //   coolest: 0x0000ff,
      // },
    });

    for (const type of Object.keys(classifiedColors) as (
      | ColorClassification
      | "list"
    )[]) {
      if (type !== "list") {
        block.innerHTML += `<br><strong>${type}</strong><br>
          <div class="color-list">
          ${classifiedColors[type]
            .map(
              (color) =>
                `<span class="color" style="background:${
                  color.hexString
                }" data-tooltip="${(color.area * 100).toFixed(2)}%"></span>`
            )
            .join("")}
          </div>`;
      }
    }
  }

  // for (const colorsByTypes of COLORS_LIST_TEST) {
  //   const colors = Object.entries(colorsByTypes) as [
  //     ColorClassification,
  //     number[]
  //   ][];

  //   const allFinals = colors
  //     .map(([, hexadecimals]) => hexadecimals)
  //     .flat(2)
  //     .map((hex) => hexToDetailledColor(hex, 1, 2));

  //   const allTypes = colors.map(([type]) => type);
  //   const classified = classify(allFinals, allTypes);

  //   console.log("---");
  //   console.log(colors);
  //   console.log(allTypes);

  //   for (const [type, list] of colors) {
  //     const article = document.createElement("article");
  //     article.innerHTML += "<strong>Base</strong><br>";
  //     article.innerHTML += type + " ";

  //     for (const color of list) {
  //       const mainFinal = hexToDetailledColor(color, 1, 2);

  //       const colorElement = mainFinal.hexString;
  //       article.innerHTML += colorElement + " ";

  //       // expect(classified[type].length).toBe(colorsByTypes[type]?.length);
  //       // expect(classified[type].map(({ hex }) => hex)).contain(mainFinal.hex);
  //     }

  //     article.innerHTML += "<hr>";
  //     document.body.querySelector("main")?.appendChild(article);
  //     // console.log(classified[type]);
  //   }
  // }
})();

// for (const colorsByTypes of COLORS_LIST_TEST) {
//   const colors = Object.entries(colorsByTypes) as [
//     ColorClassification,
//     number[]
//   ][];

//   const allFinals = colors
//     .map(([, hexadecimals]) => hexadecimals)
//     .flat(2)
//     .map((hex) => hexToDetailledColor(hex, 1, 2));

//   const allTypes = colors.map(([type]) => type);
//   const classified = classify(allFinals, allTypes);

//   console.log("---");
//   console.log(colors);
//   console.log(allTypes);

//   for (const [type, list] of colors) {
//     const article = document.createElement("article");
//     article.innerHTML += "<strong>Base</strong><br>";
//     article.innerHTML += type + " ";

//     for (const color of list) {
//       const mainFinal = hexToDetailledColor(color, 1, 2);

//       const colorElement = mainFinal.hexString;
//       article.innerHTML += colorElement + " ";

//       // expect(classified[type].length).toBe(colorsByTypes[type]?.length);
//       // expect(classified[type].map(({ hex }) => hex)).contain(mainFinal.hex);
//     }

//     article.innerHTML += "<hr>";
//     document.body.querySelector("main")?.appendChild(article);
//     // console.log(classified[type]);
//   }
// }
