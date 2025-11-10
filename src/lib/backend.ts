import { isAxiosError } from "axios";
import { logger, setCorrelationId, clearCorrelationId } from "@/lib/logger";
import { BackendApi } from "./api";


export type RootRoutes = 'games' | 'admin' | 'auth' | 'questions' | 'teams' | ''
export type HttpMethods = 'get' | 'post' | 'delete' | 'patch' | 'put'

export interface BaseBackendResponse { message: string, success: boolean }

export interface ApiError {
    success: boolean;
    message: string;
    code: string;
}

export type CallParams = { root: RootRoutes, route?: string, payload?: any }



export const backend = {
    get: <T>({ root, route = '', payload }: CallParams) => apiCall<T>('get', root, route, payload),
    post: <T>({ root, route = '', payload }: CallParams) => apiCall<T>('post', root, route, payload),
    delete: <T>({ root, route = '', payload }: CallParams) => apiCall<T>('delete', root, route, payload),
    put: <T>({ root, route = '', payload }: CallParams) => apiCall<T>('put', root, route, payload),
    patch: <T>({ root, route = '', payload }: CallParams) => apiCall<T>('patch', root, route, payload),
}

export async function apiCall<T>(
    method: HttpMethods,
    root: string,
    route = '',
    payload?: any
): Promise<T> {
    try {
        setCorrelationId(`${method.toUpperCase()}: ${root}${route}`);
        logger.debug(`request:`, { path: `/${root}${route}`, method, root, route, payload });

        const { data } = await BackendApi[method]<T>(`/${root}${route}`, payload);

        const normalized = normalizeJsonStrings(data);

        logger.debug(`response (normalized):`, { data: normalized });

        return normalized;
    } catch (err: any) {
        logger.error('raw error:', err);
        const error: ApiError =
            err.response?.data || {
                success: false,
                message: 'Unknown error',
                code: 'UNKNOWN',
            };
        logger.error('normalized error:', error);

        return Promise.reject(error);
    } finally {
        clearCorrelationId();
    }
}

// utils/normalizeJsonStrings.ts

export function normalizeJsonStrings(data: any): any {
    if (Array.isArray(data)) {
        return data.map(normalizeJsonStrings);
    }

    if (data && typeof data === 'object') {
        const normalized: Record<string, any> = {};
        for (const [key, value] of Object.entries(data)) {
            normalized[key] = normalizeJsonStrings(value);
        }
        return normalized;
    }

    if (typeof data === 'string') {
        const trimmed = data.trim();
        // Try to parse if it looks like JSON
        if ((trimmed.startsWith('{') && trimmed.endsWith('}')) || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
            try {
                const parsed = JSON.parse(trimmed);
                // Recursively normalize parsed content too
                return normalizeJsonStrings(parsed);
            } catch {
                return data; // leave it as-is if invalid JSON
            }
        }
    }

    return data;
}

