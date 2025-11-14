
export interface FuelingEntry {
  id: string;
  userId: string;
  date: string;
  odometer: number;
  pricePerLiter: number;
  totalCost: number;
  liters: number;
  station?: string;
  consumption: number | null;
}

export type NewFuelingData = Omit<FuelingEntry, 'id' | 'userId' | 'liters' | 'consumption'>;

export type EditableFuelingData = Omit<FuelingEntry, 'userId' | 'liters' | 'consumption'>;