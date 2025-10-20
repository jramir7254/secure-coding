import { BackendApi, type ApiError, PublicApi } from "@/lib/api";
export type { ApiError } from '@/lib/api'
import { logger } from "@/lib/logger";

export type RootRoutes = 'games' | 'admin' | 'auth' | 'questions' | 'teams' | ''
export type HttpMethods = 'get' | 'post' | 'delete' | 'patch' | 'put'

export interface BaseBackendResponse { message: string, success: boolean }


export function useApi(root: RootRoutes) {
    const call = async <T>(method: HttpMethods, route?: string, payload?: any): Promise<T> => {
        try {
            logger.debug(`REQ: ${method} /${root}${route}`, { payload })
            const { data } = await BackendApi[method]<T>(`/${root}${route}`, payload);
            logger.debug(`RES: ${method} /${root}${route}`, { data })

            return data;
        } catch (err: any) {
            logger.error('RAW ERR:', err)
            const error: ApiError = err.response?.data || {
                success: false,
                message: "Unknown error",
                code: "UNKNOWN",
            }
            logger.error('NORM ERR:', error)

            return Promise.reject(error)
        }
    }

    const publicCall = async <T>(method: HttpMethods, route?: string, payload?: any): Promise<T> => {
        try {
            logger.debug(`REQ: ${method} /${root}${route}`, { payload })
            const { data } = await PublicApi[method]<T>(`/${root}${route}`, payload);
            logger.debug(`RES: ${method} /${root}${route}`, { data })

            return data;
        } catch (err: any) {
            logger.error('RAW ERR:', err)
            const error: ApiError = err.response?.data || {
                success: false,
                message: "Unknown error",
                code: "UNKNOWN",
            }
            logger.error('NORM ERR:', error)

            return Promise.reject(error)
        }
    }



    return { call, publicCall }
}