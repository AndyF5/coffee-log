import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { SetStateAction, useState } from 'react';
import CoffeeForm from './CoffeeForm';
import {
  Brew,
  FirestoreCollections,
  defaultBrewForm,
} from '../../common/models';
import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';
import { getAuth } from '@firebase/auth';

interface CoffeeFormDialogProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const CoffeeFormDialog = ({ open, setOpen }: CoffeeFormDialogProps) => {
  const [brewFormState, setBrewFormState] = useState(defaultBrewForm);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    setLoading(true);

    const db = getFirestore();

    const auth = getAuth();

    if (auth.currentUser) {
      const brewData: Brew = {
        ...brewFormState,
        brewMethod: brewFormState.brewMethod ?? '',
        coffeeAmount: parseFloat(brewFormState.coffeeAmount),
        grindSetting: parseFloat(brewFormState.grindSetting),
        waterAmount: parseFloat(brewFormState.waterAmount),
        temperature: parseFloat(brewFormState.temperature),
        brewTime: parseFloat(brewFormState.brewTime),
        date: Timestamp.now(),
      };

      await addDoc(collection(db, FirestoreCollections.Brews), {
        ...brewData,
        uid: auth.currentUser?.uid,
      });

      setBrewFormState(defaultBrewForm);

      setOpen(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Coffee Logger</DialogTitle>
      <DialogContent sx={{ padding: 1 }}>
        <DialogContentText>
          Enter your coffee information here!
        </DialogContentText>
        <CoffeeForm brew={brewFormState} setBrew={setBrewFormState} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={() => onSave()} disabled={loading}>
          {loading ? <CircularProgress /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CoffeeFormDialog;
