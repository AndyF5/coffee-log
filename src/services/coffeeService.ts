import { doc, getFirestore, setDoc, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Coffee, getCoffeeDocId } from '../models/Coffee';
import { FirestoreCollections } from '../models';

/**
 * Upserts a coffee name to the user's coffee collection.
 * Uses setDoc with merge to create or update the document.
 * Updates the lastUsed timestamp on each call.
 */
export async function upsertCoffee(coffeeName: string): Promise<void> {
  const trimmedName = coffeeName.trim();
  if (!trimmedName) return;

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User must be authenticated to save coffee');
  }

  const db = getFirestore();
  const docId = getCoffeeDocId(user.uid, trimmedName);
  const coffeeRef = doc(db, FirestoreCollections.Coffees, docId);

  const coffeeData: Coffee = {
    name: trimmedName,
    uid: user.uid,
    lastUsed: Timestamp.now(),
  };

  await setDoc(coffeeRef, coffeeData, { merge: true });
}
