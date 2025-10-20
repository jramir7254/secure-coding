import React, { useEffect, useState } from 'react'
import CreateGameForm from './components/create-game-form'
import { usePastGames, useCurrentGame } from '../game/hooks/use-game'
import PastGamesList from './components/past-games-list'
import { Button } from '@/components/ui/button'
import { DevBlock } from '@/components/dev-blocks'
import ResetButton from './components/reset-button'
import { DevCard } from '@/components/dev-blocks'
import { socket } from '@/lib/socket'
import { Separator } from '@/components/ui/separator'
import { useCurrentGameTeams } from './hooks/use-admin'
import TeamCard from './components/team-card'
import { ScrollArea } from "@/components/ui/scroll-area"
import CountdownTimer from '@/components/blocks/timer'
import { EndGameButton } from './components/buttons'
import CountdownNum from '@/components/blocks/countdown-num'

export default function AdminPage() {
    const { data: currentGame } = useCurrentGame()
    const { data: currentTeams } = useCurrentGameTeams()


    const didGameStart = currentGame?.startedAt !== null

    const sendMessage = () => {
        socket.emit('start_timer');
    };



    const isFull = (currentTeams?.length || 0) === currentGame?.maxTeams


    return (
        <section className='flex-1 grid grid-cols-2 gap-5 m-5'>
            <DevBlock className='p-8 flex flex-col gap-3'>
                <div className=''>
                    {currentGame ?
                        <DevCard className='p-5 relative'>
                            <CountdownNum />
                            <h3>Current Game #{currentGame.id}</h3>
                            <p className={isFull ? 'text-red-500' : 'text-foreground'}>Teams: {currentTeams?.length || 0}/{currentGame.maxTeams}</p>
                            <p>Time Limit: {currentGame.timeLimit / 60 / 1_000}</p>
                            <p>Started At: {currentGame?.startedAt ? currentGame.startedAt : <span className='text-muted-foreground italic'>Game not started</span>}</p>
                            <p>Ended At: {currentGame?.endedAt ? currentGame.endedAt : <span className='text-muted-foreground italic'>Game not ended</span>}</p>
                            <div><CountdownTimer /></div>
                            <div className='ml-auto flex gap-4' hidden={currentGame.endedAt !== null}>
                                <Button className='ml-auto w-fit' variant={didGameStart ? 'outline' : 'default'} disabled={didGameStart} onClick={sendMessage}>
                                    {didGameStart ? 'In Progress' : 'Start Game'}
                                </Button>
                                <div hidden={!didGameStart}>
                                    <EndGameButton />
                                </div>
                            </div>
                            <div className='ml-auto flex gap-4' hidden={currentGame.endedAt === null}>
                                <Button variant='outline' disabled>Game Finished</Button>
                            </div>
                        </DevCard>
                        :
                        <>
                            <h2 className='font-nunit font-bold text-2xl'>Create Game</h2>
                            <CreateGameForm />
                        </>
                    }
                </div>
                <Separator />
                <div className='h-full'>
                    <h2>Teams Joined</h2>
                    <ScrollArea className='mt-5 h-full'>
                        {currentTeams && currentTeams.map(t => <TeamCard key={`${t.teamName}-${t.id}`} team={t} />)}
                    </ScrollArea>
                </div>
            </DevBlock>


            <DevBlock className='p-8'>
                <h2 className='font-nunit font-bold text-2xl'>Past Games</h2>
                <PastGamesList />
            </DevBlock>
        </section>
    )
}