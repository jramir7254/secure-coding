import React from 'react'
import UnauthorizedPage from './unauthorized'
import useAppNavigation from '@/hooks/use-nav'

export default function RequireAdmin({ children, isPage = false }: { children: React.ReactNode, isPage?: boolean }) {
    const { data: user, isLoading, error } = useTeam();

    if (!user || !user?.isAdmin) return isPage ? <UnauthorizedPage /> : null

    return children
}


export function RequireTeam({ children, alt, isPage = false }: { children: React.ReactNode, alt?: React.ReactNode, isPage?: boolean }) {
    const { data: user, isLoading, error } = useTeam();


    if (isLoading) return <p>Checking authentication...</p>;

    if (error || !user) {
        // Redirect to login if not authenticated
        return isPage ? <Navigate to="/" replace /> : null
    }

    return children
}

import { Navigate, Outlet } from 'react-router';
import { useTeam } from '@/features/auth/hooks/use-team'

// RequireAuth.tsx


export function RequireAuth({ requireAdmin = false }: { requireAdmin?: boolean }) {
    const { data: user, isLoading, error } = useTeam();

    if (isLoading) return <p>Checking authentication...</p>;

    if (error || !user) return <Navigate to="/" replace />;
    if (requireAdmin && !user.isAdmin) return <Navigate to="/unauthorized" replace />;

    return <Outlet />;
}