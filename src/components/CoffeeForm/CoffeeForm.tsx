import { Autocomplete, Box, Rating, TextField } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { BrewForm } from '../../models';

interface CoffeeFormProps {
  coffeeOptions?: string[];
}

const CoffeeForm = ({ coffeeOptions = [] }: CoffeeFormProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<BrewForm>();

  return (
    <Box>
      <Controller
        name="brewMethod"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            id="brewMethod"
            value={value}
            freeSolo
            onChange={(_e, newValue) => onChange(newValue)}
            onInputChange={(_e, newValue, reason) => {
              if (reason === 'input') {
                onChange(newValue);
              }
            }}
            options={['Espresso', 'Filter']}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Brew Method"
                error={!!errors.brewMethod}
                helperText={errors.brewMethod?.message}
              />
            )}
            sx={{ marginY: 1 }}
          />
        )}
      />

      <Controller
        name="coffee"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            id="coffee"
            value={value}
            freeSolo
            onChange={(_e, newValue) => onChange(newValue ?? '')}
            onInputChange={(_e, newValue, reason) => {
              if (reason === 'input') {
                onChange(newValue);
              }
            }}
            options={coffeeOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Coffee"
                fullWidth
                error={!!errors.coffee}
                helperText={errors.coffee?.message}
              />
            )}
            sx={{ marginY: 1 }}
          />
        )}
      />

      <Controller
        name="coffeeAmount"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Amount of Coffee (grams)"
            type="text"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            fullWidth
            error={!!errors.coffeeAmount}
            helperText={errors.coffeeAmount?.message}
            sx={{ marginY: 1 }}
          />
        )}
      />

      <Controller
        name="grindSetting"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Grind Setting"
            type="text"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            fullWidth
            error={!!errors.grindSetting}
            helperText={errors.grindSetting?.message}
            sx={{ marginY: 1 }}
          />
        )}
      />

      <Controller
        name="waterAmount"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Amount of Water (ml/grams)"
            type="text"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            fullWidth
            error={!!errors.waterAmount}
            helperText={errors.waterAmount?.message}
            sx={{ marginY: 1 }}
          />
        )}
      />

      <Controller
        name="temperature"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Temperature (&#176;C)"
            type="text"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            fullWidth
            error={!!errors.temperature}
            helperText={errors.temperature?.message}
            sx={{ marginY: 1 }}
          />
        )}
      />

      <Controller
        name="brewTime"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Brew Time (s)"
            type="text"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            fullWidth
            error={!!errors.brewTime}
            helperText={errors.brewTime?.message}
            sx={{ marginY: 1 }}
          />
        )}
      />

      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Notes"
            multiline
            fullWidth
            rows={3}
            sx={{ marginY: 1 }}
          />
        )}
      />

      <Controller
        name="tags"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Autocomplete
            multiple
            id="tags"
            value={value}
            freeSolo
            onChange={(_e, newValue) => onChange(newValue)}
            options={['Sweet', 'Bitter']}
            renderInput={(params) => <TextField {...params} label="Tags" />}
            sx={{ marginY: 1 }}
          />
        )}
      />

      <Controller
        name="rating"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Rating
            name="rating"
            value={value}
            onChange={(_event, newValue) => onChange(newValue ?? 0)}
            sx={{ marginBottom: 1 }}
          />
        )}
      />
    </Box>
  );
};

export default CoffeeForm;
