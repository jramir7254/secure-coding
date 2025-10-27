import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DevCard, Block, Section } from '@/components/blocks'
import { useTeam } from '@/features/auth/hooks/use-team'
import CountdownNum from '@/components/blocks/countdown'
import { ScrollArea, Separator } from '@/components/ui'
import { useCurrentGameTeams, useOverallLeaderboard } from './hooks/use-game'
import TeamCard from '@/components/blocks/team-card'
import { TopTeamCard } from './components/cards/top-team-card'

export default function LobbyPage() {
    const { data: team, isLoading, error } = useTeam();
    const { data: teams } = useCurrentGameTeams()
    const { data: topTeams } = useOverallLeaderboard()


    return (
        <Block className='w-full bg-none  grid grid-cols-3 grid-rows-3 relative mx-10 my-10 gap-10 overflow-hidden'>

            <Section className='col-span-1 row-span-3 p-5'>
                <DevCard className='p-10 h-full border-2 '>
                    <h3 className='font-nunit font-bold text-3xl'>{team?.teamName}</h3>
                    <p>Access Code: {team?.accessCode}</p>
                </DevCard>
            </Section>

            <Section className='col-span-2 row-span-1 p-5 px-10'>
                <h3 className='font-nunit text-2xl font-bold mb-3'>Top 3 Teams</h3>
                <div className='flex size-full  gap-10 '>
                    <TopTeamCard variant='gold' team={topTeams && topTeams[0]} />
                    <TopTeamCard variant='silver' team={topTeams && topTeams[1]} />
                    <TopTeamCard variant='bronze' team={topTeams && topTeams[2]} />
                </div>
                <Separator className='mt-3' />
            </Section>

            <Section className='col-span-2 row-span-2 px-10'>
                <h3 className='font-nunit text-2xl font-bold my-5'>Teams in this game</h3>
                <ScrollArea>
                    {teams && teams.map(t => <TeamCard key={`lobby-${t.teamName}`} team={t} />)}
                </ScrollArea>
            </Section>

            <CountdownNum />
        </Block>
    )
}
