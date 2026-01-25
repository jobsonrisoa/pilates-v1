import { render, screen } from '@testing-library/react';

import DashboardPage from '../page';

describe('DashboardPage', () => {
  it('renders the dashboard heading', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('renders the placeholder text', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/dashboard placeholder/i)).toBeInTheDocument();
  });
});

