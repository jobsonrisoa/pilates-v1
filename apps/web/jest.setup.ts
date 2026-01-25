import '@testing-library/jest-dom';

// MSW setup - conditionally initialize to avoid module resolution issues
// MSW will be fully configured when needed for API mocking tests
try {
  const { server } = require('./test/mocks/server');
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
} catch {
  // MSW setup skipped - will be configured when API mocking is needed
}

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));
