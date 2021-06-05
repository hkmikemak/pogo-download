import "./modules/array";

import { promises as fs } from "fs";

const { writeFile, mkdir } = fs;
import { join } from "path";

import { downloadMetadata } from "./modules/downloadMetadata";
import { downloadImages } from "./modules/downloadImages";
import { Pokemon } from "./models/pokemon.model";
import { downloadTypeEffectiveness } from "./modules/downloadTypeEffectiveness";

// declare module "*.json" {
//   const value: any;
//   export default value;
// }

(async () => {
  try {
    await mkdir(join(process.cwd(), "data"));
  } catch {}
  try {
    await mkdir(join(process.cwd(), "images"));
  } catch {}

  const resultTypeEffectiveness = await downloadTypeEffectiveness();
  await writeFile(join(process.cwd(), "data", "types.json"), JSON.stringify(resultTypeEffectiveness, null, 2));

  const resultMetadata = await downloadMetadata();
  await writeFile(join(process.cwd(), "data", "pokemons.json"), JSON.stringify(resultMetadata, null, 2));
  //const result = eval("require")(join(process.cwd(), "data", "pokemons.json")) as Pokemon[];
  //await downloadImages(result);
  // result
  //   .filter(
  //     (i) =>
  //       !i.Forms.includes("Normal") &&
  //       !i.Forms.includes("Alola") &&
  //       !i.Forms.includes("Galarian") &&
  //       !i.Forms.includes("Incarnate") &&
  //       !i.Forms.includes("Therian") &&
  //       !i.Forms.includes("Black") &&
  //       !i.Forms.includes("White")
  //   )
  //   .map((i) => {
  //     console.log(`${i.Id} - ${i.Name} - ${i.Forms.join(", ")}`);
  //   });
})();
