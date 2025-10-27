import React from 'react'
import { Card } from '@/components/ui/card'
import { type TeamSchema } from "@/features/admin/hooks/use-admin"
import { Flex } from '@/components/blocks'

type TopThreePlaces = 'gold' | 'silver' | 'bronze'

export function TopTeamCard({ variant, team }: { variant: TopThreePlaces, team: TeamSchema | undefined }) {

    const variants: Record<TopThreePlaces, string> = {
        gold: 'from-yellow-200/60 via-yellow-500 to-yellow-300',
        silver: 'from-gray-200/50 via-gray-500 to-gray-400',
        bronze: 'from-amber-200/50 via-amber-500 to-amber-400'
    }

    return (
        <Card
            className={`
                flex-1 !bg-transparent !border-none !shadow-none animate-rotate-border transition-all 
                duration-500 ease-out rounded-lg bg-conic/[from_var(--border-angle)] 
                ${variants[variant]} from-80% via-90% to-100% p-[2px]
            `}
        >
            <Flex centered className="rounded-lg bg-card size-full  text-white/50 bg-none border border-neutral-800">
                {!team && <p>TBD</p>}
                {team && <div><p>{team.teamName}</p><p>{team.points}</p></div>}
            </Flex>
        </Card>
    )
}
