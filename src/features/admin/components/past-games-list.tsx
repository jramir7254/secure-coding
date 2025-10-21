import React from 'react'
import { usePastGames, useCurrentGame } from '../../game/hooks/use-game'
import { DevCard } from '@/components/blocks'
import { type GameSchema } from '../hooks/use-admin'

export default function PastGamesList() {
    const { data: pastGames, isLoading } = usePastGames()

    return (
        <div className='flex flex-col items-center  size-full '>
            {isLoading ? '...loading' : (pastGames && pastGames.length ? GameCards(pastGames) : <p className='text-muted-foreground mt-10 italic'>No past games to show</p>)}
        </div>
    )
}


function GameCards(pastGames: GameSchema[]) {
    return pastGames.map(g => (
        <DevCard key={`${g.id}-past`} className='w-full'>
            <p>Game #{g.id}</p>
            <p>{new Date(g?.endedAt).toLocaleTimeString()}</p>
        </DevCard>
    ))
}