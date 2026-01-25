import { render, screen } from '@testing-library/react';

import LoginPage from '../page';

describe('LoginPage', () => {
  it('renders the login heading', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('renders the placeholder text', () => {
    render(<LoginPage />);
    expect(screen.getByText(/login page placeholder/i)).toBeInTheDocument();
  });
});

