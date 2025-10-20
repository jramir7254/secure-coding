import axios from 'axios';
import { useTokenStore } from '@/features/auth/hooks/use-auth';

export const PistonApi = axios.create({
    baseURL: 'https://emkc.org/api/v2/piston'
})


export const BackendApi = axios.create({
    baseURL: 'http://localhost:3001'
})


export const PublicApi = axios.create({
    baseURL: 'http://localhost:3001'
})

export interface ApiError {
    success: boolean;
    message: string;
    code: string;
}


BackendApi.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('access_token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        const err: ApiError = error.response?.data || {
            success: false,
            message: "Unknown error",
            code: "UNKNOWN",
        }
        return Promise.reject(err)
    }
);