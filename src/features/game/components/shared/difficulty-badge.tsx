import React from 'react'
import { Badge } from '@/components/ui/badge'
import { type Difficulties } from '../../types/questions'

export default function DifficultyBadge({ difficulty }: { difficulty: Difficulties }) {


    const styles: Record<Difficulties, string> = {
        easy: 'border-green-400 bg-green-400/30 border-2',
        medium: 'border-yellow-400 bg-yellow-400/30 border-2',
        hard: 'border-red-400/70 bg-red-400/30 border-2'
    }

    return (
        <Badge className={`w-15 ${styles[difficulty]}`} variant={'outline'}>
            {difficulty}
        </Badge>
    )
}
