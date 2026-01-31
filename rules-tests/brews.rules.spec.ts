import { describe, it, expect } from 'vitest';
import { assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, Firestore } from 'firebase/firestore';
import { getTestEnv } from './setup';
import {
  TEST_USER_ID,
  OTHER_USER_ID,
  createBrewData,
  seedBrew,
} from './helpers';

describe('brews collection rules', () => {
  describe('read', () => {
    it('allows authenticated user to read their own brew', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: TEST_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertSucceeds(getDoc(doc(db, 'brews', 'brew-1')));
    });

    it('denies authenticated user from reading another user brew', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: OTHER_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertFails(getDoc(doc(db, 'brews', 'brew-1')));
    });

    it('denies unauthenticated user from reading any brew', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: TEST_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv.unauthenticatedContext().firestore() as unknown as Firestore;

      await assertFails(getDoc(doc(db, 'brews', 'brew-1')));
    });
  });

  describe('create', () => {
    it('allows authenticated user to create a brew with matching uid', async () => {
      const testEnv = getTestEnv();
      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      const brewData = createBrewData({ uid: TEST_USER_ID });

      await assertSucceeds(setDoc(doc(db, 'brews', 'new-brew'), brewData));
    });

    it('denies authenticated user from creating a brew with different uid', async () => {
      const testEnv = getTestEnv();
      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      const brewData = createBrewData({ uid: OTHER_USER_ID });

      await assertFails(setDoc(doc(db, 'brews', 'new-brew'), brewData));
    });

    it('denies unauthenticated user from creating a brew', async () => {
      const testEnv = getTestEnv();
      const db = testEnv.unauthenticatedContext().firestore() as unknown as Firestore;

      const brewData = createBrewData({ uid: TEST_USER_ID });

      await assertFails(setDoc(doc(db, 'brews', 'new-brew'), brewData));
    });
  });

  describe('update', () => {
    it('allows authenticated user to update their own brew with matching uid', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: TEST_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertSucceeds(
        updateDoc(doc(db, 'brews', 'brew-1'), { notes: 'Updated notes', uid: TEST_USER_ID })
      );
    });

    it('denies authenticated user from changing uid on their brew', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: TEST_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertFails(
        updateDoc(doc(db, 'brews', 'brew-1'), { uid: OTHER_USER_ID })
      );
    });

    it('denies authenticated user from updating another user brew', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: OTHER_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertFails(
        updateDoc(doc(db, 'brews', 'brew-1'), { notes: 'Hacked notes', uid: TEST_USER_ID })
      );
    });

    it('denies unauthenticated user from updating any brew', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: TEST_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv.unauthenticatedContext().firestore() as unknown as Firestore;

      await assertFails(
        updateDoc(doc(db, 'brews', 'brew-1'), { notes: 'Hacked notes' })
      );
    });
  });

  describe('delete', () => {
    it('allows authenticated user to delete their own brew', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: TEST_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertSucceeds(deleteDoc(doc(db, 'brews', 'brew-1')));
    });

    it('denies authenticated user from deleting another user brew', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: OTHER_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv
        .authenticatedContext(TEST_USER_ID)
        .firestore() as unknown as Firestore;

      await assertFails(deleteDoc(doc(db, 'brews', 'brew-1')));
    });

    it('denies unauthenticated user from deleting any brew', async () => {
      const testEnv = getTestEnv();
      const brewData = createBrewData({ uid: TEST_USER_ID });
      await seedBrew(testEnv, 'brew-1', brewData);

      const db = testEnv.unauthenticatedContext().firestore() as unknown as Firestore;

      await assertFails(deleteDoc(doc(db, 'brews', 'brew-1')));
    });
  });
});
