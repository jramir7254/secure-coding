import React from 'react'
import { usePastGames, useCurrentGame } from '../../game/hooks/use-game'
import { DevCard } from '@/components/dev-blocks'
import type { GameSchema } from '@/features/game/api/game-api'

export default function PastGamesList() {
    const { data: pastGames, isLoading } = usePastGames()

    return (
        <div className='flex-col'>
            {isLoading ? '...loading' : (pastGames && pastGames.length ? GameCards(pastGames) : <p>No past games to show</p>)}
        </div>
    )
}


function GameCards(pastGames: GameSchema[]) {
    return pastGames.map(g => (
        <DevCard>
            <p>{g.id}</p>
            <p>{g.endedAt}</p>
        </DevCard>
    ))
}