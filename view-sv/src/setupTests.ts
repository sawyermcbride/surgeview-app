import '@testing-library/jest-dom';
import { vi } from 'vitest';

beforeAll(() => {
  console.log("setupTests executed");

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  vi.mock('axios', async (importOriginal) => {
    const actualAxios = await importOriginal();
    
    return {
      ...actualAxios,
      default: {
        ...actualAxios.default,
        create: vi.fn(() => ({
          interceptors: {
            request: {
              use: vi.fn(),
            },
            response: {
              use: vi.fn(),
            },
          },
          get: vi.fn(),
          post: vi.fn(),
        })),
      },
    };
  });

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'token') return 'mockToken';
      return null;
    });
    
});
  
afterEach( () => {
  vi.clearAllMocks();
});