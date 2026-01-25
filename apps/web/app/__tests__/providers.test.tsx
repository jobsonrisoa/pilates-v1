import { render } from '@testing-library/react';

import { Providers } from '../providers';

// Mock next-themes
jest.mock('next-themes', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
  QueryClient: jest.fn().mockImplementation(() => ({})),
}));

describe('Providers', () => {
  it('renders children', () => {
    const { getByTestId, getByText } = render(
      <Providers>
        <div>Test Content</div>
      </Providers>,
    );

    expect(getByText('Test Content')).toBeInTheDocument();
    expect(getByTestId('query-client-provider')).toBeInTheDocument();
    expect(getByTestId('theme-provider')).toBeInTheDocument();
  });
});
