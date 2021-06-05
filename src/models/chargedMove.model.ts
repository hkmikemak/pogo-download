export interface ChargedMove {
  Name: string;
  Type: string;
  Power: number;
  StaminaLossScaler: number;
  Duration: number;
  CriticalChance?: number;
  EnergyDelta: number;
  HealScalar?: number;
}
