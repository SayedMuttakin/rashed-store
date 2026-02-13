import axios from 'axios';

const API = axios.create({
    // Since we are hosting on Vercel, relative path might work if we use a proxy or specific setup.
    // For now, let's assume the backend will be dev-accessible or we use a central config.
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
