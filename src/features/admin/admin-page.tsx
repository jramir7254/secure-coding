import React from 'react'
import CreateGameForm from './components/create-game-form'
import { usePastGames, useCurrentGame } from '../game/hooks/use-game'
import PastGamesList from './components/past-games-list'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
    const { data: currentGame } = useCurrentGame()

    return (
        <section className='flex-1 grid grid-cols-2 gap-5 m-5'>
            <div className='bg-accent border-2 rounded-md overflow-hidden' >

                {currentGame ?
                    <div>
                        <h3>Current Game</h3>
                        <p>id: {currentGame.id}</p>
                        <p>max: {currentGame.maxTeams}</p>
                        {currentGame.startedAt ? <p>stareted</p> : <Button>Start Game</Button>}

                    </div>
                    : <CreateGameForm />}
            </div>
            <div className='bg-accent border-2 rounded-md overflow-hidden' >
                <PastGamesList />
            </div>
        </section>
    )
}