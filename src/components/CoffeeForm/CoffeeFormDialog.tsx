import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CoffeeForm from './CoffeeForm';
import {
  Brew,
  BrewForm,
  FirestoreCollections,
  defaultBrewForm,
} from '../../models';
import {
  Timestamp,
  addDoc,
  collection,
  getFirestore,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { brewFormSchema } from '../../utils/validation';
import { useCoffeeNames, useNotification } from '../../hooks';
import { upsertCoffee } from '../../services/coffeeService';

interface CoffeeFormDialogProps {
  open: boolean;
  onClose: VoidFunction;
  initialFormState?: BrewForm;
}

const CoffeeFormDialog = ({
  open,
  onClose,
  initialFormState,
}: CoffeeFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { showNotification } = useNotification();
  const { coffeeNames } = useCoffeeNames();

  const methods = useForm<BrewForm>({
    resolver: yupResolver(brewFormSchema),
    defaultValues: defaultBrewForm,
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (initialFormState) {
      methods.reset(initialFormState);
    }
  }, [initialFormState, methods]);

  useEffect(() => {
    if (!open) {
      methods.reset(defaultBrewForm);
    }
  }, [open, methods]);

  const onSave = async (data: BrewForm) => {
    setLoading(true);

    const db = getFirestore();
    const auth = getAuth();

    if (auth.currentUser) {
      const brewData: Brew = {
        ...data,
        brewMethod: data.brewMethod ?? '',
        coffeeAmount: parseFloat(data.coffeeAmount),
        grindSetting: parseFloat(data.grindSetting),
        waterAmount: parseFloat(data.waterAmount),
        temperature: parseFloat(data.temperature),
        brewTime: parseFloat(data.brewTime),
        date: Timestamp.now(),
      };

      try {
        await addDoc(collection(db, FirestoreCollections.Brews), {
          ...brewData,
          uid: auth.currentUser?.uid,
        });

        // Save coffee name for autocomplete
        if (data.coffee) {
          await upsertCoffee(data.coffee);
        }

        showNotification('Brew saved successfully!', 'success');
        methods.reset(defaultBrewForm);
        onClose();
      } catch (error) {
        console.error('Failed to save brew:', error);
        showNotification('Failed to save brew. Please try again.', 'error');
      }
    }

    setLoading(false);
  };

  const handleClose = () => {
    methods.reset(defaultBrewForm);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSave)}>
          <DialogTitle>Coffee Logger</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter your coffee information here!
            </DialogContentText>
            <CoffeeForm coffeeOptions={coffeeNames} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Save'}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default CoffeeFormDialog;
