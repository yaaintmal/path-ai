// React import not required with new JSX transform
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminLogsWidget from '../components/admin/AdminLogsWidget';

type GlobalWithFetch = typeof global & {
  fetch: jest.Mock;
};

describe('AdminLogsWidget', () => {
  let createObjectURLSpy: jest.SpyInstance;
  let anchorClickSpy: jest.SpyInstance;

  beforeEach(() => {
    (global as unknown as GlobalWithFetch).fetch = jest.fn();
    createObjectURLSpy = jest.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock');
    anchorClickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  afterEach(() => {
    createObjectURLSpy.mockRestore();
    anchorClickSpy.mockRestore();
  });

  const getMockFetch = () => (global as unknown as GlobalWithFetch).fetch;

  it('downloads admin logs on click', async () => {
    const blob = new Blob(['log line']);
    const mockFetch = getMockFetch();
    mockFetch.mockResolvedValueOnce({ ok: true, blob: async () => blob });
    const appendSpy = jest.spyOn(document.body, 'appendChild');

    render(<AdminLogsWidget />);
    const adminButton = screen.getByRole('button', { name: /download admin logs for/i });
    fireEvent.click(adminButton);

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    expect(appendSpy).toHaveBeenCalled();
    appendSpy.mockRestore();
  });

  it('downloads critical logs on click', async () => {
    const blob = new Blob(['critical line']);
    const mockFetch = getMockFetch();
    mockFetch.mockResolvedValueOnce({ ok: true, blob: async () => blob });

    render(<AdminLogsWidget />);
    const criticalButton = screen.getByRole('button', { name: /download critical logs for/i });
    fireEvent.click(criticalButton);

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());

    const [url] = mockFetch.mock.calls[0];
    expect(url).toContain('type=critical');
  });

  it('shows error on failed fetch', async () => {
    const mockFetch = getMockFetch();
    mockFetch.mockResolvedValueOnce({ ok: false });
    render(<AdminLogsWidget />);
    const btn = screen.getByRole('button', { name: /download admin logs for/i });
    fireEvent.click(btn);
    await waitFor(() => expect(screen.getByText(/failed to fetch logs/i)).toBeInTheDocument());
  });
});
