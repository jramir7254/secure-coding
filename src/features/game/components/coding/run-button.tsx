import { Button } from '@/components/ui/button'
import React, { useState, type SetStateAction } from 'react'
import { Play } from 'lucide-react';
import { PistonApi } from '@/lib/api';
import { useCodingAttempt, type Question } from '../../hooks/use-question';


export default function RunButton({ hidden, question, attemptId, input, setOutput }: {
    hidden: boolean,
    question: Question,
    attemptId: number,
    input: string,
    setOutput: React.Dispatch<SetStateAction<string>>
}) {
    const submitAttempt = useCodingAttempt({ questionId: question.id, attemptId, questionType: 'coding' })

    const [loading, setIsLoading] = useState(false)

    async function run() {
        try {
            setIsLoading(true)
            console.log("input", input)
            const { output } = await submitAttempt.mutateAsync(input)
            console.log("d", output)
            setOutput(output)

        } catch (error) {
            console.debug('err', error)
            setOutput(error.message)

        } finally {
            setIsLoading(false)

        }

    }

    return (
        <Button hidden={hidden} onClick={run} disabled={loading}>Run<Play /></Button>
    )
}
