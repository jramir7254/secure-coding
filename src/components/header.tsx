import React from 'react'
import { Button, buttonVariants } from './ui/button'
import { NavLink } from 'react-router'
import RequireAdmin from './admin-guard'
import useAuth from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export default function Header() {
    const { team } = useAuth()
    return (
        <header className='h-16 bg-accent border-b-2'>
            <RequireAdmin>
                <Button asChild variant="link">
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            isActive ? "underline" : undefined
                        }
                    >
                        Admin
                    </NavLink>
                </Button>
            </RequireAdmin>

            <Button asChild variant="link">
                <NavLink to={`/${team?.teamName}`} className={({ isActive }) =>
                    isActive ? "text-primary font-semibold" : "text-muted-foreground" // Example active styling
                }>
                    Home
                </NavLink>
            </Button>

        </header>
    )
}
