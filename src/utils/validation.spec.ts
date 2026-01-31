import { describe, it, expect } from 'vitest';
import { validateBrewForm, hasValidationErrors, ValidationErrors, brewFormSchema } from './validation';
import { BrewForm } from '../models';

describe('brewFormSchema', () => {
  it('should be a valid yup schema', () => {
    expect(brewFormSchema).toBeDefined();
    expect(typeof brewFormSchema.validate).toBe('function');
  });
});

describe('validateBrewForm', () => {
  const validForm: BrewForm = {
    brewMethod: 'Espresso',
    coffee: 'Test Coffee',
    coffeeAmount: '18.0',
    grindSetting: '10.0',
    waterAmount: '36.0',
    temperature: '93.0',
    brewTime: '30.0',
    notes: '',
    tags: [],
    rating: 3,
  };

  it('should return no errors for a valid form', async () => {
    const errors = await validateBrewForm(validForm);
    expect(hasValidationErrors(errors)).toBe(false);
  });

  describe('brewMethod', () => {
    it('should return error when brewMethod is null', async () => {
      const form = { ...validForm, brewMethod: null };
      const errors = await validateBrewForm(form);
      expect(errors.brewMethod).toBe('Brew method is required');
    });

    it('should return error when brewMethod is empty string', async () => {
      const form = { ...validForm, brewMethod: '' };
      const errors = await validateBrewForm(form);
      expect(errors.brewMethod).toBe('Brew method is required');
    });
  });

  describe('coffee', () => {
    it('should return error when coffee is empty', async () => {
      const form = { ...validForm, coffee: '' };
      const errors = await validateBrewForm(form);
      expect(errors.coffee).toBe('Coffee name is required');
    });

    it('should return error when coffee exceeds 100 characters', async () => {
      const form = { ...validForm, coffee: 'a'.repeat(101) };
      const errors = await validateBrewForm(form);
      expect(errors.coffee).toBe('Coffee name must be 100 characters or less');
    });

    it('should accept coffee with exactly 100 characters', async () => {
      const form = { ...validForm, coffee: 'a'.repeat(100) };
      const errors = await validateBrewForm(form);
      expect(errors.coffee).toBeUndefined();
    });
  });

  describe('coffeeAmount', () => {
    it('should return error for non-numeric value', async () => {
      const form = { ...validForm, coffeeAmount: 'abc' };
      const errors = await validateBrewForm(form);
      expect(errors.coffeeAmount).toBe('Enter valid amount (0.1-100g)');
    });

    it('should return error for value below 0.1', async () => {
      const form = { ...validForm, coffeeAmount: '0.05' };
      const errors = await validateBrewForm(form);
      expect(errors.coffeeAmount).toBe('Enter valid amount (0.1-100g)');
    });

    it('should return error for value above 100', async () => {
      const form = { ...validForm, coffeeAmount: '101' };
      const errors = await validateBrewForm(form);
      expect(errors.coffeeAmount).toBe('Enter valid amount (0.1-100g)');
    });

    it('should accept value at minimum (0.1)', async () => {
      const form = { ...validForm, coffeeAmount: '0.1' };
      const errors = await validateBrewForm(form);
      expect(errors.coffeeAmount).toBeUndefined();
    });

    it('should accept value at maximum (100)', async () => {
      const form = { ...validForm, coffeeAmount: '100' };
      const errors = await validateBrewForm(form);
      expect(errors.coffeeAmount).toBeUndefined();
    });
  });

  describe('grindSetting', () => {
    it('should return error for non-numeric value', async () => {
      const form = { ...validForm, grindSetting: 'abc' };
      const errors = await validateBrewForm(form);
      expect(errors.grindSetting).toBe('Enter valid setting (0-100)');
    });

    it('should return error for value below 0', async () => {
      const form = { ...validForm, grindSetting: '-1' };
      const errors = await validateBrewForm(form);
      expect(errors.grindSetting).toBe('Enter valid setting (0-100)');
    });

    it('should return error for value above 100', async () => {
      const form = { ...validForm, grindSetting: '101' };
      const errors = await validateBrewForm(form);
      expect(errors.grindSetting).toBe('Enter valid setting (0-100)');
    });

    it('should accept value at minimum (0)', async () => {
      const form = { ...validForm, grindSetting: '0' };
      const errors = await validateBrewForm(form);
      expect(errors.grindSetting).toBeUndefined();
    });
  });

  describe('waterAmount', () => {
    it('should return error for non-numeric value', async () => {
      const form = { ...validForm, waterAmount: 'abc' };
      const errors = await validateBrewForm(form);
      expect(errors.waterAmount).toBe('Enter valid amount (1-1000g)');
    });

    it('should return error for value below 1', async () => {
      const form = { ...validForm, waterAmount: '0.5' };
      const errors = await validateBrewForm(form);
      expect(errors.waterAmount).toBe('Enter valid amount (1-1000g)');
    });

    it('should return error for value above 1000', async () => {
      const form = { ...validForm, waterAmount: '1001' };
      const errors = await validateBrewForm(form);
      expect(errors.waterAmount).toBe('Enter valid amount (1-1000g)');
    });
  });

  describe('temperature', () => {
    it('should return error for non-numeric value', async () => {
      const form = { ...validForm, temperature: 'abc' };
      const errors = await validateBrewForm(form);
      expect(errors.temperature).toBe('Enter valid temp (0-100C)');
    });

    it('should return error for value below 0', async () => {
      const form = { ...validForm, temperature: '-1' };
      const errors = await validateBrewForm(form);
      expect(errors.temperature).toBe('Enter valid temp (0-100C)');
    });

    it('should return error for value above 100', async () => {
      const form = { ...validForm, temperature: '101' };
      const errors = await validateBrewForm(form);
      expect(errors.temperature).toBe('Enter valid temp (0-100C)');
    });
  });

  describe('brewTime', () => {
    it('should return error for non-numeric value', async () => {
      const form = { ...validForm, brewTime: 'abc' };
      const errors = await validateBrewForm(form);
      expect(errors.brewTime).toBe('Enter valid time (1-3600s)');
    });

    it('should return error for value below 1', async () => {
      const form = { ...validForm, brewTime: '0' };
      const errors = await validateBrewForm(form);
      expect(errors.brewTime).toBe('Enter valid time (1-3600s)');
    });

    it('should return error for value above 3600', async () => {
      const form = { ...validForm, brewTime: '3601' };
      const errors = await validateBrewForm(form);
      expect(errors.brewTime).toBe('Enter valid time (1-3600s)');
    });
  });
});

describe('hasValidationErrors', () => {
  it('should return false for empty errors object', () => {
    const errors: ValidationErrors = {};
    expect(hasValidationErrors(errors)).toBe(false);
  });

  it('should return true when there are errors', () => {
    const errors: ValidationErrors = { coffee: 'Coffee name is required' };
    expect(hasValidationErrors(errors)).toBe(true);
  });
});
