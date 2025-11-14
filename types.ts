
export interface FuelingEntry {
  id: string;
  date: string;
  odometer: number;
  pricePerLiter: number;
  totalCost: number;
  liters: number;
  station?: string;
  consumption: number | null;
}

export type NewFuelingData = Omit<FuelingEntry, 'id' | 'liters' | 'consumption'>;
