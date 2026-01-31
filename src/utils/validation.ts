import {
  object,
  string,
  array,
  number,
  ObjectSchema,
  InferType,
  ValidationError,
} from 'yup';
import { BrewForm } from '../models';

export const brewFormSchema = object({
  brewMethod: string().nullable().required('Brew method is required'),
  coffee: string()
    .required('Coffee name is required')
    .max(100, 'Coffee name must be 100 characters or less'),
  coffeeAmount: string()
    .required('Coffee amount is required')
    .test('valid-range', 'Enter valid amount (0.1-100g)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 0.1 && num <= 100;
    }),
  grindSetting: string()
    .required('Grind setting is required')
    .test('valid-range', 'Enter valid setting (0-100)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 0 && num <= 100;
    }),
  waterAmount: string()
    .required('Water amount is required')
    .test('valid-range', 'Enter valid amount (1-1000g)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 1 && num <= 1000;
    }),
  temperature: string()
    .required('Temperature is required')
    .test('valid-range', 'Enter valid temp (0-100C)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 0 && num <= 100;
    }),
  brewTime: string()
    .required('Brew time is required')
    .test('valid-range', 'Enter valid time (1-3600s)', (value) => {
      const num = parseFloat(value || '');
      return !isNaN(num) && num >= 1 && num <= 3600;
    }),
  notes: string().default(''),
  tags: array().of(string().required()).default([]),
  rating: number().min(0).max(5).default(3),
}) as ObjectSchema<BrewForm>;

export type BrewFormSchema = InferType<typeof brewFormSchema>;

export { ValidationError };

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
    if (err instanceof ValidationError) {
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
