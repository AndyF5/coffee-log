import { Timestamp } from 'firebase/firestore';
import { Brew, BrewForm, BrewWithID } from '../../models';

export function createMockBrew(overrides: Partial<Brew> = {}): Brew {
  return {
    brewMethod: 'Espresso',
    coffee: 'Test Coffee',
    coffeeAmount: 18,
    grindSetting: 10,
    waterAmount: 36,
    temperature: 93,
    brewTime: 30,
    notes: 'Test notes',
    tags: ['Sweet'],
    rating: 4,
    date: {
      toDate: () => new Date('2024-01-15T10:30:00Z'),
    } as Timestamp,
    ...overrides,
  };
}

export function createMockBrewWithID(
  overrides: Partial<BrewWithID> = {},
): BrewWithID {
  return {
    id: 'test-brew-id',
    ...createMockBrew(),
    ...overrides,
  };
}

export function createMockBrewForm(
  overrides: Partial<BrewForm> = {},
): BrewForm {
  return {
    brewMethod: 'Espresso',
    coffee: 'Test Coffee',
    coffeeAmount: '18.0',
    grindSetting: '10.0',
    waterAmount: '36.0',
    temperature: '93.0',
    brewTime: '30.0',
    notes: 'Test notes',
    tags: ['Sweet'],
    rating: 4,
    ...overrides,
  };
}

export function createMockFirestoreDoc(id: string, data: Brew) {
  return {
    id,
    data: () => data,
  };
}
