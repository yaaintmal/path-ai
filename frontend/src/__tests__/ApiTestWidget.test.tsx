// Mock getApiUrl to avoid import.meta in tests
jest.mock('../config/app.config', () => ({ getApiUrl: (p: string) => p }));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ApiTestWidget from '../components/admin/ApiTestWidget';

describe('ApiTestWidget', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
  });

  it('tests health endpoint and shows success', async () => {
    (global as any).fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
    render(<ApiTestWidget />);
    const btn = screen.getByRole('button', { name: /test health endpoint/i });
    fireEvent.click(btn);
    await waitFor(() => expect((global as any).fetch).toHaveBeenCalled());
    expect(await screen.findByText(/✅ Success/i)).toBeInTheDocument();
  });

  it('tests login endpoint and shows result', async () => {
    const loginResp = { message: 'ok', user: { id: '1' } };
    (global as any).fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ ok: true }) });
    // second call for login
    (global as any).fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => loginResp,
    });

    render(<ApiTestWidget />);
    const btn = screen.getByRole('button', { name: /test login endpoint/i });
    fireEvent.click(btn);
    await waitFor(() => expect((global as any).fetch).toHaveBeenCalled());
    expect(await screen.findByText(/🔐 Login test:/i)).toBeInTheDocument();
  });
});
