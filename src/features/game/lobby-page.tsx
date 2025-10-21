import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DevBlock } from '@/components/blocks'
import useAppNavigation from '@/hooks/use-nav'
import { useTeam } from '@/features/auth/hooks/use-team'
import CountdownNum from '@/components/blocks/countdown-num'


export default function LobbyPage() {
    const { data: team, isLoading, error } = useTeam();

    return (
        <DevBlock className='size-full size-screen bg-accent relative'>
            LobbyPage waiting for game to start
            <CountdownNum />
        </DevBlock>
    )
}
