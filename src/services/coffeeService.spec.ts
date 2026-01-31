import { describe, it, expect, vi, beforeEach } from 'vitest';
import { upsertCoffee } from './coffeeService';

const mockSetDoc = vi.fn();
const mockDoc = vi.fn();

const mockAuth = {
  currentUser: { uid: 'test-user-id' },
};

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuth),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  doc: (...args: unknown[]) => mockDoc(...args),
  setDoc: (...args: unknown[]) => mockSetDoc(...args),
  Timestamp: {
    now: vi.fn(() => ({ seconds: 1234567890 })),
  },
}));

describe('coffeeService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSetDoc.mockResolvedValue(undefined);
    mockAuth.currentUser = { uid: 'test-user-id' };
  });

  describe('upsertCoffee', () => {
    it('should call setDoc with correct document reference', async () => {
      await upsertCoffee('Ethiopian Yirgacheffe');

      expect(mockDoc).toHaveBeenCalledWith(
        undefined, // getFirestore() returns undefined in mock
        'coffees',
        'test-user-id_ethiopian-yirgacheffe'
      );
    });

    it('should call setDoc with merge option', async () => {
      await upsertCoffee('Test Coffee');

      expect(mockSetDoc).toHaveBeenCalledWith(
        undefined, // doc() returns undefined in mock
        expect.objectContaining({
          name: 'Test Coffee',
          uid: 'test-user-id',
        }),
        { merge: true }
      );
    });

    it('should normalize coffee name for document ID', async () => {
      await upsertCoffee('My Special Coffee!');

      expect(mockDoc).toHaveBeenCalledWith(
        undefined,
        'coffees',
        'test-user-id_my-special-coffee'
      );
    });

    it('should trim whitespace from coffee name', async () => {
      await upsertCoffee('  Trimmed Coffee  ');

      expect(mockSetDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          name: 'Trimmed Coffee',
        }),
        { merge: true }
      );
    });

    it('should not call setDoc for empty coffee name', async () => {
      await upsertCoffee('');

      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('should not call setDoc for whitespace-only coffee name', async () => {
      await upsertCoffee('   ');

      expect(mockSetDoc).not.toHaveBeenCalled();
    });

    it('should throw error when user is not authenticated', async () => {
      mockAuth.currentUser = null as unknown as { uid: string };

      await expect(upsertCoffee('Test Coffee')).rejects.toThrow(
        'User must be authenticated to save coffee'
      );
    });

    it('should include lastUsed timestamp', async () => {
      await upsertCoffee('Timestamp Test');

      expect(mockSetDoc).toHaveBeenCalledWith(
        undefined,
        expect.objectContaining({
          lastUsed: expect.anything(),
        }),
        { merge: true }
      );
    });
  });
});
