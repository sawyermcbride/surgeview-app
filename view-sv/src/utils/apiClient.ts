import axios from 'axios';
import { useHistory } from 'react-router-dom';

const api = axios.create({
    baseURL: 'http://10.0.0.47:3001',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            // Attempt to refresh the token
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await axios.post('http://10.0.0.47:3001/auth/refresh-token', { token: refreshToken });
                localStorage.setItem('token', data.token);
                originalRequest.headers.Authorization = `Bearer ${data.token}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
