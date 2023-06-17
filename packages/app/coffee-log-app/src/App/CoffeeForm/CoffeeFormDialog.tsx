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
  onClose: VoidFunction;
}

const CoffeeFormDialog = ({ open, onClose }: CoffeeFormDialogProps) => {
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

      onClose();
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Coffee Logger</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter your coffee information here!
        </DialogContentText>
        <CoffeeForm brew={brewFormState} setBrew={setBrewFormState} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose()} disabled={loading}>
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
