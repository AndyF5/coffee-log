import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useCoffeeNames from './useCoffeeNames';

const mockUnsubscribe = vi.fn();
const mockOnSnapshot = vi.fn();

const mockAuth = {
  currentUser: { uid: 'test-user-id' },
};

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuth),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
}));

describe('useCoffeeNames', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSnapshot.mockReturnValue(mockUnsubscribe);
    mockAuth.currentUser = { uid: 'test-user-id' };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty array initially', () => {
    const { result } = renderHook(() => useCoffeeNames());

    expect(result.current.coffeeNames).toEqual([]);
  });

  it('should set up Firestore listener when user is authenticated', () => {
    renderHook(() => useCoffeeNames());

    expect(mockOnSnapshot).toHaveBeenCalled();
  });

  it('should not set up listener when user is not authenticated', () => {
    mockAuth.currentUser = null as unknown as { uid: string };

    renderHook(() => useCoffeeNames());

    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it('should return coffee names from Firestore', async () => {
    const mockDocs = [
      {
        data: () => ({
          name: 'Ethiopian Yirgacheffe',
          uid: 'test-user-id',
          lastUsed: { seconds: 1234567890 },
        }),
      },
      {
        data: () => ({
          name: 'Colombian Geisha',
          uid: 'test-user-id',
          lastUsed: { seconds: 1234567880 },
        }),
      },
    ];

    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({ docs: mockDocs });
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useCoffeeNames());

    await waitFor(() => {
      expect(result.current.coffeeNames).toEqual([
        'Ethiopian Yirgacheffe',
        'Colombian Geisha',
      ]);
    });
  });

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useCoffeeNames());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should handle Firestore errors gracefully', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockOnSnapshot.mockImplementation((query, successCallback, errorCallback) => {
      errorCallback(new Error('Firestore error'));
      return mockUnsubscribe;
    });

    renderHook(() => useCoffeeNames());

    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching coffee names:',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
