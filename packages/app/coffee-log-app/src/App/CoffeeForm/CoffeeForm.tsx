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
        sx={{
          marginY: 1,
        }}
      />
      <TextField
        value={brew.coffee}
        onChange={(e) =>
          setBrew((current) => ({ ...current, coffee: e.target.value }))
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
            coffeeAmount: e.target.value,
          }))
        }
        label="Amount of Coffee (grams)"
        name="coffee-amount"
        type="text"
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
            grindSetting: e.target.value,
          }))
        }
        label="Grind Setting"
        name="grind-setting"
        type="text"
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
            waterAmount: e.target.value,
          }))
        }
        label="Amount of Water (ml/grams)"
        name="water-amount"
        type="text"
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
            temperature: e.target.value,
          }))
        }
        label="Temperature (C)"
        name="temperature"
        type="text"
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
        fullWidth
        sx={{
          marginY: 1,
        }}
      />

      <TextField
        value={brew.brewTime}
        onChange={(e) =>
          setBrew((current) => ({
            ...current,
            brewTime: e.target.value,
          }))
        }
        label="Brew Time (s)"
        name="brew-time"
        type="text"
        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
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
            notes: e.target.value,
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
        onChange={(e, newValue) => {
          setBrew((current) => ({
            ...current,
            tags: newValue,
          }));
        }}
        options={['Sweet', 'Bitter']}
        renderInput={(params) => <TextField {...params} label="Tags" />}
        sx={{
          marginY: 1,
        }}
      />
      <Rating
        name="rating"
        value={brew.rating}
        onChange={(event, newValue) => {
          setBrew((current) => ({ ...current, rating: newValue ?? 0 }));
        }}
        sx={{
          marginBottom: 1,
        }}
      />
    </Box>
  );
};

export default CoffeeForm;
