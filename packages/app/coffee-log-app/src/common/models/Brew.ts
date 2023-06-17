export interface Brew {
  brewMethod: string;
  coffee: string;
  coffeeAmount: number;
  grindSetting: number;
  waterAmount: number;
  temperature: number;
  notes: string;
  tags: string[];
  rating: number;
}

export interface BrewForm {
  brewMethod: string | null;
  coffee: string;
  coffeeAmount: number;
  grindSetting: number;
  waterAmount: number;
  temperature: number;
  notes: string;
  tags: string[];
  rating: number;
}

export const defaultBrewForm: BrewForm = {
  brewMethod: null,
  coffee: '',
  coffeeAmount: 18.0,
  grindSetting: 10.0,
  waterAmount: 36.0,
  temperature: 93.0,
  notes: '',
  tags: [],
  rating: 3,
};
