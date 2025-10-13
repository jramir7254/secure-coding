import { useEffect, useState } from 'react';
import { tokenStore } from '@/features/auth/api/token-store';
import { jwtDecode } from 'jwt-decode';
import useAppNavigation from '@/hooks/use-nav'; // 👈 import your nav hook

export type DecodedToken = {
    teamName: string;
    accessCode: string;
    isAdmin: boolean;
};

export default function useAuth() {
    const [token, setToken] = useState<string | null>(tokenStore.get());
    const { toAuth } = useAppNavigation(); // 👈 assume this navigates to home page

    // Sync token changes (also works across tabs)
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(tokenStore.get());
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // 🧠 Redirect when user is not logged in
    useEffect(() => {
        // Avoid race condition: only redirect after first mount check
        if (token === null) {
            toAuth();
        }
    }, [token]);

    const isLoggedIn = !!token;

    const getTeam = (): DecodedToken | null => {
        if (!token) return null;
        const team = jwtDecode<DecodedToken>(token);
        console.debug('Team: ', team)
        return team
    };

    const logout = () => { tokenStore.clear(), setToken(null) }

    const isAdmin = () => getTeam()?.isAdmin

    const team = getTeam()

    return { token, isLoggedIn, getTeam, team, logout, isAdmin };
}
