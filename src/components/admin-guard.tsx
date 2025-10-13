import React from 'react'
import useAuth from '@/hooks/use-auth'
import UnauthorizedPage from './unauthorized'

export default function RequireAdmin({ children, isPage = false }: { children: React.ReactNode, isPage?: boolean }) {
    const { isAdmin, isLoggedIn } = useAuth()
    console.log("is page", { isPage })

    if (!isLoggedIn || !isAdmin()) return isPage ? <UnauthorizedPage /> : null

    return children
}
