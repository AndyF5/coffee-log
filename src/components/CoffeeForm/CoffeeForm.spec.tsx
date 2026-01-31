import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CoffeeForm from './CoffeeForm';
import { createMockBrewForm } from '../../test/utils/factories';
import { BrewForm } from '../../models';
import { brewFormSchema } from '../../utils/validation';

interface WrapperProps {
  children: React.ReactNode;
  defaultValues?: Partial<BrewForm>;
}

const FormWrapper = ({ children, defaultValues }: WrapperProps) => {
  const methods = useForm<BrewForm>({
    resolver: yupResolver(brewFormSchema),
    defaultValues: defaultValues || createMockBrewForm(),
  });
  return <FormProvider {...methods}>{children}</FormProvider>;
};

const renderCoffeeForm = (defaultValues?: Partial<BrewForm>) => {
  return render(
    <FormWrapper
      defaultValues={
        defaultValues
          ? { ...createMockBrewForm(), ...defaultValues }
          : undefined
      }
    >
      <CoffeeForm />
    </FormWrapper>,
  );
};

describe('CoffeeForm', () => {
  it('should render all form fields', () => {
    renderCoffeeForm();

    expect(screen.getByLabelText(/Brew Method/i)).toBeDefined();
    expect(screen.getByLabelText(/^Coffee$/i)).toBeDefined();
    expect(screen.getByLabelText(/Amount of Coffee/i)).toBeDefined();
    expect(screen.getByLabelText(/Grind Setting/i)).toBeDefined();
    expect(screen.getByLabelText(/Amount of Water/i)).toBeDefined();
    expect(screen.getByLabelText(/Temperature/i)).toBeDefined();
    expect(screen.getByLabelText(/Brew Time/i)).toBeDefined();
    expect(screen.getByLabelText(/Notes/i)).toBeDefined();
    expect(screen.getByLabelText(/Tags/i)).toBeDefined();
  });

  it('should display current values', () => {
    renderCoffeeForm({
      coffee: 'Ethiopian Yirgacheffe',
      coffeeAmount: '15.0',
    });

    expect(screen.getByDisplayValue('Ethiopian Yirgacheffe')).toBeDefined();
    expect(screen.getByDisplayValue('15.0')).toBeDefined();
  });

  it('should update coffee field on change', () => {
    renderCoffeeForm();

    const coffeeInput = screen.getByLabelText(/^Coffee$/i);
    fireEvent.change(coffeeInput, { target: { value: 'New Coffee' } });

    expect(screen.getByDisplayValue('New Coffee')).toBeDefined();
  });

  it('should update coffeeAmount field on change', () => {
    renderCoffeeForm();

    const coffeeAmountInput = screen.getByLabelText(/Amount of Coffee/i);
    fireEvent.change(coffeeAmountInput, { target: { value: '20.0' } });

    expect(screen.getByDisplayValue('20.0')).toBeDefined();
  });

  it('should update grindSetting field on change', () => {
    renderCoffeeForm();

    const grindInput = screen.getByLabelText(/Grind Setting/i);
    fireEvent.change(grindInput, { target: { value: '15.0' } });

    expect(screen.getByDisplayValue('15.0')).toBeDefined();
  });

  it('should update waterAmount field on change', () => {
    renderCoffeeForm();

    const waterInput = screen.getByLabelText(/Amount of Water/i);
    fireEvent.change(waterInput, { target: { value: '250.0' } });

    expect(screen.getByDisplayValue('250.0')).toBeDefined();
  });

  it('should update temperature field on change', () => {
    renderCoffeeForm();

    const tempInput = screen.getByLabelText(/Temperature/i);
    fireEvent.change(tempInput, { target: { value: '95.0' } });

    expect(screen.getByDisplayValue('95.0')).toBeDefined();
  });

  it('should update brewTime field on change', () => {
    renderCoffeeForm();

    const timeInput = screen.getByLabelText(/Brew Time/i);
    fireEvent.change(timeInput, { target: { value: '45.0' } });

    expect(screen.getByDisplayValue('45.0')).toBeDefined();
  });

  it('should update notes field on change', () => {
    renderCoffeeForm();

    const notesInput = screen.getByLabelText(/Notes/i);
    fireEvent.change(notesInput, { target: { value: 'Great brew!' } });

    expect(screen.getByDisplayValue('Great brew!')).toBeDefined();
  });

  it('should render rating component', () => {
    renderCoffeeForm();

    // MUI Rating uses radio inputs with name="rating"
    expect(screen.getAllByRole('radio').length).toBeGreaterThan(0);
  });

  describe('numeric input patterns', () => {
    it('should accept decimal values in numeric fields', () => {
      renderCoffeeForm();

      const numericFields = [
        { label: /Amount of Coffee/i, value: '18.5' },
        { label: /Grind Setting/i, value: '10.5' },
        { label: /Amount of Water/i, value: '36.5' },
        { label: /Temperature/i, value: '93.5' },
        { label: /Brew Time/i, value: '30.5' },
      ];

      for (const { label, value } of numericFields) {
        const input = screen.getByLabelText(label) as HTMLInputElement;
        fireEvent.change(input, { target: { value } });

        expect(input.value).toBe(value);
        expect(input.validity.patternMismatch).toBe(false);
      }
    });

    it('should accept comma as decimal separator', () => {
      renderCoffeeForm();

      const input = screen.getByLabelText(/Amount of Coffee/i) as HTMLInputElement;
      fireEvent.change(input, { target: { value: '18,5' } });

      expect(input.value).toBe('18,5');
      expect(input.validity.patternMismatch).toBe(false);
    });
  });
});
