import { Timestamp } from '@firebase/firestore';

export interface Brew {
  brewMethod: string;
  coffee: string;
  coffeeAmount: number;
  grindSetting: number;
  waterAmount: number;
  temperature: number;
  brewTime: number;
  notes: string;
  tags: string[];
  rating: number;
  date: Timestamp;
}

export interface BrewForm {
  brewMethod: string | null;
  coffee: string;
  coffeeAmount: string;
  grindSetting: string;
  waterAmount: string;
  temperature: string;
  brewTime: string;
  notes: string;
  tags: string[];
  rating: number;
}

export const defaultBrewForm: BrewForm = {
  brewMethod: null,
  coffee: '',
  coffeeAmount: '18.0',
  grindSetting: '10.0',
  waterAmount: '36.0',
  temperature: '93.0',
  brewTime: '30.0',
  notes: '',
  tags: [],
  rating: 3,
};
