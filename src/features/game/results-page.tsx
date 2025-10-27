import { logger } from '@/lib/logger'
import React from 'react'

import { useTeamResults } from './hooks/use-game'
import { useTeam } from '../auth/hooks/use-team';
import { useQuestions } from './hooks/use-question';

export default function ResultsPage() {
    const { data: team, isLoading, error } = useTeam();
    const { data: questions } = useQuestions();
    const { data } = useTeamResults(team?.id || '')
    return (
        <div className=''>
            {questions && questions.map(q =>
                <div>
                    <p>{q.id}</p>
                </div>
            )}
        </div>
    )
}
