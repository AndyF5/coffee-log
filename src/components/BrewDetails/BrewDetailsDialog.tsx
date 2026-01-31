import {
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BrewForm, BrewWithID } from '../../models';
import CoffeeForm from '../CoffeeForm/CoffeeForm';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import { brewFormSchema } from '../../utils/validation';
import { useCoffeeNames } from '../../hooks';
import { upsertCoffee } from '../../services/coffeeService';

interface BrewDetailsDialogProps {
  open: boolean;
  onClose: VoidFunction;
  brew: BrewWithID | undefined;
  onBrewRepeat: VoidFunction;
  onBrewUpdate?: (brewId: string, brewForm: BrewForm) => Promise<void>;
  onBrewDelete?: (brewId: string) => Promise<void>;
}

function brewToForm(brew: BrewWithID): BrewForm {
  return {
    brewMethod: brew.brewMethod,
    coffee: brew.coffee,
    coffeeAmount: brew.coffeeAmount.toString(),
    grindSetting: brew.grindSetting.toString(),
    waterAmount: brew.waterAmount.toString(),
    temperature: brew.temperature.toString(),
    brewTime: brew.brewTime.toString(),
    notes: brew.notes,
    tags: brew.tags,
    rating: brew.rating,
  };
}

const BrewDetailsDialog = ({
  open,
  onClose,
  brew,
  onBrewRepeat,
  onBrewUpdate,
  onBrewDelete,
}: BrewDetailsDialogProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { coffeeNames } = useCoffeeNames();

  const methods = useForm<BrewForm>({
    resolver: yupResolver(brewFormSchema),
    mode: 'onSubmit',
  });

  const handleEdit = () => {
    if (brew) {
      methods.reset(brewToForm(brew));
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    methods.reset();
  };

  const handleSaveEdit = async (data: BrewForm) => {
    if (!brew || !onBrewUpdate) return;

    setLoading(true);
    try {
      await onBrewUpdate(brew.id, data);

      // Save coffee name for autocomplete
      if (data.coffee) {
        await upsertCoffee(data.coffee);
      }

      setIsEditing(false);
      methods.reset();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brew || !onBrewDelete) return;

    setLoading(true);
    try {
      await onBrewDelete(brew.id);
      setShowDeleteConfirm(false);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    methods.reset();
    onClose();
  };

  return brew ? (
    <>
      <Dialog open={open} onClose={handleClose}>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSaveEdit)}>
            <DialogTitle variant="h4">
              {brew.coffee} | {brew.brewMethod}
            </DialogTitle>
            <DialogContent>
              {isEditing ? (
                <CoffeeForm coffeeOptions={coffeeNames} />
              ) : (
                <>
                  <DialogContentText>
                    {brew.date.toDate().toLocaleString([], {
                      year: 'numeric',
                      month: 'long',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </DialogContentText>

                  <Rating readOnly value={brew.rating} />

                  <Stack py={1} direction="row" spacing={1}>
                    {brew.tags.map((tag) => (
                      <Chip label={tag} key={tag} />
                    ))}
                  </Stack>

                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell component="th">Amount of coffee</TableCell>
                        <TableCell>{brew.coffeeAmount} g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Grind Setting</TableCell>
                        <TableCell>{brew.grindSetting}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Water Amount</TableCell>
                        <TableCell>{brew.waterAmount} g</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Temperature</TableCell>
                        <TableCell>{brew.temperature} &#176;C</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell component="th">Brew Time</TableCell>
                        <TableCell>{brew.brewTime} s</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <DialogContentText paddingTop={2}>{brew.notes}</DialogContentText>
                </>
              )}
            </DialogContent>
            <DialogActions>
              {isEditing ? (
                <>
                  <Button onClick={handleCancelEdit} disabled={loading}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                  </Button>
                </>
              ) : (
                <>
                  {onBrewDelete && (
                    <Button onClick={handleDeleteClick} color="error" disabled={loading}>
                      Delete
                    </Button>
                  )}
                  {onBrewUpdate && (
                    <Button onClick={handleEdit} disabled={loading}>
                      Edit
                    </Button>
                  )}
                  <Button onClick={onBrewRepeat} disabled={loading}>
                    Repeat Brew
                  </Button>
                </>
              )}
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Brew"
        message="Are you sure you want to delete this brew? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  ) : null;
};

export default BrewDetailsDialog;
