import { Autocomplete, Box, Rating, TextField } from '@mui/material';
import React, { useState } from 'react';

const CoffeeForm = () => {
  const [coffeeType, setCoffeeType] = useState('');
  const [coffee, setCoffee] = useState('');
  const [coffeeAmount, setCoffeeAmount] = useState('18.0');
  const [waterAmount, setWaterAmount] = useState('36.0');
  const [temperature, setTemperature] = useState('93.0');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [rating, setRating] = useState<number | null>(3);

  return (
    <Box>
      <TextField
        value={coffeeType}
        onChange={(e) => setCoffeeType(e.currentTarget.value)}
        label="Type of Coffee"
        name="type"
        fullWidth
        sx={{
          marginY: 1,
        }}
      />
      <TextField
        value={coffee}
        onChange={(e) => setCoffee(e.currentTarget.value)}
        label="Coffee"
        name="coffee"
        fullWidth
        sx={{
          marginY: 1,
        }}
      />
      <TextField
        value={coffeeAmount}
        onChange={(e) => setCoffeeAmount(e.currentTarget.value)}
        label="Amount of Coffee"
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
        value={waterAmount}
        onChange={(e) => setWaterAmount(e.currentTarget.value)}
        label="Amount of Water"
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
        value={temperature}
        onChange={(e) => setTemperature(e.currentTarget.value)}
        label="Temperature"
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
        value={notes}
        onChange={(e) => setNotes(e.currentTarget.value)}
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
        value={tags}
        freeSolo
        onChange={(e, newValue) => setTags(newValue)}
        options={['Sweet', 'Bitter']}
        renderInput={(params) => <TextField {...params} label="Tags" />}
      />
      <Rating
        name="rating"
        value={rating}
        onChange={(event, newValue) => {
          setRating(newValue);
        }}
        sx={{
          marginY: 1,
        }}
      />
    </Box>
  );
};

export default CoffeeForm;
