import fetch from "node-fetch";
import { Pokemon } from "../../models/pokemon.model";

import { appendFile } from "fs";
import { join } from "path";

import { from, lastValueFrom, EMPTY } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";

const downloadImage: (pokemon: Pokemon) => Promise<void> = (pokemon: Pokemon) =>
  new Promise((resolve, reject) => {
    let url = "";
    let filename = "";
    if (pokemon.Form == "Normal") {
      url = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.Id}.png`;
      filename = join(process.cwd(), "images", `${pokemon.Id}.png`);
    } else if (pokemon.Form == "Alola") {
      url = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.Id}-alola.png`;
      filename = join(process.cwd(), "images", `${pokemon.Id}-alola.png`);
    } else if (pokemon.Form == "Galarian") {
      url = `https://images.gameinfo.io/pokemon/256/${pokemon.Id.toString().padStart(3, "0")}-31.webp`;
      filename = join(process.cwd(), "images", `${pokemon.Id}-galarian.webp`);
    } else if (pokemon.Form == "Incarnate") {
      url = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.Id}.png`;
      filename = join(process.cwd(), "images", `${pokemon.Id}-galarian.webp`);
    } else if (pokemon.Form == "Therian") {
      url = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.Id}-therian.png`;
      filename = join(process.cwd(), "images", `${pokemon.Id}-galarian.webp`);
    } else {
      url = `https://pokeres.bastionbot.org/images/pokemon/${pokemon.Id}-${pokemon.Form.toLocaleLowerCase()}.png`;
      filename = join(process.cwd(), "images", `${pokemon.Id}-${pokemon.Form.toLocaleLowerCase()}.webp`);
    }

    console.log(`Start - ${pokemon.Id}`);

    fetch(url)
      .then((response) => response.arrayBuffer())
      .then((data) => {
        appendFile(filename, Buffer.from(data), (err) => {
          if (err) {
            console.log(`Failed - ${pokemon.Id}`);

            reject();
          } else {
            console.log(`Success - ${pokemon.Id}`);
            resolve();
          }
        });
      })
      .catch(() => {
        console.log(`Failed - ${pokemon.Id} - ${pokemon.Form}`);
        reject();
      });
  });

const downloadImages: (pokemons: Array<Pokemon>) => Promise<any> = async (pokemons: Array<Pokemon>) => {
  const $ = from(pokemons.filter((i) => !["Normal"].includes(i.Form))).pipe(
    mergeMap((i) => from(downloadImage(i)).pipe(catchError(() => EMPTY)), 2)
  );
  return lastValueFrom($);
};

export { downloadImages };
