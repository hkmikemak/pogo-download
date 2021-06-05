import { ChargedMove } from "./chargedMove.model";
import { FastMove } from "./fastMove.model";

export interface Pokemon {
  Id: number;
  Name: string;
  Types: Array<string>;
  Form: string;
  BaseStats: {
    Attack: number;
    Defense: number;
    Stamina: number;
  };
  MaxCP: number;
  FastMoves: Array<FastMove>;
  ChargedMoves: Array<ChargedMove>;
  EliteFastMoves: Array<FastMove>;
  EliteChargedMoves: Array<ChargedMove>;
  Evolutions: Array<
    Array<{
      Id: number;
      Name: string;
      Form: string;
    }>
  >;
}
