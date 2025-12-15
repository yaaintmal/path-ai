// React import not required with new JSX transform
import { render, screen } from '@testing-library/react';

jest.mock('../contexts/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Stub widgets that import app.config to avoid import.meta evaluation during tests
jest.mock('../components/admin/ApiTestWidget', () => ({
  ApiTestWidget: () => <div data-testid="api-test" />,
}));
jest.mock('../components/admin/CreateUserWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="create-user" />,
}));
// Stub other admin widgets that perform network/config reads
jest.mock('../components/admin/AdminUsersWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-users" />,
}));
jest.mock('../components/admin/AdminLogsWidget', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-logs" />,
}));

import { useAuth } from '../contexts/useAuth';
import AdminPage from '../pages/AdminPage';

describe('AdminPage', () => {
  beforeEach(() => {
    (useAuth as jest.Mock).mockReset();
  });

  it('shows unauthorized message when not an admin', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: null,
      isAuthenticated: false,
      userDetails: null,
    });
    render(<AdminPage />);
    expect(
      screen.getByText(/Unauthorized — this page is for admin users only./i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/Admin: Create User/i)).not.toBeInTheDocument();
  });

  it('shows admin widgets when user is admin', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { id: '1', email: 'admin@e.com', role: 'admin' },
      isAuthenticated: true,
      userDetails: {},
    });
    render(<AdminPage />);
    // Create User heading is present
    expect(screen.getByText(/Admin: Create User/i)).toBeInTheDocument();
    // Info card showing signed in email
    expect(screen.getByText(/You are signed in as:/i)).toBeInTheDocument();
  });
});
