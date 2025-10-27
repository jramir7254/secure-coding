import React from 'react'
import { Button, buttonVariants } from './ui/button'
import { NavLink } from 'react-router'
import RequireAdmin from './admin-guard'
import { cn } from '@/lib/utils'
import { LogoutButton } from '@/features/auth/components/logout-button'
import { RequireTeam } from './admin-guard'
import ResetButton from '@/features/admin/components/buttons/reset-button'
import { useTeam } from '@/features/auth/hooks/use-team'



export default function Header() {
    const { data: team, isLoading, error } = useTeam();

    return (
        <header className='h-20 bg-accent border-b-2 flex justify-between items-center px-16 z-1'>

            <div className='flex items-center gap-5 cursor-pointer'>
                <div className='h-10 w-10 overflow-hidden flex items-center justify-center'>
                    <img src='/htb.png' className='object-cover' />
                </div>
                <h3 className='font-bebas text-4xl tracking-wider'>Secure Coding</h3>
            </div>

            <nav className='flex items-center gap-5' >
                <RequireTeam>
                    <LogoutButton />
                </RequireTeam>
                <RequireAdmin>
                    <ResetButton />
                </RequireAdmin>
                <NavLink to='/how-to-play' className={({ isActive }) => isActive ? 'underline' : ''}>
                    How To Play
                </NavLink>

            </nav>


        </header>
    )
}
