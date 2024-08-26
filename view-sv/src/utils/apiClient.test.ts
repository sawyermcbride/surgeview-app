import api from "./apiClient";
import '@testing-library/jest-dom';
import axios from "axios";


test('api client should not be undefined', () => {
    expect(api).toBeDefined();
    expect(api.interceptors.request.use).toBeDefined();
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
});

