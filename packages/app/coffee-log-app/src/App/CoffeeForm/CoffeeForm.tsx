import { Autocomplete, Box, Rating, TextField } from '@mui/material';
import React, { SetStateAction, useState } from 'react';
import { BrewForm } from '../../common/models';

interface CoffeeFormProps {
  brew: BrewForm;
  setBrew: React.Dispatch<SetStateAction<BrewForm>>;
}

const CoffeeForm = ({ brew, setBrew }: CoffeeFormProps) => {
  return (
    <Box>
      <Autocomplete
        id="tags"
        value={brew.brewMethod}
        freeSolo
        onChange={(e, newValue) =>
          setBrew((current) => ({ ...current, brewMethod: newValue }))
        }
        options={['Espresso', 'Filter']}
        renderInput={(params) => <TextField {...params} label="Brew Method" />}
      />
      <TextField
        value={brew.coffee}
        onChange={(e) =>
          setBrew((current) => ({ ...current, coffee: e.currentTarget.value }))
        }
        label="Coffee"
        name="coffee"
        fullWidth
        sx={{
          marginY: 1,
        }}
      />
      <TextField
        value={brew.coffeeAmount}
        onChange={(e) =>
          setBrew((current) => ({
            ...current,
            coffeeAmount: parseFloat(e.currentTarget.value),
          }))
        }
        label="Amount of Coffee (grams)"
        name="coffee-amount"
        type="number"
        inputProps={{
          step: '0.1',
        }}
        fullWidth
        sx={{
          marginY: 1,
        }}
      />
      <TextField
        value={brew.grindSetting}
        onChange={(e) =>
          setBrew((current) => ({
            ...current,
            grindSetting: parseFloat(e.currentTarget.value),
          }))
        }
        label="Grind Setting"
        name="grind-setting"
        type="number"
        inputProps={{
          step: '0.1',
        }}
        fullWidth
        sx={{
          marginY: 1,
        }}
      />
      <TextField
        value={brew.waterAmount}
        onChange={(e) =>
          setBrew((current) => ({
            ...current,
            waterAmount: parseFloat(e.currentTarget.value),
          }))
        }
        label="Amount of Water (ml/grams)"
        name="water-amount"
        type="number"
        inputProps={{
          step: '0.1',
        }}
        fullWidth
        sx={{
          marginY: 1,
        }}
      />
      <TextField
        value={brew.temperature}
        onChange={(e) =>
          setBrew((current) => ({
            ...current,
            temperature: parseFloat(e.currentTarget.value),
          }))
        }
        label="Temperature (C)"
        name="temperature"
        type="number"
        inputProps={{
          step: '0.1',
        }}
        fullWidth
        sx={{
          marginY: 1,
        }}
      />
      <TextField
        value={brew.notes}
        onChange={(e) =>
          setBrew((current) => ({
            ...current,
            notes: e.currentTarget.value,
          }))
        }
        label="Notes"
        name="notes"
        multiline
        fullWidth
        rows={3}
        sx={{
          marginY: 1,
        }}
      />
      <Autocomplete
        multiple
        id="tags"
        value={brew.tags}
        freeSolo
        onChange={(e, newValue) =>
          setBrew((current) => ({
            ...current,
            tags: newValue,
          }))
        }
        options={['Sweet', 'Bitter']}
        renderInput={(params) => <TextField {...params} label="Tags" />}
      />
      <Rating
        name="rating"
        value={brew.rating}
        onChange={(event, newValue) => {
          setBrew((current) => ({ ...current, rating: newValue ?? 0 }));
        }}
        sx={{
          marginY: 1,
        }}
      />
    </Box>
  );
};

export default CoffeeForm;
