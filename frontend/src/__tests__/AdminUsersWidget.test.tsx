import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';

// Mock getApiUrl to avoid import.meta evaluation at test time
jest.mock('../config/app.config', () => ({ getApiUrl: (p: string) => p }));

import AdminUsersWidget from '../components/admin/AdminUsersWidget';

describe('AdminUsersWidget', () => {
  const users = [
    {
      id: '1',
      name: 'Alice',
      email: 'alice@example.com',
      roles: ['user'],
      lastActivity: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Bob',
      email: 'bob@example.com',
      roles: ['user', 'admin'],
      lastActivity: null,
    },
  ];

  beforeEach(() => {
    // mock fetch
    (global as any).fetch = jest.fn((url: string, opts?: any) => {
      if (url.endsWith('/api/users/admin/all')) {
        return Promise.resolve({ ok: true, json: () => Promise.resolve(users) });
      }
      if (opts?.method === 'PUT') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      if (opts?.method === 'DELETE') {
        return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
      }
      return Promise.resolve({ ok: false });
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders user rows', async () => {
    render(<AdminUsersWidget />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  it('edits roles', async () => {
    render(<AdminUsersWidget />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    const editBtn = screen.getByRole('button', { name: /edit roles for alice/i });
    fireEvent.click(editBtn);
    const input = screen.getByDisplayValue('user');
    fireEvent.change(input, { target: { value: 'admin,user' } });
    const save = screen.getByText(/Save/i);
    fireEvent.click(save);
    await waitFor(() => expect((global as any).fetch).toHaveBeenCalled());
  });

  it('deletes user after confirmation', async () => {
    (window as any).confirm = jest.fn(() => true);
    render(<AdminUsersWidget />);
    expect(await screen.findByText('Alice')).toBeInTheDocument();
    const deleteBtn = screen.getByRole('button', { name: /delete alice/i });
    fireEvent.click(deleteBtn);
    await waitFor(() => expect((global as any).fetch).toHaveBeenCalled());
  });
});
