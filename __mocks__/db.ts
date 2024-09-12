import { jest } from "@jest/globals";

export const query = jest.fn().mockResolvedValue({ rows: [{ id: 5 }] });
export const testConnection = jest.fn(); 