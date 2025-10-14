import React from 'react'
import { usePastGames, useCurrentGame } from '../../game/hooks/use-game'


export default function PastGamesList() {
    const { data: pastGames, isLoading } = usePastGames()

    return (
        <div className='flex-col'>
            {isLoading ? '...loading' : (pastGames && pastGames.length ? <p>past games here</p> : <p>No past games to show</p>)}
        </div>
    )
}
