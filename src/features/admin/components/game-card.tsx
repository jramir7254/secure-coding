import React from 'react'
import { DevCard } from '@/components/blocks'
import { useCurrentGameTeams, type GameSchema } from '@/features/game/hooks/use-game'
import { msToMinutes, formatDate, cn } from '@/lib/utils'
import { Separator } from '@radix-ui/react-separator'

export default function GameCard({ game, children, className, ...props }: { game: GameSchema, children?: React.ReactNode } & React.ComponentProps<'div'>) {
    const { data: currentTeams } = useCurrentGameTeams()
    const { isCurrent, startedAt, endedAt, id, maxTeams, timeLimit, teamsPlayed } = game

    const isFull = (currentTeams?.length || 0) === maxTeams

    return (
        <DevCard className={cn(className, !isCurrent ? 'flex flex-row items-center h-15 py-2' : 'flex-col py-5', 'px-5 relative overflow-hidden font-nunit flex gap-3')} {...props}>
            <h3 className='font-bold text-lg'>Game #{id}</h3>
            <Separator className='border h-full' orientation={isCurrent ? 'horizontal' : 'vertical'} />


            {isCurrent ? (
                <p className={isFull ? 'text-red-500' : 'text-foreground'}>
                    <strong>Teams: </strong>
                    <span className='text-muted-foreground'>{currentTeams?.length || 0}/{maxTeams}</span>
                </p>
            ) : (
                <p >Teams Played: <span className='text-muted-foreground'>{teamsPlayed}</span></p>
            )}

            <p hidden={!isCurrent}><strong>Time Limit:</strong> <span className='text-muted-foreground'>{msToMinutes(timeLimit)} minutes</span></p>

            <div hidden={!isCurrent} className='flex gap-10'>
                <p><strong>Started At:</strong> {startedAt ? <span className='text-muted-foreground'>{formatDate(startedAt)}</span> : <span className='text-muted-foreground italic'>Game not started</span>}</p>
                <p><strong>Ended At:</strong> {endedAt ? formatDate(endedAt) : <span className='text-muted-foreground italic'>Game not ended</span>}</p>
            </div>

            <div hidden={isCurrent} className='flex gap-10'>
                <p>Started At: {startedAt ? <span className='text-muted-foreground'>{formatDate(startedAt)}</span> : <span className='text-muted-foreground italic'>Game not started</span>}</p>
                <p>Ended At: {endedAt ? <span className='text-muted-foreground'>{formatDate(endedAt)}</span> : <span className='text-muted-foreground italic'>Game not ended</span>}</p>
            </div>

            {children}
        </DevCard>
    )
}
