import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import Authentication from './Authentication';
import { renderWithProviders } from '../../test/utils/renderHelpers';

const mockSignInWithPopup = vi.fn();

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  GoogleAuthProvider: vi.fn(),
  signInWithPopup: (...args: unknown[]) => mockSignInWithPopup(...args),
}));

describe('Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithPopup.mockResolvedValue({ user: { uid: 'test-user' } });
  });

  it('should render sign in button', () => {
    renderWithProviders(<Authentication />);

    expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeDefined();
  });

  it('should call signInWithPopup when button is clicked', async () => {
    renderWithProviders(<Authentication />);

    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }));

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalled();
    });
  });

  it('should handle popup-closed-by-user error gracefully', async () => {
    const error = { code: 'auth/popup-closed-by-user' };
    mockSignInWithPopup.mockRejectedValue(error);

    renderWithProviders(<Authentication />);

    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }));

    await waitFor(() => {
      expect(mockSignInWithPopup).toHaveBeenCalled();
    });

    // Should not show error notification for popup closed
    expect(screen.queryByText(/Sign-in failed/i)).toBeNull();
  });

  it('should show error notification for other auth errors', async () => {
    const error = { code: 'auth/network-request-failed' };
    mockSignInWithPopup.mockRejectedValue(error);

    renderWithProviders(<Authentication />);

    fireEvent.click(screen.getByRole('button', { name: /Continue with Google/i }));

    await waitFor(() => {
      expect(screen.getByText(/Sign-in failed/i)).toBeDefined();
    });
  });
});
