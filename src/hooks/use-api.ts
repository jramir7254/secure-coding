import { BackendApi, type ApiError } from "@/lib/api";
export type { ApiError } from '@/lib/api'

export type RootRoutes = 'games' | 'admin' | 'auth' | '' | 'teams'
export type HttpMethods = 'get' | 'post' | 'delete' | 'patch' | 'put'

export interface BaseBackendResponse { message: string, success: boolean }

export function useApi(root: RootRoutes) {

    const call = async <T>(method: HttpMethods, route?: string, payload?: any): Promise<T> => {
        try {
            const { data } = await BackendApi[method]<T>(`/${root}${route}`, payload);
            return data;
        } catch (err) {
            throw err as ApiError;
        }
    }


    return { call }
}