import axios from 'axios';
import { tokenStore } from '@/features/auth/api/token-store';
export const PistonApi = axios.create({
    baseURL: 'https://emkc.org/api/v2/piston'
})


export const BackendApi = axios.create({
    baseURL: 'http://localhost:3001'
})


BackendApi.interceptors.request.use(
    (config) => {
        const token = tokenStore.get();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);