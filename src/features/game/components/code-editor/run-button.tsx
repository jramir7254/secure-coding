import { Button } from '@/components/ui/button'
import React, { useState, type SetStateAction } from 'react'
import { Play } from 'lucide-react';
import { useCurrentQuestion, useQuestionAttempt } from '../../hooks/use-question';
import { useCodeEditor } from '../../context/editor-context'
import { logger } from '@/lib/logger';
import { loader } from '@monaco-editor/react';
import CooldownButton from '@/components/blocks/cooldown-button';

export default function RunButton() {
    const { pushToTerminal } = useCodeEditor()
    const questionData = useCurrentQuestion()
    const submitAttempt = useQuestionAttempt()
    const [loading, setIsLoading] = useState(false)



    const shouldHide = questionData?.type === 'mcq'

    logger.debug('Run button', { shouldHide, questionData, attemptData })

    // const submitAttempt = useCodingAttempt({ questionId: question.id, attemptId, questionType: 'coding' })


    async function run() {
        try {
            setIsLoading(true)
            const monaco = await loader.init()
            const models = monaco?.editor?.getModels?.();
            if (!models) return;

            const allModelValues = models.filter(model => model.getValue().length).map(model => ({
                uri: model.uri.toString(),
                value: model.getValue(),
            }));

            logger.debug(allModelValues);
            const { output } = await submitAttempt.mutateAsync(allModelValues)
            logger.debug("[output]", output)
            pushToTerminal(output)

        } catch (error: any) {
            console.debug('err', error)
            pushToTerminal(error.message)

        } finally {
            setIsLoading(false)

        }

    }

    return (
        <CooldownButton duration={30} action={run} hidden={shouldHide} disabled={loading}>
            Run <Play />
        </CooldownButton>
    )
}
