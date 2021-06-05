import fetch from "node-fetch";
import { ChargedMove } from "../../models/chargedMove.model";
import { FastMove } from "../../models/fastMove.model";
import { Pokemon } from "../../models/pokemon.model";

interface DownloadPokemonMoves {
  charged_moves: string[];
  elite_charged_moves: [];
  elite_fast_moves: [];
  fast_moves: [];
  form: string;
  pokemon_id: number;
  pokemon_name: string;
}

interface DownloadMaxCP {
  form: string;
  max_cp: number;
  pokemon_id: number;
  pokemon_name: string;
}

interface DownloadPokemonEvolution {
  pokemon_id: number;
  pokemon_name: string;
  form: string;
  evolutions: Array<{
    pokemon_id: number;
    pokemon_name: string;
    form: string;
  }>;
}

interface DownloadRelasedPokemon {
  id: number;
  name: string;
}

interface DownloadPokemonStats {
  base_attack: number;
  base_defense: number;
  base_stamina: number;
  form: string;
  pokemon_id: number;
  pokemon_name: string;
}

interface DownloadFastMove {
  duration: number;
  energy_delta: number;
  move_id: number;
  name: string;
  power: number;
  stamina_loss_scaler: number;
  type: string;
}

interface DownloadChargedMove {
  critical_chance?: number;
  duration: number;
  energy_delta: number;
  move_id: number;
  name: string;
  power: number;
  stamina_loss_scaler: number;
  type: string;
  heal_scalar?: number;
}

interface DownloadPokemonTypes {
  form: string;
  pokemon_id: number;
  pokemon_name: string;
  type: string[];
}

// class DownloadHelper {
//   private fetchApi;

//   constructor() {
//     this.fetchApi = fetchAbsolute(fetch)("https://pogoapi.net/");
//   }

//   public downloadJSON = (url: string) => {
//     return this.fetchApi(url).then((response: Response) => response.json());
//   };
// }

const downloadJSON = <T>(url: string) => fetch(url).then((response) => response.json() as Promise<T>);

