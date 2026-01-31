import { getAuth } from 'firebase/auth';
import { doc, getFirestore, updateDoc, deleteDoc } from 'firebase/firestore';
import { BrewForm, FirestoreCollections } from '../models';

export async function updateBrew(brewId: string, brewForm: BrewForm): Promise<void> {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to update a brew');
  }

  const db = getFirestore();
  const brewRef = doc(db, FirestoreCollections.Brews, brewId);

  await updateDoc(brewRef, {
    brewMethod: brewForm.brewMethod ?? '',
    coffee: brewForm.coffee,
    coffeeAmount: parseFloat(brewForm.coffeeAmount),
    grindSetting: parseFloat(brewForm.grindSetting),
    waterAmount: parseFloat(brewForm.waterAmount),
    temperature: parseFloat(brewForm.temperature),
    brewTime: parseFloat(brewForm.brewTime),
    notes: brewForm.notes,
    tags: brewForm.tags,
    rating: brewForm.rating,
  });
}

export async function deleteBrew(brewId: string): Promise<void> {
  const auth = getAuth();
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to delete a brew');
  }

  const db = getFirestore();
  const brewRef = doc(db, FirestoreCollections.Brews, brewId);

  await deleteDoc(brewRef);
}
