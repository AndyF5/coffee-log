import { describe, it, expect } from 'vitest';
import { assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, Firestore } from 'firebase/firestore';
import { getTestEnv } from './setup';
import {
  TEST_USER_ID,
  OTHER_USER_ID,
  createCoffeeData,
  seedCoffee,
} from './helpers';

describe('coffees collection rules', () => {
  describe('read', () => {
    it('allows authenticated user to read their own coffee', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: TEST_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertSucceeds(getDoc(doc(db, 'coffees', 'coffee-1')));
    });

    it('denies authenticated user from reading another user coffee', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: OTHER_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertFails(getDoc(doc(db, 'coffees', 'coffee-1')));
    });

    it('denies unauthenticated user from reading any coffee', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: TEST_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv.unauthenticatedContext().firestore() as unknown as Firestore;

      await assertFails(getDoc(doc(db, 'coffees', 'coffee-1')));
    });
  });

  describe('create', () => {
    it('allows authenticated user to create a coffee with matching uid', async () => {
      const testEnv = getTestEnv();
      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      const coffeeData = createCoffeeData({ uid: TEST_USER_ID });

      await assertSucceeds(setDoc(doc(db, 'coffees', 'new-coffee'), coffeeData));
    });

    it('denies authenticated user from creating a coffee with different uid', async () => {
      const testEnv = getTestEnv();
      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      const coffeeData = createCoffeeData({ uid: OTHER_USER_ID });

      await assertFails(setDoc(doc(db, 'coffees', 'new-coffee'), coffeeData));
    });

    it('denies unauthenticated user from creating a coffee', async () => {
      const testEnv = getTestEnv();
      const db = testEnv.unauthenticatedContext().firestore() as unknown as Firestore;

      const coffeeData = createCoffeeData({ uid: TEST_USER_ID });

      await assertFails(setDoc(doc(db, 'coffees', 'new-coffee'), coffeeData));
    });
  });

  describe('update', () => {
    it('allows authenticated user to update their own coffee with matching uid', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: TEST_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertSucceeds(
        updateDoc(doc(db, 'coffees', 'coffee-1'), { name: 'Updated Coffee', uid: TEST_USER_ID })
      );
    });

    it('denies authenticated user from changing uid on their coffee', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: TEST_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertFails(
        updateDoc(doc(db, 'coffees', 'coffee-1'), { uid: OTHER_USER_ID })
      );
    });

    it('denies authenticated user from updating another user coffee', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: OTHER_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertFails(
        updateDoc(doc(db, 'coffees', 'coffee-1'), { name: 'Hacked name', uid: TEST_USER_ID })
      );
    });

    it('denies unauthenticated user from updating any coffee', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: TEST_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv.unauthenticatedContext().firestore() as unknown as Firestore;

      await assertFails(
        updateDoc(doc(db, 'coffees', 'coffee-1'), { name: 'Hacked name' })
      );
    });
  });

  describe('delete', () => {
    it('allows authenticated user to delete their own coffee', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: TEST_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertSucceeds(deleteDoc(doc(db, 'coffees', 'coffee-1')));
    });

    it('denies authenticated user from deleting another user coffee', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: OTHER_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertFails(deleteDoc(doc(db, 'coffees', 'coffee-1')));
    });

    it('denies unauthenticated user from deleting any coffee', async () => {
      const testEnv = getTestEnv();
      const coffeeData = createCoffeeData({ uid: TEST_USER_ID });
      await seedCoffee(testEnv, 'coffee-1', coffeeData);

      const db = testEnv.unauthenticatedContext().firestore() as unknown as Firestore;

      await assertFails(deleteDoc(doc(db, 'coffees', 'coffee-1')));
    });
  });
});
