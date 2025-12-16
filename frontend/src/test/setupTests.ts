import '@testing-library/jest-dom/extend-expect';

// Global fetch mock for tests that rely on fetch
if (!(global as any).fetch) {
  (global as any).fetch = jest.fn();
}

// Ensure URL.createObjectURL exists for AdminLogs tests
if (typeof (URL as any).createObjectURL !== 'function') {
  (URL as any).createObjectURL = jest.fn(() => 'blob:mock');
}
