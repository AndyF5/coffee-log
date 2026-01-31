import { RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { Firestore, doc, setDoc } from 'firebase/firestore';

export const TEST_USER_ID = 'test-user-123';
export const OTHER_USER_ID = 'other-user-456';

export interface BrewData {
  uid: string;
  coffeeId: string;
  rating: number;
  method: string;
  notes: string;
  createdAt: Date;
}

export interface CoffeeData {
  uid: string;
  name: string;
  roaster: string;
  origin: string;
  createdAt: Date;
}

export function createBrewData(overrides: Partial<BrewData> = {}): BrewData {
  return {
    uid: TEST_USER_ID,
    coffeeId: 'coffee-1',
    rating: 4,
    method: 'pour-over',
    notes: 'Great cup',
    createdAt: new Date(),
    ...overrides,
  };
}

export function createCoffeeData(overrides: Partial<CoffeeData> = {}): CoffeeData {
  return {
    uid: TEST_USER_ID,
    name: 'Test Coffee',
    roaster: 'Test Roaster',
    origin: 'Ethiopia',
    createdAt: new Date(),
    ...overrides,
  };
}

export async function seedBrew(
  testEnv: RulesTestEnvironment,
  brewId: string,
  data: BrewData
): Promise<void> {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db as unknown as Firestore, 'brews', brewId), data);
  });
}

export async function seedCoffee(
  testEnv: RulesTestEnvironment,
  coffeeId: string,
  data: CoffeeData
): Promise<void> {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db as unknown as Firestore, 'coffees', coffeeId), data);
  });
}
