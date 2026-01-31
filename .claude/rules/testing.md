# Testing Standards

## Frontend Testing Assertions

Use native Vitest matchers instead of jest-dom matchers:

- Use `toBeDefined()` for positive element assertions
  ```typescript
  expect(screen.getByText('Hello')).toBeDefined();
  ```

- Use `toBeNull()` for negative assertions with `queryBy*` methods
  ```typescript
  expect(screen.queryByText('Hello')).toBeNull();
  ```

- Avoid `toBeInTheDocument()` and `not.toBeInTheDocument()`
