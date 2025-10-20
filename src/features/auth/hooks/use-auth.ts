import { useQuery, useMutation, useQueryClient, QueryClient } from "@tanstack/react-query";
import { useApi } from "@/hooks/use-api";
import { jwtDecode } from "jwt-decode";
import useAppNavigation from "@/hooks/use-nav";
import { create } from 'zustand'


export type DecodedToken = {
    id: string,
    teamName: string;
    accessCode: string;
    isAdmin: boolean;
};

const _KEY = "access_token";

interface TokenState {
    token: string | null
    get(): string | null
    set: (t: string) => void
    clear: () => void
}

export const useTokenStore = create<TokenState>((set) => ({
    token: sessionStorage.getItem(_KEY),
    get: () => sessionStorage.getItem(_KEY),
    set: (t) => {
        sessionStorage.setItem(_KEY, t)
        set({ token: t })
    },
    clear: () => {
        sessionStorage.removeItem(_KEY)
        set({ token: null })
    },
}))

export function decodeToken(token: string | null): DecodedToken | null {
    if (!token) return null;
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (e) {
        console.error('Invalid token', e);
        return null;
    }
}

// ✅ This is a valid hook
export const useAuth = () => {
    const qc = useQueryClient()
    const tokenStore = useTokenStore()
    const { toAuth } = useAppNavigation()
    const { publicCall } = useApi('auth')

    // ✅ helper is now a closure inside the hook — can use hooks' values
    const handleAuth = async (type: '/login' | '/register', payload: any) => {
        const token = await publicCall<string>('post', type, payload)
        tokenStore.set(token)
        await qc.invalidateQueries({ queryKey: ['team', token] })
        return jwtDecode<DecodedToken>(token)
    }

    const login = async (accessCode: string) => handleAuth('/login', accessCode)
    const register = async (teamName: string) => handleAuth('/register', teamName)

    const logout = () => {
        qc.removeQueries({ queryKey: ['team', tokenStore.get()] })
        tokenStore.clear()
        toAuth()
    }

    return { login, register, logout }
}