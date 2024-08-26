import '@testing-library/jest-dom';
import { vi } from 'vitest';

beforeAll(() => {
    window.matchMedia = window.matchMedia || function() {
      return {
        matches: false,
        addListener: function() {},
        removeListener: function() {},
      };
    };
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      if (key === 'token') return 'mockToken';
      return null;
    });
});
  
afterEach( () => {
  vi.clearAllMocks();
});