const downloadMetadata = async () => {
  // const downloadHelper = new DownloadHelper();

  const pokemonNames: {
    [key: number]: DownloadRelasedPokemon;
  } = await downloadJSON("https://pogoapi.net/api/v1/released_pokemon.json");
  const pokemonStats: [DownloadPokemonStats] = await downloadJSON("https://pogoapi.net/api/v1/pokemon_stats.json");
  const allFastMoves: [DownloadFastMove] = await downloadJSON("https://pogoapi.net/api/v1/fast_moves.json");
  const allChargedMoves: [DownloadChargedMove] = await downloadJSON("https://pogoapi.net/api/v1/charged_moves.json");
  const pokemonMaxCP: [DownloadMaxCP] = await downloadJSON("https://pogoapi.net/api/v1/pokemon_max_cp.json");
  const pokemonTypes: [DownloadPokemonTypes] = await downloadJSON("https://pogoapi.net/api/v1/pokemon_types.json");
  const pokemonMovePools: [DownloadPokemonMoves] = await downloadJSON(
    "https://pogoapi.net/api/v1/current_pokemon_moves.json"
  );
  const pokemonEvolutions: [DownloadPokemonEvolution] = await downloadJSON(
    "https://pogoapi.net/api/v1/pokemon_evolutions.json"
  );

  const mappedPokemons = Object.values(pokemonNames)
    .flatMap((i) => {
      return pokemonStats
        .filter((j) => j.pokemon_id == i.id && j.pokemon_name == i.name)
        .map(
          (j) =>
            ({
              Id: j.pokemon_id,
              Name: j.pokemon_name,
              Types: pokemonTypes.find(
                (k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name
              )?.type,
              Form: j.form,
              BaseStats: {
                Attack: pokemonStats.find(
                  (k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name
                )?.base_attack,
                Defense: pokemonStats.find(
                  (k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name
                )?.base_defense,
                Stamina: pokemonStats.find(
                  (k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name
                )?.base_stamina,
              },
              MaxCP: pokemonMaxCP.find(
                (k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name
              )?.max_cp,
              FastMoves: pokemonMovePools
                .find((k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name)
                ?.fast_moves.sort()
                .map((k) => {
                  const fastMove = allFastMoves.find((t) => t.name == k);
                  return {
                    Duration: fastMove?.duration,
                    EnergyDelta: fastMove?.energy_delta,
                    Name: fastMove?.name,
                    Power: fastMove?.power,
                    StaminaLossScaler: fastMove?.stamina_loss_scaler,
                    Type: fastMove?.type,
                  } as FastMove;
                }),
              EliteFastMoves: pokemonMovePools
                .find((k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name)
                ?.elite_fast_moves.sort()
                .map((k) => {
                  const fastMove = allFastMoves.find((t) => t.name == k);
                  return {
                    Duration: fastMove?.duration,
                    EnergyDelta: fastMove?.energy_delta,
                    Name: fastMove?.name,
                    Power: fastMove?.power,
                    StaminaLossScaler: fastMove?.stamina_loss_scaler,
                    Type: fastMove?.type,
                  } as FastMove;
                }),
              ChargedMoves: pokemonMovePools
                .find((k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name)
                ?.charged_moves.sort()
                .map((k) => {
                  const chargedMove = allChargedMoves.find((t) => t.name == k);
                  return {
                    Duration: chargedMove?.duration,
                    EnergyDelta: chargedMove?.energy_delta,
                    Name: chargedMove?.name,
                    Power: chargedMove?.power,
                    StaminaLossScaler: chargedMove?.stamina_loss_scaler,
                    Type: chargedMove?.type,
                    CriticalChance: chargedMove?.critical_chance,
                    HealScalar: chargedMove?.heal_scalar,
                  } as ChargedMove;
                }),
              EliteChargedMoves: pokemonMovePools
                .find((k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name)
                ?.elite_charged_moves.sort()
                .map((k) => {
                  const chargedMove = allChargedMoves.find((t) => t.name == k);
                  return {
                    Duration: chargedMove?.duration,
                    EnergyDelta: chargedMove?.energy_delta,
                    Name: chargedMove?.name,
                    Power: chargedMove?.power,
                    StaminaLossScaler: chargedMove?.stamina_loss_scaler,
                    Type: chargedMove?.type,
                    CriticalChance: chargedMove?.critical_chance,
                    HealScalar: chargedMove?.heal_scalar,
                  } as ChargedMove;
                }),
              Evolutions: [],
              // Evolutions: pokemonEvolutions
              //   .find((k) => k.form == j.form && k.pokemon_id == j.pokemon_id && k.pokemon_name == j.pokemon_name)
              //   ?.evolutions.map((k) => ({
              //     Id: k.pokemon_id,
              //     Name: k.pokemon_name,
              //     Form: k.form,
              //   })),
            } as Pokemon)
        );
    })
    .filter((i) => !["Purified", "Shadow"].includes(i.Form));

  const buildPokemonChain: (i: { Id: number; Name: string; Form: string }[]) => {
    Id: number;
    Name: string;
    Form: string;
  }[][] = (i) => {
    console.log("Current Chain - ", i);
    console.log(`Finding if ${i[i.length - 1].Name} has evolution`);

    const pokemon = pokemonEvolutions.find((j) => j.form == i[i.length - 1].Form && j.pokemon_id == i[i.length - 1].Id);

    if (!pokemon) {
      console.log(`${i[i.length - 1].Name} has no evolution`);
      const result = [i];
      return result;
    } else {
      console.log(`${i[i.length - 1].Name} indeed has evolution`);
      const result = pokemon.evolutions.map((j) => {
        const currentChain = [...i, { Id: j.pokemon_id, Name: j.pokemon_name, Form: j.form }];
        return buildPokemonChain(currentChain).flatMap((k) => [...k]);
      });

      return result;
    }
  };

  const initialEvolition = pokemonEvolutions
    .filter((i) => !["Purified", "Shadow"].includes(i.form))
    .filter(
      (i) => !pokemonEvolutions.some((j) => j.evolutions.some((k) => k.form == i.form && k.pokemon_id == i.pokemon_id))
    );

  console.log(`Pokemon with initial evolution`, initialEvolition);
  const allChains = initialEvolition
    .map((i) => [{ Id: i.pokemon_id, Name: i.pokemon_name, Form: i.form }])
    .flatMap((i) => buildPokemonChain(i));
  console.log(`Pokemon with all chains`, allChains);

  allChains.forEach((chain) => {
    chain.forEach((element) => {
      console.log(`Chain - Element`, chain, element);
      mappedPokemons.find((i) => i.Id == element.Id && i.Form == element.Form)?.Evolutions.push(chain);
    });
  });

  // mappedPokemons.forEach((i) => {
  //   i.Evolutions = buildPokemonChain({ pokemon_id: i.Id, pokemon_name: i.Name, form: i.Form });
  // });

  return mappedPokemons;

  // .groupBy(
  //   (i) =>
  //     JSON.stringify({
  //       Id: i.Id,
  //       Name: i.Name,
  //       Types: i.Types.sort(),
  //       BaseStats: i.BaseStats,
  //       MaxCP: i.MaxCP,
  //       FastMoves: i.FastMoves,
  //       ChargedMoves: i.ChargedMoves,
  //       EliteFastMoves: i.EliteFastMoves,
  //       EliteChargedMoves: i.EliteChargedMoves,
  //     }),
  //   (i) => i.Forms
  // );

  // const result: Pokemon[] = [];

  // mappedPokemons.forEach((value, key) => {
  //   result.push({
  //     ...JSON.parse(key),
  //     Forms: value.flatMap((i) => i),
  //   });
  // });

  // return result;
};

export { downloadMetadata };
