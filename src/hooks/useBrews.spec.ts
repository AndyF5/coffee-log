import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import useBrews from './useBrews';
import { createMockBrew } from '../test/utils/factories';
import { User } from 'firebase/auth';

const mockUnsubscribe = vi.fn();
const mockOnSnapshot = vi.fn();
const mockQuery = vi.fn();
const mockCollection = vi.fn();
const mockWhere = vi.fn();
const mockOrderBy = vi.fn();
const mockLimit = vi.fn();

const mockAuth = {
  currentUser: { uid: 'test-user-id' },
};

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuth),
  Unsubscribe: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: (...args: unknown[]) => mockCollection(...args),
  onSnapshot: (...args: unknown[]) => mockOnSnapshot(...args),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  orderBy: (...args: unknown[]) => mockOrderBy(...args),
  limit: (...args: unknown[]) => mockLimit(...args),
}));

describe('useBrews', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOnSnapshot.mockReturnValue(mockUnsubscribe);
    mockAuth.currentUser = { uid: 'test-user-id' };
  });

  it('should set up Firestore listener when authenticated', () => {
    renderHook(() => useBrews());

    expect(mockCollection).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalled();
    expect(mockOnSnapshot).toHaveBeenCalled();
  });

  it('should return empty array initially', () => {
    const { result } = renderHook(() => useBrews());
    expect(result.current.brews).toEqual([]);
  });

  it('should not set up listener when not authenticated', () => {
    mockAuth.currentUser = null! as User;

    renderHook(() => useBrews());

    expect(mockOnSnapshot).not.toHaveBeenCalled();
  });

  it('should map documents to BrewWithID correctly', () => {
    const mockBrew = createMockBrew();
    const mockDocs = [
      { id: 'brew-1', data: () => mockBrew },
      { id: 'brew-2', data: () => ({ ...mockBrew, coffee: 'Another Coffee' }) },
    ];

    mockOnSnapshot.mockImplementation((query, callback) => {
      callback({ docs: mockDocs });
      return mockUnsubscribe;
    });

    const { result } = renderHook(() => useBrews());

    expect(result.current.brews).toHaveLength(2);
    expect(result.current.brews[0].id).toBe('brew-1');
    expect(result.current.brews[0].coffee).toBe('Test Coffee');
    expect(result.current.brews[1].id).toBe('brew-2');
    expect(result.current.brews[1].coffee).toBe('Another Coffee');
  });

  it('should unsubscribe on unmount', () => {
    const { unmount } = renderHook(() => useBrews());

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should handle snapshot errors', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const testError = new Error('Firestore error');

    mockOnSnapshot.mockImplementation(
      (query, successCallback, errorCallback) => {
        errorCallback(testError);
        return mockUnsubscribe;
      },
    );

    renderHook(() => useBrews());

    expect(consoleSpy).toHaveBeenCalledWith('Error fetching brews:', testError);
    consoleSpy.mockRestore();
  });
});
