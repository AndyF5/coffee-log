import { Timestamp } from 'firebase/firestore';

export interface Coffee {
  name: string;
  uid: string;
  lastUsed: Timestamp;
}

/**
 * Normalizes a coffee name for use as a document ID.
 * Converts to lowercase, replaces spaces with hyphens, removes special characters.
 */
export function normalizeCoffeeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Generates a unique document ID for a coffee.
 * Format: {uid}_{normalizedName}
 */
export function getCoffeeDocId(uid: string, coffeeName: string): string {
  return `${uid}_${normalizeCoffeeName(coffeeName)}`;
}
