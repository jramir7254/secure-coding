import React from 'react'
import { useIsAttemptComplete } from '../../hooks/use-question'
import { Button } from '@/components/ui'
import { TbPlayerTrackNextFilled } from "react-icons/tb";
import { useQueryClient } from '@tanstack/react-query'
import { questionKeys } from '../../hooks/query-keys'
export default function NextButton() {
    const complete = useIsAttemptComplete()
    const queryClient = useQueryClient()

    const nextQuestion = () => {
        queryClient.invalidateQueries({ queryKey: questionKeys.current() });
    }

    return (
        <Button onClick={nextQuestion} hidden={!complete}>
            <TbPlayerTrackNextFilled /> Next Question
        </Button>
    )
}
