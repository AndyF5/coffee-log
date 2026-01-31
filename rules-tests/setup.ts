import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { readFileSync } from 'fs';
import { beforeAll, afterAll, afterEach } from 'vitest';

let testEnv: RulesTestEnvironment;

export function getTestEnv(): RulesTestEnvironment {
  if (!testEnv) {
    throw new Error('Test environment not initialized. Ensure setup has run.');
  }
  return testEnv;
}

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'coffee-log-test',
    firestore: {
      host: 'localhost',
      port: 8080,
      rules: readFileSync('firestore.rules', 'utf8'),
    },
  });
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});
