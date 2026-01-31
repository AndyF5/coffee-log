import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateBrew, deleteBrew } from './brewService';
import { createMockBrewForm } from '../test/utils/factories';
import { User } from 'firebase/auth';

const mockUpdateDoc = vi.fn();
const mockDeleteDoc = vi.fn();
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
  updateDoc: (...args: unknown[]) => mockUpdateDoc(...args),
  deleteDoc: (...args: unknown[]) => mockDeleteDoc(...args),
}));

describe('brewService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.currentUser = { uid: 'test-user-id' };
    mockUpdateDoc.mockResolvedValue(undefined);
    mockDeleteDoc.mockResolvedValue(undefined);
  });

  describe('updateBrew', () => {
    it('should throw error if user not authenticated', async () => {
      mockAuth.currentUser = null! as User;

      await expect(updateBrew('brew-id', createMockBrewForm())).rejects.toThrow(
        'User must be authenticated to update a brew',
      );
    });

    it('should call updateDoc with correct reference and data', async () => {
      const brewForm = createMockBrewForm({
        brewMethod: 'Filter',
        coffee: 'Updated Coffee',
        coffeeAmount: '20.0',
      });

      await updateBrew('brew-123', brewForm);

      expect(mockDoc).toHaveBeenCalled();
      expect(mockUpdateDoc).toHaveBeenCalled();
      const callArgs = mockUpdateDoc.mock.calls[0][1];
      expect(callArgs.brewMethod).toBe('Filter');
      expect(callArgs.coffee).toBe('Updated Coffee');
      expect(callArgs.coffeeAmount).toBe(20.0);
    });

    it('should parse numeric string values to numbers', async () => {
      const brewForm = createMockBrewForm({
        coffeeAmount: '18.5',
        grindSetting: '12.3',
        waterAmount: '200',
        temperature: '94.5',
        brewTime: '45',
      });

      await updateBrew('brew-123', brewForm);

      expect(mockUpdateDoc).toHaveBeenCalled();
      const callArgs = mockUpdateDoc.mock.calls[0][1];
      expect(callArgs.coffeeAmount).toBe(18.5);
      expect(callArgs.grindSetting).toBe(12.3);
      expect(callArgs.waterAmount).toBe(200);
      expect(callArgs.temperature).toBe(94.5);
      expect(callArgs.brewTime).toBe(45);
    });
  });

  describe('deleteBrew', () => {
    it('should throw error if user not authenticated', async () => {
      mockAuth.currentUser = null! as User;

      await expect(deleteBrew('brew-id')).rejects.toThrow(
        'User must be authenticated to delete a brew',
      );
    });

    it('should call deleteDoc with correct reference', async () => {
      await deleteBrew('brew-456');

      expect(mockDoc).toHaveBeenCalled();
      expect(mockDeleteDoc).toHaveBeenCalled();
    });
  });
});
