import fetch from "node-fetch";
import { ChargedMove } from "../../models/chargedMove.model";
import { FastMove } from "../../models/fastMove.model";
import { Pokemon } from "../../models/pokemon.model";
import { TypeEffectiveness } from "../../models/typeEffectiveness.model";

interface DownloadTypeEffectiveness {
  [key: string]: {
    [key: string]: number;
  };
}

const downloadJSON = <T>(url: string) => fetch(url).then((response) => response.json() as Promise<T>);

const downloadTypeEffectiveness = async () => {
  // const downloadHelper = new DownloadHelper();

  const typeEffectiveness = (await downloadJSON(
    "https://pogoapi.net/api/v1/type_effectiveness.json"
  )) as DownloadTypeEffectiveness;
  const all_types = Object.keys(typeEffectiveness);
  const all_type_combinations = [
    ...all_types.map((type) => [type]),
    ...all_types.flatMap((type1, index) => all_types.slice(index + 1).map((type2) => [type1, type2])),
  ];

  const result = all_types.flatMap((moveType) => {
    return all_type_combinations.map((defenseTypes) => {
      return {
        MoveType: moveType,
        DefenseTypes: defenseTypes,
        Effectiveness: defenseTypes.reduce((aggValue, curType) => aggValue * typeEffectiveness[moveType][curType], 1),
      } as TypeEffectiveness;
    });
  });

  //console.log(JSON.stringify(result, null, 2));

  return result;
};

export { downloadTypeEffectiveness };
