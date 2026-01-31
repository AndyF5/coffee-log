import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import CoffeeFormDialog from './CoffeeFormDialog';
import { renderWithProviders } from '../../test/utils/renderHelpers';

const mockAddDoc = vi.fn();
const mockSetDoc = vi.fn();
const mockOnSnapshot = vi.fn(() => vi.fn());
const mockAuth = {
  currentUser: { uid: 'test-user-id' },
};

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuth),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: () => mockOnSnapshot(),
  Timestamp: {
    now: vi.fn(() => ({
      toDate: () => new Date('2024-01-15T10:30:00Z'),
    })),
  },
}));

describe('CoffeeFormDialog', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddDoc.mockResolvedValue({ id: 'new-brew-id' });
    mockAuth.currentUser = { uid: 'test-user-id' };
  });

  it('should render dialog when open', () => {
    renderWithProviders(<CoffeeFormDialog open={true} onClose={mockOnClose} />);

    expect(screen.getByText('Coffee Logger')).toBeDefined();
    expect(
      screen.getByText('Enter your coffee information here!'),
    ).toBeDefined();
  });

  it('should not render dialog when closed', () => {
    renderWithProviders(
      <CoffeeFormDialog open={false} onClose={mockOnClose} />,
    );

    expect(screen.queryByText('Coffee Logger')).toBeNull();
  });

  it('should render Save and Cancel buttons', () => {
    renderWithProviders(<CoffeeFormDialog open={true} onClose={mockOnClose} />);

    expect(screen.getByRole('button', { name: /Save/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeDefined();
  });

  it('should call onClose when Cancel is clicked', () => {
    renderWithProviders(<CoffeeFormDialog open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should show validation errors when submitting empty form', async () => {
    renderWithProviders(<CoffeeFormDialog open={true} onClose={mockOnClose} />);

    // Submit form
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.submit(saveButton.closest('form')!);

    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Brew method is required')).toBeDefined();
    });

    expect(mockAddDoc).not.toHaveBeenCalled();
  });

  it('should call addDoc with correct data when form is valid', async () => {
    const validInitialState = {
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

    renderWithProviders(
      <CoffeeFormDialog
        open={true}
        onClose={mockOnClose}
        initialFormState={validInitialState}
      />,
    );

    // Wait for form to be populated with initial values
    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Coffee')).toBeDefined();
    });

    // Submit form
    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.submit(saveButton.closest('form')!);

    await waitFor(() => {
      expect(mockAddDoc).toHaveBeenCalled();
    });

    const callArgs = mockAddDoc.mock.calls[0][1];
    expect(callArgs).toMatchObject({
      coffee: 'Test Coffee',
      brewMethod: 'Espresso',
      uid: 'test-user-id',
    });
  });

  it('should close dialog on successful save', async () => {
    const validInitialState = {
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

    renderWithProviders(
      <CoffeeFormDialog
        open={true}
        onClose={mockOnClose}
        initialFormState={validInitialState}
      />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Coffee')).toBeDefined();
    });

    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.submit(saveButton.closest('form')!);

    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should show error notification on Firestore failure', async () => {
    mockAddDoc.mockRejectedValue(new Error('Firestore error'));

    const validInitialState = {
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

    renderWithProviders(
      <CoffeeFormDialog
        open={true}
        onClose={mockOnClose}
        initialFormState={validInitialState}
      />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Coffee')).toBeDefined();
    });

    const saveButton = screen.getByRole('button', { name: /Save/i });
    fireEvent.submit(saveButton.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText(/Failed to save brew/i)).toBeDefined();
    });

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('should use initialFormState when provided', async () => {
    const initialState = {
      brewMethod: 'Filter',
      coffee: 'Ethiopian',
      coffeeAmount: '15.0',
      grindSetting: '20.0',
      waterAmount: '250.0',
      temperature: '96.0',
      brewTime: '180.0',
      notes: 'Initial notes',
      tags: [],
      rating: 4,
    };

    renderWithProviders(
      <CoffeeFormDialog
        open={true}
        onClose={mockOnClose}
        initialFormState={initialState}
      />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Ethiopian')).toBeDefined();
    });

    expect(screen.getByDisplayValue('15.0')).toBeDefined();
    expect(screen.getByDisplayValue('Initial notes')).toBeDefined();
  });
});
