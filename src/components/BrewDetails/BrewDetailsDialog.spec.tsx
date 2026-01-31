import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import BrewDetailsDialog from './BrewDetailsDialog';
import { renderWithProviders } from '../../test/utils/renderHelpers';
import { createMockBrewWithID } from '../../test/utils/factories';

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
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
  Timestamp: {
    now: vi.fn(() => ({
      toDate: () => new Date('2024-01-15T10:30:00Z'),
    })),
  },
}));

describe('BrewDetailsDialog', () => {
  const mockOnClose = vi.fn();
  const mockOnBrewRepeat = vi.fn();
  const mockOnBrewUpdate = vi.fn();
  const mockOnBrewDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockOnBrewUpdate.mockResolvedValue(undefined);
    mockOnBrewDelete.mockResolvedValue(undefined);
  });

  it('should render brew details when open', () => {
    const brew = createMockBrewWithID({ coffee: 'Test Coffee', brewMethod: 'Espresso' });

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
      />
    );

    expect(screen.getByText('Test Coffee | Espresso')).toBeDefined();
    expect(screen.getByText('18 g')).toBeDefined();
  });

  it('should not render when brew is undefined', () => {
    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={undefined}
        onBrewRepeat={mockOnBrewRepeat}
      />
    );

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('should call onBrewRepeat when Repeat Brew is clicked', () => {
    const brew = createMockBrewWithID();

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Repeat Brew/i }));

    expect(mockOnBrewRepeat).toHaveBeenCalled();
  });

  it('should show Edit button when onBrewUpdate is provided', () => {
    const brew = createMockBrewWithID();

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
        onBrewUpdate={mockOnBrewUpdate}
      />
    );

    expect(screen.getByRole('button', { name: /Edit/i })).toBeDefined();
  });

  it('should show Delete button when onBrewDelete is provided', () => {
    const brew = createMockBrewWithID();

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
        onBrewDelete={mockOnBrewDelete}
      />
    );

    expect(screen.getByRole('button', { name: /Delete/i })).toBeDefined();
  });

  it('should switch to edit mode when Edit is clicked', () => {
    const brew = createMockBrewWithID({ coffee: 'Original Coffee' });

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
        onBrewUpdate={mockOnBrewUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    // In edit mode, should show form fields
    expect(screen.getByLabelText(/^Coffee$/i)).toBeDefined();
    expect(screen.getByDisplayValue('Original Coffee')).toBeDefined();

    // Should show Save and Cancel buttons
    expect(screen.getByRole('button', { name: /Save/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeDefined();
  });

  it('should exit edit mode when Cancel is clicked', () => {
    const brew = createMockBrewWithID();

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
        onBrewUpdate={mockOnBrewUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    // Should be back to view mode
    expect(screen.getByRole('button', { name: /Edit/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Repeat Brew/i })).toBeDefined();
  });

  it('should call onBrewUpdate when Save is clicked with valid data', async () => {
    const brew = createMockBrewWithID({ id: 'brew-123' });

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
        onBrewUpdate={mockOnBrewUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    // Modify a field
    const coffeeInput = screen.getByLabelText(/^Coffee$/i);
    fireEvent.change(coffeeInput, { target: { value: 'Updated Coffee' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(mockOnBrewUpdate).toHaveBeenCalledWith(
        'brew-123',
        expect.objectContaining({ coffee: 'Updated Coffee' })
      );
    });
  });

  it('should show validation errors in edit mode', async () => {
    const brew = createMockBrewWithID();

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
        onBrewUpdate={mockOnBrewUpdate}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Edit/i }));

    // Clear required field
    const coffeeInput = screen.getByLabelText(/^Coffee$/i);
    fireEvent.change(coffeeInput, { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /Save/i }));

    await waitFor(() => {
      expect(screen.getByText('Coffee name is required')).toBeDefined();
    });

    expect(mockOnBrewUpdate).not.toHaveBeenCalled();
  });

  it('should show delete confirmation when Delete is clicked', () => {
    const brew = createMockBrewWithID();

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
        onBrewDelete={mockOnBrewDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    expect(screen.getByText('Delete Brew')).toBeDefined();
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeDefined();
  });

  it('should call onBrewDelete when delete is confirmed', async () => {
    const brew = createMockBrewWithID({ id: 'brew-to-delete' });

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
        onBrewDelete={mockOnBrewDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    // Find and click the confirm button in the confirmation dialog
    const confirmButtons = screen.getAllByRole('button', { name: /Delete/i });
    const confirmButton = confirmButtons[confirmButtons.length - 1];
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockOnBrewDelete).toHaveBeenCalledWith('brew-to-delete');
    });
  });

  it('should close delete confirmation when Cancel is clicked', async () => {
    const brew = createMockBrewWithID();

    renderWithProviders(
      <BrewDetailsDialog
        open={true}
        onClose={mockOnClose}
        brew={brew}
        onBrewRepeat={mockOnBrewRepeat}
        onBrewDelete={mockOnBrewDelete}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    // Confirmation dialog should be visible
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeDefined();

    // Click cancel in confirmation dialog
    const cancelButtons = screen.getAllByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButtons[cancelButtons.length - 1]);

    await waitFor(() => {
      expect(screen.queryByText(/Are you sure you want to delete/i)).toBeNull();
    });
  });
});
