import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import React, { SetStateAction, useState } from 'react';
import CoffeeForm from './CoffeeForm';
import { defaultBrewForm } from '../../common/models';

interface CoffeeFormDialogProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

const CoffeeFormDialog = ({ open, setOpen }: CoffeeFormDialogProps) => {
  const [brewFormState, setBrewFormState] = useState(defaultBrewForm);

  const onSave = () => {
    console.log('CoffeeFormDialog.onSave');
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
        <Button onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={onSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CoffeeFormDialog;
