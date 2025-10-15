import React from 'react'
import CreateGameForm from './components/create-game-form'
import { usePastGames, useCurrentGame } from '../game/hooks/use-game'
import PastGamesList from './components/past-games-list'
import { Button } from '@/components/ui/button'
import { DevBlock } from '@/components/dev-blocks'
import ResetButton from './components/reset-button'
import { DevCard } from '@/components/dev-blocks'
import { socket } from '@/lib/socket'

export default function AdminPage() {
    const { data: currentGame } = useCurrentGame()

    const sendMessage = () => {
        console.log('here')
        socket.emit('send_message', 'test');
    };

    return (
        <section className='flex-1 grid grid-cols-2 gap-5 m-5'>
            <DevBlock >

                {currentGame ?
                    <DevCard>
                        <h3>Current Game</h3>
                        <p>id: {currentGame.id}</p>
                        <p>max: {currentGame.maxTeams}</p>
                        {currentGame.startedAt ? <p>stareted</p> : <Button onClick={sendMessage}>Start Game</Button>}

                    </DevCard>
                    : <CreateGameForm />}
                <ResetButton />
            </DevBlock>
            <DevBlock >
                <PastGamesList />
            </DevBlock>
        </section>
    )
}