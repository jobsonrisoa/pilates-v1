import { render, screen } from '@testing-library/react';

import HomePage from '../page';

// Mock next/link
jest.mock('next/link', () => {
  const LinkMock = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  LinkMock.displayName = 'Link';
  return LinkMock;
});

describe('HomePage', () => {
  it('renders the main heading', () => {
    render(<HomePage />);
    expect(screen.getByRole('heading', { name: /pilates system/i })).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<HomePage />);
    expect(screen.getByText(/initial project/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<HomePage />);
    expect(screen.getByRole('link', { name: /go to login/i })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: /go to dashboard/i })).toHaveAttribute(
      'href',
      '/dashboard',
    );
  });
});
