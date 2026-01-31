import { useEffect, useState } from 'react';
import { Coffee, FirestoreCollections } from '../models';
import { Unsubscribe, getAuth } from 'firebase/auth';
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

interface UseCoffeeNamesResult {
  coffeeNames: string[];
}

/**
 * Hook to fetch and subscribe to the user's coffee names.
 * Returns coffee names sorted by lastUsed (most recent first).
 */
const useCoffeeNames = (): UseCoffeeNamesResult => {
  const [coffeeNames, setCoffeeNames] = useState<string[]>([]);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    let unsub: Unsubscribe | undefined = undefined;

    if (auth.currentUser) {
      const coffeesQuery = query(
        collection(db, FirestoreCollections.Coffees),
        where('uid', '==', auth.currentUser.uid),
        orderBy('lastUsed', 'desc')
      );

      unsub = onSnapshot(
        coffeesQuery,
        (snapshot) => {
          const names = snapshot.docs.map((doc) => (doc.data() as Coffee).name);
          setCoffeeNames(names);
        },
        (error) => {
          console.error('Error fetching coffee names:', error);
        }
      );
    }

    return () => unsub && unsub();
  }, []);

  return {
    coffeeNames,
  };
};

export default useCoffeeNames;
