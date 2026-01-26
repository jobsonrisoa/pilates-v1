import { render, screen } from '@testing-library/react';

import LoginPage from '../page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock zustand store
jest.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    login: jest.fn(),
  }),
}));

describe('LoginPage', () => {
  it('renders the login heading', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /faça login em sua conta/i })).toBeInTheDocument();
  });

  it('renders the email input field', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/seu@email.com/i)).toBeInTheDocument();
  });

  it('renders the password input field', () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••••/i)).toBeInTheDocument();
  });

  it('renders the submit button', () => {
    render(<LoginPage />);
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });
});
