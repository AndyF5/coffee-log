import { vi } from 'vitest';

export const mockUser = {
  uid: 'test-user-id',
  email: 'test@example.com',
  displayName: 'Test User',
};

export const mockAuth = {
  currentUser: mockUser,
  signOut: vi.fn(),
};

export const mockUnsubscribe = vi.fn();

export const mockOnSnapshot = vi.fn(() => {
  return mockUnsubscribe;
});

export const mockAddDoc = vi.fn();
export const mockUpdateDoc = vi.fn();
export const mockDeleteDoc = vi.fn();
export const mockCollection = vi.fn();
export const mockDoc = vi.fn();
export const mockQuery = vi.fn();
export const mockWhere = vi.fn();
export const mockOrderBy = vi.fn();
export const mockLimit = vi.fn();

export const mockSignInWithPopup = vi.fn();

export function setupFirebaseMocks() {
  vi.mock('firebase/auth', () => ({
    getAuth: vi.fn(() => mockAuth),
    onAuthStateChanged: vi.fn((auth, callback) => {
      callback(mockUser);
      return vi.fn();
    }),
    GoogleAuthProvider: vi.fn(),
    signInWithPopup: mockSignInWithPopup,
  }));

  vi.mock('firebase/firestore', () => ({
    getFirestore: vi.fn(),
    collection: mockCollection,
    doc: mockDoc,
    addDoc: mockAddDoc,
    updateDoc: mockUpdateDoc,
    deleteDoc: mockDeleteDoc,
    onSnapshot: mockOnSnapshot,
    query: mockQuery,
    where: mockWhere,
    orderBy: mockOrderBy,
    limit: mockLimit,
    Timestamp: {
      now: vi.fn(() => ({
        toDate: () => new Date('2024-01-15T10:30:00Z'),
      })),
    },
  }));
}

export function resetFirebaseMocks() {
  mockOnSnapshot.mockClear();
  mockAddDoc.mockClear();
  mockUpdateDoc.mockClear();
  mockDeleteDoc.mockClear();
  mockCollection.mockClear();
  mockDoc.mockClear();
  mockQuery.mockClear();
  mockWhere.mockClear();
  mockOrderBy.mockClear();
  mockLimit.mockClear();
  mockUnsubscribe.mockClear();
  mockSignInWithPopup.mockClear();
  mockAuth.signOut.mockClear();
}
