// __mocks__/axios.ts
import { jest } from '@jest/globals';


const axiosMock = {
  get: jest.fn(),
  post: jest.fn(),
  // Add other methods if needed
};

export default axiosMock;