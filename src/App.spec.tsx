import { render } from '@testing-library/react';
import { vi } from 'vitest';

import App from './App';

vi.mock('firebase/auth', () => {
  return {
    getAuth: vi.fn(),
    onAuthStateChanged: vi.fn(),
  };
});

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<App />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(<App />);
    expect(getByText(/Coffee Log/gi)).toBeTruthy();
  });
});
