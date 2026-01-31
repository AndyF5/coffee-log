import * as yup from 'yup';
import { BrewForm } from '../models';

export const brewFormSchema = yup.object({
  brewMethod: yup.string().nullable().required('Brew method is required'),
  coffee: yup
    .string()
    .required('Coffee name is required')
    .max(100, 'Coffee name must be 100 characters or less'),
  coffeeAmount: yup
    .string()
    .required('Coffee amount is required')
    .test('valid-range', 'Enter valid amount (0.1-100g)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 0.1 && num <= 100;
    }),
  grindSetting: yup
    .string()
    .required('Grind setting is required')
    .test('valid-range', 'Enter valid setting (0-100)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 0 && num <= 100;
    }),
  waterAmount: yup
    .string()
    .required('Water amount is required')
    .test('valid-range', 'Enter valid amount (1-1000g)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 1 && num <= 1000;
    }),
  temperature: yup
    .string()
    .required('Temperature is required')
    .test('valid-range', 'Enter valid temp (0-100C)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 0 && num <= 100;
    }),
  brewTime: yup
    .string()
    .required('Brew time is required')
    .test('valid-range', 'Enter valid time (1-3600s)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 1 && num <= 3600;
    }),
  notes: yup.string().default(''),
  tags: yup.array().of(yup.string().required()).default([]),
  rating: yup.number().min(0).max(5).default(3),
}) as yup.ObjectSchema<BrewForm>;

export type BrewFormSchema = yup.InferType<typeof brewFormSchema>;

export interface ValidationErrors {
  brewMethod?: string;
  coffee?: string;
  coffeeAmount?: string;
  grindSetting?: string;
  waterAmount?: string;
  temperature?: string;
  brewTime?: string;
}

export async function validateBrewForm(
  form: unknown,
): Promise<ValidationErrors> {
  try {
    await brewFormSchema.validate(form, { abortEarly: false });
    return {};
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: ValidationErrors = {};
      err.inner.forEach((error) => {
        if (error.path && error.path in errors === false) {
          (errors as Record<string, string>)[error.path] = error.message;
        }
      });
      return errors;
    }
    throw err;
  }
}

export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.keys(errors).length > 0;
}
