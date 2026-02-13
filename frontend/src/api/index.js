import axios from 'axios';

const API = axios.create({
    // Add /api to the base URL if it's not already there
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add a request interceptor to include the auth token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;
