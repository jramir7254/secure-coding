import React, { useEffect, useState } from 'react'
import CreateGameForm from './components/create-game-form'
import { usePastGames, useCurrentGame } from '../game/hooks/use-game'
import PastGamesList from './components/past-games-list'
import { Button } from '@/components/ui/button'
import { DevBlock, Block, Section } from '@/components/blocks'
import { DevCard } from '@/components/blocks'
import { socket } from '@/lib/socket'
import { Separator } from '@/components/ui/separator'
import { useCloseGame } from './hooks/use-admin'
import { useCurrentGameTeams } from '../game/hooks/use-game'
import TeamCard from '@/components/blocks/team-card'
import { ScrollArea } from "@/components/ui/scroll-area"
import CountdownTimer from '@/components/blocks/timer'
import { EndGameButton } from './components/buttons'
import CountdownNum from '@/components/blocks/countdown'
import { DeleteTeamButton } from './components/buttons'
import GameCard from './components/game-card'

export default function GamesPage() {
    const { data: currentGame } = useCurrentGame()
    const { data: currentTeams } = useCurrentGameTeams()
    const { data: pastGames } = usePastGames()
    const closeGame = useCloseGame()


    const didGameStart = currentGame?.startedAt !== null

    const sendMessage = () => {
        socket.emit('start_timer');
    };

    return (
        <Section className='grid grid-cols-2 size-full'>
            <Section className='p-8 flex flex-col'>
                {currentGame ?
                    <>
                        <h2 className='font-nunit font-bold text-2xl mb-5'>Current Game</h2>
                        <GameCard game={currentGame}>

                            <div className='absolute top-0 right-0'>
                                <CountdownTimer />
                            </div>
                            <CountdownNum />
                            <div className='ml-auto flex gap-4' hidden={currentGame.endedAt !== null}>
                                <Button className='ml-auto w-fit' variant={didGameStart ? 'outline' : 'default'} disabled={didGameStart} onClick={sendMessage}>
                                    {didGameStart ? 'In Progress' : 'Start Game'}
                                </Button>
                                <div hidden={!didGameStart}>
                                    <EndGameButton />
                                </div>
                            </div>
                            <div className='ml-auto flex gap-4' hidden={currentGame.endedAt === null}>
                                <Button onClick={() => closeGame.mutateAsync()}>New Game</Button>
                            </div>
                        </GameCard>
                    </>
                    :
                    <>
                        <h2 className='font-nunit font-bold text-2xl mb-5'>Create Game</h2>
                        <CreateGameForm />
                    </>
                }
                <Separator />

            </Section>


            <Section className='p-8'>
                <h2 className='font-nunit font-bold text-2xl mb-5'>Past Games</h2>
                <ScrollArea className='h-full max-h-[75%]'>

                    {/* {currentTeams && currentTeams.map(t =>
                        <TeamCard key={`${t.teamName}-${t.id}`} team={t} >
                            <p>{t.accessCode}</p>
                            <DeleteTeamButton teamId={t.id} teamName={t.teamName} />
                        </TeamCard>
                    )} */}
                    <div className='space-y-2'>

                        {pastGames && pastGames.map(g =>
                            <GameCard key={`past-${g.id}`} game={g} className='cursor-pointer' />
                        )}
                    </div>
                </ScrollArea>
            </Section>
        </Section>
    )
}
