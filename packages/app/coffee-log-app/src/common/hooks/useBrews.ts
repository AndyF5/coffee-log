import { useEffect, useState } from 'react';
import { Brew, BrewWithID, FirestoreCollections } from '../models';
import { Unsubscribe, getAuth } from '@firebase/auth';
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from '@firebase/firestore';

interface useBrewsResult {
  brews: BrewWithID[];
}

const useBrews = (): useBrewsResult => {
  const [brews, setBrews] = useState<BrewWithID[]>([]);

  useEffect(() => {
    const auth = getAuth();

    const db = getFirestore();

    let unsub: Unsubscribe | undefined = undefined;

    if (auth.currentUser) {
      const brewsQuery = query(
        collection(db, FirestoreCollections.Brews),
        where('uid', '==', auth.currentUser?.uid)
      );

      unsub = onSnapshot(brewsQuery, (snapshot) => {
        setBrews(
          snapshot.docs.map((doc) => ({ ...(doc.data() as Brew), id: doc.id }))
        );
      });
    }

    return () => unsub && unsub();
  }, []);

  return {
    brews,
  };
};

export default useBrews;